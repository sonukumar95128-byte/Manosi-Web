// Server-side image upload to Cloudinary.
//
// Admin uploads used to be stored as base64 data URIs inside the database, so a
// single 2.6 MB hero banner rode along with every storefront response. Images
// now go to Cloudinary and only the public_id is stored.
//
// Needs CLOUDINARY_URL (cloudinary://<key>:<secret>@<cloud>) in the environment.

import { createHash } from "node:crypto";

export function cloudinaryCredentials() {
  const match = String(process.env.CLOUDINARY_URL || "").match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (!match) return null;
  const [, apiKey, apiSecret, cloudName] = match;
  return { apiKey, apiSecret, cloudName };
}

export function uploadsConfigured() {
  return Boolean(cloudinaryCredentials());
}

/** Cloudinary signs the alphabetically sorted params, excluding file and api_key. */
function sign(params, apiSecret) {
  const canonical = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== "")
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(canonical + apiSecret).digest("hex");
}

/**
 * @param {string} file  a data: URI, or a remote URL Cloudinary can reach
 * @returns {Promise<{publicId:string, url:string, width:number, height:number, bytes:number}>}
 */
export async function uploadImage(file, { folder = "manosi", resourceType = "image" } = {}) {
  const creds = cloudinaryCredentials();
  if (!creds) throw new Error("CLOUDINARY_URL is not set on this deployment, so images cannot be uploaded.");

  const timestamp = Math.floor(Date.now() / 1000);
  const signedParams = { folder, timestamp };
  const body = new URLSearchParams({
    ...signedParams,
    file,
    api_key: creds.apiKey,
    signature: sign(signedParams, creds.apiSecret),
  });

  const endpoint = resourceType === "video" ? "video" : "image";
  const response = await fetch(`https://api.cloudinary.com/v1_1/${creds.cloudName}/${endpoint}/upload`, {
    method: "POST",
    body,
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result?.error?.message || `Cloudinary rejected the upload (HTTP ${response.status})`);
  }

  return {
    publicId: result.public_id,
    url: result.secure_url,
    resourceType: result.resource_type,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}
