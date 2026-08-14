// Sync orchestration: decides what to send, records the outcome on the invoice,
// and keeps a retry count so a failing endpoint does not get hammered forever.

import { buildSalesVoucherXml, DEFAULT_TALLY_CONFIG } from "./voucherXml.mjs";
import { sendToTally, TallyNotConfiguredError, tallyConfigProblem } from "./client.mjs";

export function tallyConfig(settings = {}) {
  return { ...DEFAULT_TALLY_CONFIG, ...(settings.tally || {}) };
}

export function newTallyState() {
  return {
    status: "pending",
    attempts: 0,
    lastAttemptAt: null,
    lastError: null,
    voucherId: null,
    syncedAt: null,
  };
}

function stamp() {
  return new Date().toISOString();
}

/**
 * Attempts one push of a single invoice.
 * Never throws - the outcome is always written back onto invoice.tally.
 */
export async function syncInvoice(invoice, settings, options = {}) {
  const config = tallyConfig(settings);
  const state = { ...newTallyState(), ...(invoice.tally || {}) };

  if (state.status === "synced" && !options.force) {
    return { invoice, changed: false, result: { ok: true, message: "Already synced" } };
  }

  const problem = tallyConfigProblem(config);
  if (problem) {
    return {
      invoice: { ...invoice, tally: { ...state, status: "blocked", lastError: problem, lastAttemptAt: stamp() } },
      changed: true,
      result: { ok: false, message: problem, code: "not-configured" },
    };
  }

  if (state.attempts >= Number(config.maxAttempts || 5) && !options.force) {
    return {
      invoice: { ...invoice, tally: { ...state, status: "failed" } },
      changed: false,
      result: { ok: false, message: `Gave up after ${state.attempts} attempts. Use Retry to try again.` },
    };
  }

  let result;
  try {
    const xml = buildSalesVoucherXml(invoice, config);
    result = await sendToTally(xml, config, options);
  } catch (error) {
    if (error instanceof TallyNotConfiguredError) {
      result = { ok: false, message: error.message, voucherId: "" };
    } else {
      result = { ok: false, message: error.message || "Tally sync failed", voucherId: "" };
    }
  }

  const nextState = {
    ...state,
    attempts: state.attempts + 1,
    lastAttemptAt: stamp(),
    status: result.ok ? "synced" : "failed",
    lastError: result.ok ? null : result.message,
    voucherId: result.voucherId || state.voucherId,
    syncedAt: result.ok ? stamp() : state.syncedAt,
  };

  return { invoice: { ...invoice, tally: nextState }, changed: true, result };
}

/** Pushes every invoice that is waiting, oldest first. */
export async function syncPendingInvoices(invoices = [], settings = {}, options = {}) {
  const queue = invoices.filter((invoice) => invoice.tally?.status !== "synced");
  const updated = new Map();
  const results = [];

  for (const invoice of queue) {
    const { invoice: next, result } = await syncInvoice(invoice, settings, options);
    updated.set(next.id, next);
    results.push({ id: next.id, number: next.number, ok: result.ok, message: result.message });
  }

  return {
    invoices: invoices.map((invoice) => updated.get(invoice.id) || invoice),
    results,
    summary: {
      attempted: results.length,
      synced: results.filter((item) => item.ok).length,
      failed: results.filter((item) => !item.ok).length,
    },
  };
}
