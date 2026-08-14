// Local dev API. Production runs the same routes as Vercel functions
// (see api/[...path].mjs) - this file only provides an HTTP server locally.

import "./scripts/loadEnv.mjs";
import { createServer } from "node:http";
import { handleApiRequest } from "./api/_router.mjs";
import { hasDatabase } from "./db/client.mjs";

const port = Number(process.env.PORT || 5175);

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

createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") return send(res, 200, { ok: true });
    const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
    const body = ["POST", "PUT", "PATCH"].includes(req.method) ? await bodyJson(req) : {};
    const { status, data } = await handleApiRequest({ method: req.method, pathname, body });
    return send(res, status, data);
  } catch (error) {
    console.error("[api]", error);
    return send(res, 500, { error: error.message });
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Manosi admin API running at http://127.0.0.1:${port}`);
  if (!hasDatabase()) {
    console.warn("  DATABASE_URL is not set - add your Neon connection string to .env.local, then run: npm run db:migrate");
  }
});
