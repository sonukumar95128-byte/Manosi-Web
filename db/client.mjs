// Neon Postgres access, shared by the local dev server and the Vercel functions.
//
// DATABASE_URL comes from Neon. Set it in .env.local for local dev and in the
// Vercel project settings for production. Nothing else in the app reads it.

import { neon } from "@neondatabase/serverless";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let cached = null;

export function databaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
}

export function hasDatabase() {
  return Boolean(databaseUrl());
}

export function sql() {
  if (!hasDatabase()) {
    throw new Error("DATABASE_URL is not set. Add your Neon connection string to .env.local (local) or the Vercel project settings (production).");
  }
  if (!cached) cached = neon(databaseUrl());
  return cached;
}

export async function applySchema() {
  const schema = await readFile(path.join(__dirname, "schema.sql"), "utf8");
  const query = sql();
  // neon() cannot run multiple statements in one call, so split on statement ends.
  const statements = schema
    .split(/;\s*$/m)
    .map((statement) => statement.replace(/^\s*--.*$/gm, "").trim())
    .filter(Boolean);
  for (const statement of statements) await query.query(statement);
  return statements.length;
}

// ---- store (JSONB documents) ------------------------------------------------

export async function readStore(key, fallback = null) {
  const rows = await sql()`SELECT value FROM store WHERE key = ${key}`;
  return rows.length ? rows[0].value : fallback;
}

export async function writeStore(key, value) {
  await sql()`
    INSERT INTO store (key, value, updated_at) VALUES (${key}, ${JSON.stringify(value)}::jsonb, now())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
  `;
  return value;
}

/**
 * True when the key has a row, regardless of its value.
 * readStore() cannot answer this: passing `undefined` as its fallback triggers
 * the default parameter, so a missing row is indistinguishable from a stored null.
 */
export async function hasStoreKey(key) {
  const rows = await sql()`SELECT 1 FROM store WHERE key = ${key} LIMIT 1`;
  return rows.length > 0;
}

export async function readStoreMany(keys) {
  const rows = await sql()`SELECT key, value FROM store WHERE key = ANY(${keys})`;
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}

// ---- products ---------------------------------------------------------------

export async function listProducts() {
  const rows = await sql()`SELECT data FROM products ORDER BY position DESC, created_at DESC`;
  return rows.map((row) => row.data);
}

export async function upsertProduct(product, position) {
  const nextPosition = position ?? Date.now();
  await sql()`
    INSERT INTO products (id, sku, name, category, data, position, updated_at)
    VALUES (${product.id}, ${product.sku || null}, ${product.name || ""}, ${product.category || null},
            ${JSON.stringify(product)}::jsonb, ${nextPosition}, now())
    ON CONFLICT (id) DO UPDATE SET
      sku = EXCLUDED.sku, name = EXCLUDED.name, category = EXCLUDED.category,
      data = EXCLUDED.data, updated_at = now()
  `;
  return product;
}

/** Merges a patch into one product row without touching any other row. */
export async function patchProduct(id, patch) {
  const rows = await sql()`
    UPDATE products
       SET data = data || ${JSON.stringify(patch)}::jsonb,
           name = COALESCE(${patch.name || null}, name),
           sku = COALESCE(${patch.sku || null}, sku),
           category = COALESCE(${patch.category || null}, category),
           updated_at = now()
     WHERE id = ${String(id)}
     RETURNING data
  `;
  return rows.length ? rows[0].data : null;
}

export async function deleteProduct(id) {
  await sql()`DELETE FROM products WHERE id = ${String(id)}`;
}

export async function findProductBySku(sku) {
  const rows = await sql()`SELECT data FROM products WHERE lower(sku) = lower(${sku}) LIMIT 1`;
  return rows.length ? rows[0].data : null;
}

// ---- orders -----------------------------------------------------------------

export async function listOrders() {
  const rows = await sql()`SELECT data FROM orders ORDER BY created_at DESC`;
  return rows.map((row) => row.data);
}

export async function insertOrder(order) {
  await sql()`
    INSERT INTO orders (id, status_key, customer, phone, date_iso, invoice_id, data)
    VALUES (${order.id}, ${order.statusKey || "pending"}, ${order.customer || ""}, ${order.phone || ""},
            ${order.dateISO || null}, ${order.invoiceId || null}, ${JSON.stringify(order)}::jsonb)
    ON CONFLICT (id) DO NOTHING
  `;
  return order;
}

export async function patchOrder(id, patch) {
  const rows = await sql()`
    UPDATE orders
       SET data = data || ${JSON.stringify(patch)}::jsonb,
           status_key = COALESCE(${patch.statusKey || null}, status_key),
           updated_at = now()
     WHERE id = ${String(id)}
     RETURNING data
  `;
  return rows.length ? rows[0].data : null;
}

export async function getOrder(id) {
  const rows = await sql()`SELECT data FROM orders WHERE id = ${String(id)}`;
  return rows.length ? rows[0].data : null;
}

// ---- invoices ---------------------------------------------------------------

export async function listInvoices() {
  const rows = await sql()`SELECT data FROM invoices ORDER BY created_at DESC`;
  return rows.map((row) => row.data);
}

export async function getInvoice(id) {
  const rows = await sql()`SELECT data FROM invoices WHERE id = ${String(id)}`;
  return rows.length ? rows[0].data : null;
}

export async function insertInvoice(invoice) {
  await sql()`
    INSERT INTO invoices (id, number, order_id, date_iso, total, tally_status, data)
    VALUES (${invoice.id}, ${invoice.number}, ${invoice.orderId || null}, ${invoice.dateISO || null},
            ${invoice.totals?.total || 0}, ${invoice.tally?.status || "pending"}, ${JSON.stringify(invoice)}::jsonb)
  `;
  return invoice;
}

export async function saveInvoice(invoice) {
  await sql()`
    UPDATE invoices
       SET data = ${JSON.stringify(invoice)}::jsonb,
           tally_status = ${invoice.tally?.status || "pending"},
           total = ${invoice.totals?.total || 0},
           updated_at = now()
     WHERE id = ${invoice.id}
  `;
  return invoice;
}

/** Atomically reserves the next invoice number for a financial year. */
export async function nextInvoiceNumber(fyCode) {
  const rows = await sql()`
    INSERT INTO invoice_counters (fy_code, last_value) VALUES (${fyCode}, 1)
    ON CONFLICT (fy_code) DO UPDATE SET last_value = invoice_counters.last_value + 1
    RETURNING last_value
  `;
  return `INV-${fyCode}-${String(rows[0].last_value).padStart(4, "0")}`;
}
