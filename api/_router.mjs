// One router, two runtimes: server.mjs (local dev) and api/[...path].mjs
// (Vercel) both call handleApiRequest, so production and local behave the same.

import { catalogProducts } from "../src/catalogData.js";
import {
  seedBanners,
  seedCollections,
  seedCoupons,
  seedHomepageProducts,
  seedHomepageSections,
  seedOrders,
  seedReels,
  seedReviews,
  seedSettings,
  seedTestimonials,
} from "../src/seedData.js";
import { computeInvoiceTotals, toAmount } from "../src/invoiceMath.js";
import { buildSalesVoucherXml } from "../tally/voucherXml.mjs";
import { newTallyState, syncInvoice, syncPendingInvoices, tallyConfig } from "../tally/sync.mjs";
import * as db from "../db/client.mjs";

const rupee = String.fromCharCode(8377);

// Editorial collections kept as JSONB documents in the `store` table.
const STORE_KEYS = {
  coupons: "coupons",
  homepageSections: "homepageSections",
  homepageProducts: "homepageProducts",
  reels: "reels",
  testimonials: "testimonials",
  reviews: "reviews",
  banners: "banners",
  collections: "collections",
  customers: "customers",
  settings: "settings",
};

const ROUTE_TO_STORE = {
  "/api/coupons": "coupons",
  "/api/homepage": "homepageSections",
  "/api/homepage-products": "homepageProducts",
  "/api/reels": "reels",
  "/api/testimonials": "testimonials",
  "/api/reviews": "reviews",
  "/api/banners": "banners",
  "/api/collections": "collections",
  "/api/customers": "customers",
  "/api/settings": "settings",
};

export function storeDefaults() {
  return {
    coupons: seedCoupons,
    homepageSections: seedHomepageSections,
    homepageProducts: seedHomepageProducts(catalogProducts),
    reels: seedReels(catalogProducts),
    testimonials: seedTestimonials,
    reviews: seedReviews,
    banners: seedBanners,
    collections: seedCollections,
    customers: [],
    settings: seedSettings,
  };
}

function priceNumber(value) {
  return Number(String(value || "").replace(/[^0-9]/g, ""));
}

function priceFormat(value) {
  return `${rupee}${Math.max(0, Math.round(value)).toLocaleString("en-IN")}`;
}

function financialYearCode(date = new Date()) {
  const year = date.getFullYear();
  const startYear = date.getMonth() + 1 >= 4 ? year : year - 1;
  return `${String(startYear).slice(-2)}${String(startYear + 1).slice(-2)}`;
}

/** The whole admin payload, in the shape the frontend already expects. */
async function loadAdminPayload() {
  const defaults = storeDefaults();
  const [stored, products, orders, invoices] = await Promise.all([
    db.readStoreMany(Object.keys(STORE_KEYS)),
    db.listProducts(),
    db.listOrders(),
    db.listInvoices(),
  ]);

  const payload = { products, orders, invoices };
  for (const key of Object.keys(STORE_KEYS)) {
    payload[key] = stored[key] === undefined ? defaults[key] : stored[key];
  }
  return payload;
}

async function settings() {
  const stored = await db.readStore("settings");
  return stored || seedSettings;
}

async function buildInvoice(payload, date = new Date()) {
  const config = tallyConfig(await settings());
  const storeSettings = await settings();
  const dateISO = date.toISOString().slice(0, 10);
  const customer = payload.customer || {};
  const placeOfSupply = customer.state || payload.placeOfSupply || "";

  const items = (payload.items || []).map((item) => ({
    sku: item.sku || item.id || "",
    name: item.name || "",
    hsn: item.hsn || config.hsnCode,
    quantity: Number(item.quantity) || 1,
    rate: toAmount(item.rate ?? item.price),
  }));

  const totals = computeInvoiceTotals({
    items,
    gstRate: Number(storeSettings.gstGold || 3),
    sellerState: config.sellerState,
    placeOfSupply,
    shipping: payload.shipping || 0,
    pricesIncludeGst: config.pricesIncludeGst !== false,
  });

  return {
    id: `inv-${Date.now()}`,
    number: await db.nextInvoiceNumber(financialYearCode(date)),
    orderId: payload.orderId || "",
    date: date.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    dateISO,
    createdAt: date.toISOString(),
    customer: {
      name: customer.name || "",
      phone: customer.phone || "",
      email: customer.email || "",
      address: customer.address || "",
      city: customer.city || "",
      state: customer.state || "",
      pincode: customer.pincode || "",
      gstin: customer.gstin || "",
    },
    placeOfSupply,
    paymentMethod: payload.paymentMethod || "",
    status: payload.status || "unpaid",
    items: totals.lines,
    totals,
    tally: newTallyState(),
  };
}

function orderFromInvoice(invoice) {
  const item = invoice.items[0];
  return {
    id: invoice.orderId || `ORD-${Date.now()}`,
    status: invoice.status === "paid" ? "Paid" : "Pending payment",
    statusKey: invoice.status === "paid" ? "paid" : "pending",
    customer: invoice.customer.name,
    phone: invoice.customer.phone,
    address: [invoice.customer.address, invoice.customer.city, invoice.customer.state, invoice.customer.pincode]
      .filter(Boolean).join(", "),
    item: item ? item.name : "",
    quantity: invoice.items.reduce((sum, line) => sum + line.quantity, 0),
    total: `${rupee}${Math.round(invoice.totals.total).toLocaleString("en-IN")}`,
    date: invoice.date,
    dateISO: invoice.dateISO,
    invoiceId: invoice.id,
    invoiceNumber: invoice.number,
  };
}

/**
 * @param {{method:string, pathname:string, body:object}} request
 * @returns {Promise<{status:number, data:object}>}
 */
export async function handleApiRequest({ method, pathname, body = {} }) {
  if (method === "OPTIONS") return { status: 200, data: { ok: true } };
  if (!pathname.startsWith("/api")) return { status: 404, data: { error: "Not found" } };

  if (!db.hasDatabase()) {
    return { status: 503, data: { error: "DATABASE_URL is not configured for this deployment." } };
  }

  if (method === "GET" && pathname === "/api/admin") {
    return { status: 200, data: await loadAdminPayload() };
  }

  // ---- Invoices + Tally -----------------------------------------------------

  if (method === "POST" && pathname === "/api/invoices") {
    if (!body.items?.length) return { status: 400, data: { error: "Invoice needs at least one item" } };

    const invoice = await buildInvoice(body);
    const order = orderFromInvoice(invoice);
    invoice.orderId = order.id;

    await db.insertInvoice(invoice);
    await db.insertOrder(order);

    // Books should only carry real sales, so an unpaid order waits in the queue
    // until it is marked Paid (see the PATCH /api/orders handler below).
    let tallySync = { ok: false, message: "Queued - will sync when the order is marked Paid" };
    if (invoice.status === "paid") {
      const synced = await syncInvoice(invoice, await settings());
      await db.saveInvoice(synced.invoice);
      tallySync = synced.result;
    }

    return { status: 200, data: { ...(await loadAdminPayload()), createdInvoice: invoice.number, tallySync } };
  }

  if (method === "POST" && pathname.startsWith("/api/invoices/") && pathname.endsWith("/tally-sync")) {
    const id = decodeURIComponent(pathname.split("/").at(-2));
    const invoice = await db.getInvoice(id);
    if (!invoice) return { status: 404, data: { error: "Invoice not found" } };

    const synced = await syncInvoice(invoice, await settings(), { force: true });
    await db.saveInvoice(synced.invoice);
    return { status: 200, data: { ...(await loadAdminPayload()), tallySync: synced.result } };
  }

  // Returns the exact XML that would be sent - useful for verifying ledger
  // names against Tally before switching the integration on.
  if (method === "GET" && pathname.startsWith("/api/invoices/") && pathname.endsWith("/tally-xml")) {
    const id = decodeURIComponent(pathname.split("/").at(-2));
    const invoice = await db.getInvoice(id);
    if (!invoice) return { status: 404, data: { error: "Invoice not found" } };
    return { status: 200, data: { number: invoice.number, xml: buildSalesVoucherXml(invoice, tallyConfig(await settings())) } };
  }

  if (method === "POST" && pathname === "/api/tally/sync-pending") {
    const invoices = await db.listInvoices();
    const outcome = await syncPendingInvoices(invoices, await settings());
    for (const invoice of outcome.invoices) {
      if (invoice.tally?.lastAttemptAt) await db.saveInvoice(invoice);
    }
    return {
      status: 200,
      data: { ...(await loadAdminPayload()), tallyBatch: { summary: outcome.summary, results: outcome.results } },
    };
  }

  if (method === "PATCH" && pathname.startsWith("/api/orders/")) {
    const id = decodeURIComponent(pathname.split("/").pop());
    const order = await db.patchOrder(id, body);
    if (!order) return { status: 404, data: { error: "Order not found" } };

    // Marking an order Paid is what releases its invoice into Tally.
    let tallySync = null;
    const config = tallyConfig(await settings());
    if (body.statusKey === "paid" && order.invoiceId && config.autoSyncOnPaid !== false) {
      const invoice = await db.getInvoice(order.invoiceId);
      if (invoice) {
        const synced = await syncInvoice({ ...invoice, status: "paid" }, await settings());
        await db.saveInvoice(synced.invoice);
        tallySync = synced.result;
      }
    }

    const payload = await loadAdminPayload();
    return { status: 200, data: tallySync ? { ...payload, tallySync } : payload };
  }

  // ---- Products -------------------------------------------------------------

  if (method === "POST" && pathname === "/api/products") {
    await db.upsertProduct({ ...body, id: body.id || `manual-${Date.now()}` });
    return { status: 200, data: await loadAdminPayload() };
  }

  if (method === "POST" && pathname === "/api/products/bulk-upload") {
    const rows = body.products || [];
    let added = 0;
    let updated = 0;
    for (const item of rows) {
      if (!item?.name) continue;
      const existing = item.sku ? await db.findProductBySku(item.sku) : null;
      if (existing) {
        await db.upsertProduct({ ...existing, ...item, id: existing.id });
        updated += 1;
      } else {
        await db.upsertProduct({ ...item, id: item.id || item.sku?.toLowerCase() || `bulk-${Date.now()}-${added}` });
        added += 1;
      }
    }
    return { status: 200, data: { ...(await loadAdminPayload()), importSummary: { added, updated } } };
  }

  if (method === "POST" && pathname === "/api/products/bulk-price") {
    const { category, direction, mode, value } = body;
    const amount = Number(value || 0);
    const products = await db.listProducts();
    for (const product of products) {
      const label = { Bracelet: "Bracelets", Necklace: "Necklaces", Pendant: "Pendants", Nosepins: "Nose Pins" }[product.category] || product.category;
      if (category !== "All categories" && label !== category) continue;
      const current = priceNumber(product.price);
      const delta = mode === "percent" ? current * (amount / 100) : amount;
      const next = direction === "increase" ? current + delta : current - delta;
      await db.patchProduct(product.id, { price: priceFormat(next), salePrice: priceFormat(next) });
    }
    return { status: 200, data: await loadAdminPayload() };
  }

  if (method === "PATCH" && pathname.startsWith("/api/products/")) {
    const id = decodeURIComponent(pathname.split("/").pop());
    await db.patchProduct(id, body);
    return { status: 200, data: await loadAdminPayload() };
  }

  if (method === "DELETE" && pathname.startsWith("/api/products/")) {
    const id = decodeURIComponent(pathname.split("/").pop());
    await db.deleteProduct(id);
    return { status: 200, data: await loadAdminPayload() };
  }

  // ---- Editorial collections -------------------------------------------------

  if ((method === "PUT" || method === "PATCH") && ROUTE_TO_STORE[pathname]) {
    await db.writeStore(ROUTE_TO_STORE[pathname], body);
    return { status: 200, data: await loadAdminPayload() };
  }

  return { status: 404, data: { error: "Route not found" } };
}
