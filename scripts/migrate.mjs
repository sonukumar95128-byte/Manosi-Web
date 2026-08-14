// Creates the Neon schema and loads seed content. Safe to re-run: the schema
// uses IF NOT EXISTS, products upsert by id, and store rows are only written
// when missing (so admin edits are never overwritten).
//
//   npm run db:migrate            seed only what is missing
//   npm run db:migrate -- --reset drop and rebuild everything

import "./loadEnv.mjs";
import { catalogProducts } from "../src/catalogData.js";
import { storeDefaults } from "../api/_router.mjs";
import { seedOrders } from "../src/seedData.js";
import * as db from "../db/client.mjs";

const reset = process.argv.includes("--reset");

async function main() {
  if (!db.hasDatabase()) {
    console.error("DATABASE_URL is not set.");
    console.error("Add your Neon connection string to .env.local, for example:");
    console.error('  DATABASE_URL=postgresql://user:password@ep-xxx.ap-south-1.aws.neon.tech/neondb?sslmode=require');
    process.exit(1);
  }

  const query = db.sql();

  if (reset) {
    console.log("Dropping existing tables...");
    for (const table of ["invoice_counters", "invoices", "orders", "products", "store"]) {
      await query.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
    }
  }

  const statements = await db.applySchema();
  console.log(`Schema applied (${statements} statements).`);

  const existingProducts = await db.listProducts();
  if (existingProducts.length === 0) {
    console.log(`Loading ${catalogProducts.length} products...`);
    let position = catalogProducts.length;
    for (const product of catalogProducts) {
      await db.upsertProduct(product, position);
      position -= 1;
    }
    console.log("Products loaded.");
  } else {
    console.log(`Products already present (${existingProducts.length}) - left untouched.`);
  }

  const defaults = storeDefaults();
  let written = 0;
  for (const [key, value] of Object.entries(defaults)) {
    const current = await db.readStore(key, undefined);
    if (current === undefined) {
      await db.writeStore(key, value);
      written += 1;
    }
  }
  console.log(`Store documents seeded: ${written} written, ${Object.keys(defaults).length - written} already present.`);

  const existingOrders = await db.listOrders();
  if (existingOrders.length === 0) {
    for (const order of seedOrders) await db.insertOrder(order);
    console.log(`Demo orders loaded (${seedOrders.length}).`);
  } else {
    console.log(`Orders already present (${existingOrders.length}) - left untouched.`);
  }

  console.log("\nMigration complete.");
}

main().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exit(1);
});
