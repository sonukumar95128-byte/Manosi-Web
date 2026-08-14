-- Manosi Diamonds schema (Neon Postgres).
--
-- Transactional data (products, orders, invoices) lives in real tables so that
-- concurrent serverless invocations update single rows instead of rewriting a
-- whole document, which is how the old data/db.json store lost writes.
--
-- Low-contention editorial content (settings, banners, collections, reels,
-- testimonials, homepage layout) stays as JSONB documents in `store`, keeping
-- the existing admin payload shape unchanged.

CREATE TABLE IF NOT EXISTS store (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id         TEXT PRIMARY KEY,
  sku        TEXT,
  name       TEXT NOT NULL,
  category   TEXT,
  data       JSONB NOT NULL,
  position   BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_position_idx ON products (position DESC);
CREATE INDEX IF NOT EXISTS products_sku_idx ON products (lower(sku));
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);

CREATE TABLE IF NOT EXISTS orders (
  id          TEXT PRIMARY KEY,
  status_key  TEXT NOT NULL DEFAULT 'pending',
  customer    TEXT,
  phone       TEXT,
  date_iso    DATE,
  invoice_id  TEXT,
  data        JSONB NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_created_idx ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status_key);

CREATE TABLE IF NOT EXISTS invoices (
  id           TEXT PRIMARY KEY,
  number       TEXT NOT NULL UNIQUE,
  order_id     TEXT,
  date_iso     DATE,
  total        NUMERIC(14, 2) NOT NULL DEFAULT 0,
  tally_status TEXT NOT NULL DEFAULT 'pending',
  data         JSONB NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS invoices_created_idx ON invoices (created_at DESC);
CREATE INDEX IF NOT EXISTS invoices_tally_idx ON invoices (tally_status);

-- Invoice numbers must never repeat or skip under concurrency, so they come
-- from a counter row updated inside the same transaction as the insert.
CREATE TABLE IF NOT EXISTS invoice_counters (
  fy_code    TEXT PRIMARY KEY,
  last_value INTEGER NOT NULL DEFAULT 0
);
