// Generates the two secrets the admin login needs. Run locally:
//
//   npm run auth:set-password -- "your-admin-password"
//
// It prints ADMIN_PASSWORD_HASH and SESSION_SECRET. Put both in .env.local and
// in the Vercel project's Environment Variables. The plain password is never
// written to disk, and the hash cannot be reversed back into it.

import { randomBytes } from "node:crypto";
import { hashPassword } from "../api/auth.mjs";

const password = process.argv.slice(2).join(" ").trim();

if (!password) {
  console.error('Usage: npm run auth:set-password -- "your-admin-password"');
  process.exit(1);
}

if (password.length < 10) {
  console.error(`Password is ${password.length} characters. Use at least 10 - this is the only thing protecting the admin panel.`);
  process.exit(1);
}

console.log("\nAdd these two lines to .env.local, and to Vercel -> Settings -> Environment Variables:\n");
console.log(`ADMIN_PASSWORD_HASH=${hashPassword(password)}`);
console.log(`SESSION_SECRET=${randomBytes(32).toString("hex")}`);
console.log("\nRedeploy after adding them in Vercel. Keep SESSION_SECRET private:");
console.log("anyone who has it can mint a valid admin session.\n");
