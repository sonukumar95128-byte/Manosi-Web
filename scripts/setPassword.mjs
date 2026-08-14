// Sets the admin password. Run locally:
//
//   npm run auth:set-password
//
// It asks for the password, writes ADMIN_PASSWORD_HASH (and SESSION_SECRET if
// missing) straight into .env.local, and prints the values to copy into Vercel.
//
// The password itself is never written anywhere - only its scrypt hash, which
// cannot be reversed. Pass the password as an argument only if you must; some
// shells expand $ and ! inside double quotes and would hash the wrong string.

import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { hashPassword } from "../api/auth.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env.local");

/** Replaces KEY=... in place, or appends it when absent. */
function upsertEnv(contents, key, value) {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");
  if (pattern.test(contents)) return contents.replace(pattern, line);
  return `${contents.replace(/\s*$/, "")}\n${line}\n`;
}

async function readPassword() {
  const fromArgv = process.argv.slice(2).join(" ").trim();
  if (fromArgv) return fromArgv;

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question("New admin password (at least 10 characters): ");
  rl.close();
  return answer.trim();
}

const password = await readPassword();

if (!password) {
  console.error("No password entered. Nothing changed.");
  process.exit(1);
}

if (password.length < 10) {
  console.error(`That is ${password.length} characters. Use at least 10 - this is the only thing protecting the admin panel.`);
  process.exit(1);
}

if (password.startsWith("scrypt:")) {
  console.error("That looks like an existing hash, not a password. Enter the password itself.");
  process.exit(1);
}

const hash = hashPassword(password);
let contents = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
contents = upsertEnv(contents, "ADMIN_PASSWORD_HASH", hash);

let sessionSecret = (contents.match(/^SESSION_SECRET=(.*)$/m) || [])[1];
if (!sessionSecret) {
  sessionSecret = randomBytes(32).toString("hex");
  contents = upsertEnv(contents, "SESSION_SECRET", sessionSecret);
}

writeFileSync(envPath, contents, "utf8");

console.log("\n.env.local updated. Your password was not saved anywhere - only its hash.\n");
console.log("Now copy these into Vercel -> Settings -> Environment Variables.");
console.log("Paste ONLY the part after the = sign, and never the password itself:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log(`SESSION_SECRET=${sessionSecret}`);
console.log("\nThen redeploy. Check it worked with:  npm run auth:check\n");
