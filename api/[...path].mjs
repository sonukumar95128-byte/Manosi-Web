// Vercel serverless entry point. Every /api/* request lands here and is passed
// to the shared router, so production runs exactly the same code as local dev.

import { handleApiRequest } from "./_router.mjs";

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
  "access-control-allow-headers": "content-type",
};

export default async function handler(req, res) {
  for (const [key, value] of Object.entries(CORS)) res.setHeader(key, value);
  if (req.method === "OPTIONS") return res.status(200).json({ ok: true });

  try {
    const pathname = new URL(req.url, `https://${req.headers.host}`).pathname;
    // Vercel parses JSON bodies already; fall back for string bodies.
    let body = req.body ?? {};
    if (typeof body === "string") body = body ? JSON.parse(body) : {};

    const { status, data } = await handleApiRequest({ method: req.method, pathname, body });
    return res.status(status).json(data);
  } catch (error) {
    console.error("[api]", error);
    return res.status(500).json({ error: error.message });
  }
}
