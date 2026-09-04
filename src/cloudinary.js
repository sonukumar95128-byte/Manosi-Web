export const CLOUDINARY_CLOUD_NAME = "sbj4xmfv";

export function publicAssetUrl(url) {
  if (!url) return url;
  return String(url).replace(/^\/src\/assets\//, "/assets/");
}

/**
 * Builds a delivery URL for an image reference, which can be any of:
 *   "ALB00230-1"        a public_id in our own Cloudinary account (the catalogue)
 *   "/src/assets/..."   a file bundled with the site
 *   "data:image/..."    a fresh admin upload, not yet on a CDN
 *   "https://..."       an external image, proxied through Cloudinary fetch
 */
export function cloudinaryFetchImage(ref, width = 1200) {
  if (!ref) return ref;
  const value = String(ref);

  if (value.startsWith("/")) return publicAssetUrl(value);
  // Admin uploads arrive as base64 and must be left alone; wrapping one in a
  // fetch URL produces a request Cloudinary cannot answer.
  if (value.startsWith("data:") || value.startsWith("blob:")) return value;

  if (value.startsWith("http")) {
    if (value.includes("res.cloudinary.com")) return value;
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/f_auto,q_auto,w_${width}/${encodeURIComponent(value)}`;
  }

  const publicId = value.split("/").map(encodeURIComponent).join("/");
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_${width}/${publicId}`;
}

// Idempotent: the raw source references are kept alongside the transformed ones,
// so re-mapping an already-mapped product does not wrap a delivery URL in itself.
export function withCloudinaryImages(product) {
  const originalImages = product.originalImages?.length ? product.originalImages : product.images || [];
  const originalImage = product.originalImage || product.image;
  const originalLifestyle = product.originalLifestyle || product.lifestyle || originalImage;
  return {
    ...product,
    originalImage,
    originalLifestyle,
    originalImages,
    image: cloudinaryFetchImage(originalImage, 1200),
    lifestyle: cloudinaryFetchImage(originalLifestyle, 1600),
    images: originalImages.map((image, index) => cloudinaryFetchImage(image, index === 0 ? 1200 : 1600)),
  };
}
