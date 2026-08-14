// Transport layer for Tally.
//
// ============================================================================
//  THIS IS THE ONLY FILE THAT TALKS TO TALLY.
//  To go live, fill in the Tally settings in the admin panel:
//    Admin -> Settings -> Tally integration
//      - Enable Tally sync        (on)
//      - Endpoint URL             https://<your-tally-cloud-host>/  (or http://localhost:9000)
//      - Auth header / token      only if your Tally Cloud provider requires one
//      - Company name             exact company name in Tally
//      - Ledger names             must already exist in that company
//  No code change is needed for the standard Tally XML API. If your cloud
//  provider uses a different payload format, change buildSalesVoucherXml()
//  in ./voucherXml.mjs - the transport below stays the same.
// ============================================================================

import { parseTallyResponse } from "./voucherXml.mjs";

export class TallyNotConfiguredError extends Error {
  constructor(message) {
    super(message);
    this.name = "TallyNotConfiguredError";
    this.code = "not-configured";
  }
}

export function tallyConfigProblem(config = {}) {
  if (!config.enabled) return "Tally sync is turned off in Settings.";
  if (!config.endpoint) return "Tally endpoint URL is not set in Settings.";
  if (!config.companyName) return "Tally company name is not set in Settings.";
  return "";
}

/**
 * POSTs a Tally XML envelope and interprets the reply.
 * @returns {Promise<{ok:boolean, message:string, voucherId:string, raw:string, status:number}>}
 */
export async function sendToTally(xml, config = {}, { timeoutMs = 20000, fetchImpl = fetch } = {}) {
  const problem = tallyConfigProblem(config);
  if (problem) throw new TallyNotConfiguredError(problem);

  const headers = { "content-type": "text/xml; charset=utf-8" };
  // Tally Cloud hosts usually sit behind an auth header; on-premise Tally needs none.
  if (config.authToken) {
    headers[config.authHeader || "authorization"] = config.authHeader
      ? config.authToken
      : `Bearer ${config.authToken}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(config.endpoint, {
      method: "POST",
      headers,
      body: xml,
      signal: controller.signal,
    });
    const text = await response.text();

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        voucherId: "",
        message: `Tally endpoint returned HTTP ${response.status}`,
        raw: text.slice(0, 2000),
      };
    }

    return { ...parseTallyResponse(text), status: response.status };
  } catch (error) {
    if (error.name === "AbortError") {
      return { ok: false, status: 0, voucherId: "", message: `Tally did not respond within ${timeoutMs / 1000}s`, raw: "" };
    }
    return { ok: false, status: 0, voucherId: "", message: error.message || "Could not reach Tally", raw: "" };
  } finally {
    clearTimeout(timer);
  }
}
