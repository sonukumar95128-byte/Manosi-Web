// Vercel serverless entry point. Every /api/* request lands here and is passed
// to the shared router, so production runs exactly the same code as local dev.

import { handleApiRequest } from "./_router.mjs";
import { clearedCookie, sessionCookie } from "./auth.mjs";

function applyCors(req, res) {
  const origin = req.headers.origin;
  // Credentials cannot be sent to a wildcard origin, so echo the caller's origin
  // when there is one. In production the frontend is same-origin anyway.
  res.setHeader("access-control-allow-origin", origin || "*");
  if (origin) {
    res.setHeader("access-control-allow-credentials", "true");
    res.setHeader("vary", "Origin");
  }
  res.setHeader("access-control-allow-methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
  res.setHeader("access-control-allow-headers", "content-type");
}

export default async function handler(req, res) {
  applyCors(req, res);
  if (req.method === "OPTIONS") return res.status(200).json({ ok: true });

  try {
    const pathname = new URL(req.url, `https://${req.headers.host}`).pathname;
    let body = req.body ?? {};
    if (typeof body === "string") body = body ? JSON.parse(body) : {};

    const result = await handleApiRequest({
      method: req.method,
      pathname,
      body,
      cookies: req.headers.cookie || "",
    });

    if (result.setSession) res.setHeader("set-cookie", sessionCookie(result.setSession));
    if (result.clearSession) res.setHeader("set-cookie", clearedCookie());

    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("[api]", error);
    return res.status(500).json({ error: error.message });
  }
}
