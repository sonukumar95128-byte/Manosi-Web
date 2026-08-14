// Checks the admin login setup without sending anything anywhere:
//
//   npm run auth:check
//
// Validates that ADMIN_PASSWORD_HASH really is a scrypt hash (a plain password
// pasted there is the usual mistake), then optionally verifies a password
// against it. Nothing is written and nothing leaves this machine.

import "./loadEnv.mjs";
import { createInterface } from "node:readline/promises";
import { verifyPassword } from "../api/auth.mjs";

const hash = process.env.ADMIN_PASSWORD_HASH || "";
const secret = process.env.SESSION_SECRET || "";
const parts = hash.split(":");
const looksLikeHash = parts.length === 3 && parts[0] === "scrypt" && parts[1].length === 32 && parts[2].length === 128;

console.log("");
console.log("SESSION_SECRET       ", secret ? `set (${secret.length} chars)` : "MISSING");
console.log("ADMIN_PASSWORD_HASH  ", hash ? `set (${hash.length} chars)` : "MISSING");

if (!hash) {
  console.log("\nRun: npm run auth:set-password\n");
  process.exit(1);
}

if (!looksLikeHash) {
  console.log("\nThis is NOT a valid scrypt hash, so every login attempt will fail.");
  console.log("It looks like a password or a truncated value was pasted in.");
  console.log("Expected format: scrypt:<32 hex chars>:<128 hex chars>");
  console.log("\nFix it with: npm run auth:set-password\n");
  process.exit(1);
}

console.log("format               valid (scrypt)");

const rl = createInterface({ input: process.stdin, output: process.stdout });
const password = (await rl.question("\nType your password to test it (or press Enter to skip): ")).trim();
rl.close();

if (!password) {
  console.log("Skipped.\n");
  process.exit(0);
}

console.log(verifyPassword(password, hash) ? "\nMatch - this password will sign you in.\n" : "\nNo match - this is not the password the hash was made from.\n");
