import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { catalogProducts } from "./src/catalogData.js";
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
} from "./src/seedData.js";
import { computeInvoiceTotals, toAmount } from "./src/invoiceMath.js";
import { buildSalesVoucherXml } from "./tally/voucherXml.mjs";
import { newTallyState, syncInvoice, syncPendingInvoices, tallyConfig } from "./tally/sync.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "db.json");
const port = Number(process.env.PORT || 5175);
const rupee = String.fromCharCode(8377);

function seedDb() {
  return {
    products: catalogProducts,
    orders: seedOrders,
    coupons: seedCoupons,
    homepageSections: seedHomepageSections,
    testimonials: seedTestimonials,
    reviews: seedReviews,
    banners: seedBanners,
    homepageProducts: seedHomepageProducts(catalogProducts),
    reels: seedReels(catalogProducts),
    collections: seedCollections,
    customers: [],
    invoices: [],
    settings: seedSettings,
  };
}

// Indian financial year runs April -> March, so FY 2026-27 renders as "2627".
function financialYearCode(date = new Date()) {
  const year = date.getFullYear();
  const startYear = date.getMonth() + 1 >= 4 ? year : year - 1;
  return `${String(startYear).slice(-2)}${String(startYear + 1).slice(-2)}`;
}

function nextInvoiceNumber(db, date = new Date()) {
  const prefix = `INV-${financialYearCode(date)}-`;
  const highest = (db.invoices || [])
    .filter((invoice) => String(invoice.number || "").startsWith(prefix))
    .reduce((max, invoice) => Math.max(max, Number(String(invoice.number).slice(prefix.length)) || 0), 0);
  return `${prefix}${String(highest + 1).padStart(4, "0")}`;
}

function buildInvoice(db, payload, date = new Date()) {
  const settings = db.settings || {};
  const config = tallyConfig(settings);
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
    gstRate: Number(settings.gstGold || 3),
    sellerState: config.sellerState,
    placeOfSupply,
    shipping: payload.shipping || 0,
    pricesIncludeGst: config.pricesIncludeGst !== false,
  });

  return {
    id: `inv-${Date.now()}`,
    number: nextInvoiceNumber(db, date),
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

async function readDb() {
  await mkdir(dataDir, { recursive: true });
  if (!existsSync(dbPath)) await writeDb(seedDb());
  const db = JSON.parse(await readFile(dbPath, "utf8"));
  const seed = seedDb();
  let changed = false;
  for (const [key, value] of Object.entries(seed)) {
    if (db[key] === undefined) {
      db[key] = value;
      changed = true;
    }
  }
  if (changed) await writeDb(db);
  return db;
}

async function writeDb(db) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dbPath, JSON.stringify(db, null, 2), "utf8");
}

async function bodyJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function send(res, status, data) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
    "access-control-allow-headers": "content-type",
  });
  res.end(JSON.stringify(data));
}

function priceNumber(value) {
  return Number(String(value || "").replace(/[^0-9]/g, ""));
}

function priceFormat(value) {
  return `${rupee}${Math.max(0, Math.round(value)).toLocaleString("en-IN")}`;
}

function applyPatch(list, id, patch) {
  return list.map((item) => String(item.id) === String(id) ? { ...item, ...patch } : item);
}

createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") return send(res, 200, { ok: true });
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (!url.pathname.startsWith("/api")) return send(res, 404, { error: "Not found" });
    const db = await readDb();

    if (req.method === "GET" && url.pathname === "/api/admin") return send(res, 200, db);

    // ---- Invoices + Tally ---------------------------------------------------

    if (req.method === "POST" && url.pathname === "/api/invoices") {
      const payload = await bodyJson(req);
      if (!payload.items?.length) return send(res, 400, { error: "Invoice needs at least one item" });

      const invoice = buildInvoice(db, payload);
      const order = orderFromInvoice(invoice);
      invoice.orderId = order.id;

      db.invoices = [invoice, ...(db.invoices || [])];
      db.orders = [order, ...(db.orders || [])];
      await writeDb(db);

      // Books should only carry real sales, so an unpaid order waits in the queue
      // until it is marked Paid (see the PATCH /api/orders handler below).
      let syncResult = { ok: false, message: "Queued - will sync when the order is marked Paid" };
      if (invoice.status === "paid") {
        const synced = await syncInvoice(invoice, db.settings);
        db.invoices = applyPatch(db.invoices, invoice.id, synced.invoice);
        syncResult = synced.result;
        await writeDb(db);
      }

      return send(res, 200, { ...db, createdInvoice: invoice.number, tallySync: syncResult });
    }

    if (req.method === "POST" && url.pathname.startsWith("/api/invoices/") && url.pathname.endsWith("/tally-sync")) {
      const id = decodeURIComponent(url.pathname.split("/").at(-2));
      const invoice = (db.invoices || []).find((item) => String(item.id) === String(id));
      if (!invoice) return send(res, 404, { error: "Invoice not found" });

      const synced = await syncInvoice(invoice, db.settings, { force: true });
      db.invoices = applyPatch(db.invoices, id, synced.invoice);
      await writeDb(db);
      return send(res, 200, { ...db, tallySync: synced.result });
    }

    // Returns the exact XML that would be sent - useful for verifying ledger
    // names against Tally before switching the integration on.
    if (req.method === "GET" && url.pathname.startsWith("/api/invoices/") && url.pathname.endsWith("/tally-xml")) {
      const id = decodeURIComponent(url.pathname.split("/").at(-2));
      const invoice = (db.invoices || []).find((item) => String(item.id) === String(id));
      if (!invoice) return send(res, 404, { error: "Invoice not found" });
      return send(res, 200, { number: invoice.number, xml: buildSalesVoucherXml(invoice, tallyConfig(db.settings)) });
    }

    if (req.method === "POST" && url.pathname === "/api/tally/sync-pending") {
      const outcome = await syncPendingInvoices(db.invoices || [], db.settings);
      db.invoices = outcome.invoices;
      await writeDb(db);
      return send(res, 200, { ...db, tallyBatch: { summary: outcome.summary, results: outcome.results } });
    }

    if (req.method === "PATCH" && url.pathname.startsWith("/api/orders/")) {
      const id = decodeURIComponent(url.pathname.split("/").pop());
      const patch = await bodyJson(req);
      db.orders = applyPatch(db.orders, id, patch);

      // Marking an order Paid is what releases its invoice into Tally.
      let tallySync = null;
      const order = db.orders.find((item) => String(item.id) === String(id));
      const config = tallyConfig(db.settings);
      if (patch.statusKey === "paid" && order?.invoiceId && config.autoSyncOnPaid !== false) {
        const invoice = (db.invoices || []).find((item) => String(item.id) === String(order.invoiceId));
        if (invoice) {
          const synced = await syncInvoice({ ...invoice, status: "paid" }, db.settings);
          db.invoices = applyPatch(db.invoices, invoice.id, synced.invoice);
          tallySync = synced.result;
        }
      }

      await writeDb(db);
      return send(res, 200, tallySync ? { ...db, tallySync } : db);
    }

    if (req.method === "POST" && url.pathname === "/api/products") {
      const product = await bodyJson(req);
      db.products = [{ ...product, id: product.id || `manual-${Date.now()}` }, ...db.products];
      await writeDb(db);
      return send(res, 200, db);
    }

    if (req.method === "POST" && url.pathname === "/api/products/bulk-upload") {
      const { products = [] } = await bodyJson(req);
      const productKey = (item, fallback) => String(item?.sku || item?.id || fallback || "").toLowerCase();
      let added = 0;
      let updated = 0;
      for (const item of products) {
        if (!item?.name) continue;
        const key = productKey(item, item.name);
        const existingIndex = db.products.findIndex((product, index) => productKey(product, index) === key);
        if (existingIndex >= 0) {
          const existing = db.products[existingIndex];
          db.products[existingIndex] = { ...existing, ...item, id: existing.id };
          updated += 1;
        } else {
          db.products.unshift({ ...item, id: item.id || item.sku?.toLowerCase() || `bulk-${Date.now()}-${added}` });
          added += 1;
        }
      }
      await writeDb(db);
      return send(res, 200, { ...db, importSummary: { added, updated } });
    }

    if (req.method === "POST" && url.pathname === "/api/products/bulk-price") {
      const { category, direction, mode, value } = await bodyJson(req);
      const amount = Number(value || 0);
      db.products = db.products.map((product) => {
        const label = { Bracelet: "Bracelets", Necklace: "Necklaces", Pendant: "Pendants", Nosepins: "Nose Pins" }[product.category] || product.category;
        if (category !== "All categories" && label !== category) return product;
        const current = priceNumber(product.price);
        const delta = mode === "percent" ? current * (amount / 100) : amount;
        const next = direction === "increase" ? current + delta : current - delta;
        return { ...product, price: priceFormat(next), salePrice: priceFormat(next) };
      });
      await writeDb(db);
      return send(res, 200, db);
    }

    if (req.method === "PATCH" && url.pathname.startsWith("/api/products/")) {
      const id = decodeURIComponent(url.pathname.split("/").pop());
      db.products = applyPatch(db.products, id, await bodyJson(req));
      await writeDb(db);
      return send(res, 200, db);
    }

    if (req.method === "DELETE" && url.pathname.startsWith("/api/products/")) {
      const id = decodeURIComponent(url.pathname.split("/").pop());
      db.products = db.products.filter((product) => String(product.id) !== String(id));
      await writeDb(db);
      return send(res, 200, db);
    }

    const collectionMap = {
      "/api/coupons": "coupons",
      "/api/homepage": "homepageSections",
      "/api/homepage-products": "homepageProducts",
      "/api/reels": "reels",
      "/api/testimonials": "testimonials",
      "/api/reviews": "reviews",
      "/api/banners": "banners",
      "/api/collections": "collections",
      "/api/customers": "customers",
      "/api/invoices": "invoices",
      "/api/settings": "settings",
    };

    if ((req.method === "PUT" || req.method === "PATCH") && collectionMap[url.pathname]) {
      db[collectionMap[url.pathname]] = await bodyJson(req);
      await writeDb(db);
      return send(res, 200, db);
    }

    return send(res, 404, { error: "Route not found" });
  } catch (error) {
    return send(res, 500, { error: error.message });
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Manosi admin API running at http://127.0.0.1:${port}`);
});
