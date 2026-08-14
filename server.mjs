// Local dev API. Production runs the same routes as Vercel functions
// (see api/[...path].mjs) - this file only provides an HTTP server locally.

import "./scripts/loadEnv.mjs";
import { createServer } from "node:http";
import { handleApiRequest } from "./api/_router.mjs";
import { authConfigured, clearedCookie, sessionCookie } from "./api/auth.mjs";
import { hasDatabase } from "./db/client.mjs";

const port = Number(process.env.PORT || 5175);

async function bodyJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function send(res, status, data, { origin = "", cookie = "", cacheControl = "" } = {}) {
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": cacheControl || "private, no-store, max-age=0",
    // The dev frontend runs on a different port, so echo its origin rather than
    // using "*" - browsers refuse to send cookies to a wildcard origin.
    "access-control-allow-origin": origin || "*",
    "access-control-allow-methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
    "access-control-allow-headers": "content-type",
  };
  if (origin) headers["access-control-allow-credentials"] = "true";
  if (cookie) headers["set-cookie"] = cookie;
  res.writeHead(status, headers);
  res.end(JSON.stringify(data));
}

createServer(async (req, res) => {
  const origin = req.headers.origin || "";
  try {
    if (req.method === "OPTIONS") return send(res, 200, { ok: true }, { origin });
    const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
    const body = ["POST", "PUT", "PATCH"].includes(req.method) ? await bodyJson(req) : {};
    const result = await handleApiRequest({
      method: req.method,
      pathname,
      body,
      cookies: req.headers.cookie || "",
    });

    // Local dev is plain http, so the Secure flag would stop the cookie sticking.
    let cookie = "";
    if (result.setSession) cookie = sessionCookie(result.setSession, { secure: false });
    if (result.clearSession) cookie = clearedCookie({ secure: false });

    return send(res, result.status, result.data, { origin, cookie, cacheControl: result.cacheControl });
  } catch (error) {
    console.error("[api]", error);
    return send(res, 500, { error: error.message }, { origin });
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Manosi admin API running at http://127.0.0.1:${port}`);
  if (!hasDatabase()) {
    console.warn("  DATABASE_URL is not set - add your Neon connection string to .env.local, then run: npm run db:migrate");
  }
  if (!authConfigured()) {
    console.warn("  Admin login is not set up - run: npm run auth:set-password");
  }
});
