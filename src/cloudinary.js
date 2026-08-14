export const CLOUDINARY_CLOUD_NAME = "sbj4xmfv";

export function publicAssetUrl(url) {
  if (!url) return url;
  return String(url).replace(/^\/src\/assets\//, "/assets/");
}

export function cloudinaryFetchImage(url, width = 1200) {
  if (!url || url.startsWith("/")) return publicAssetUrl(url);
  const encodedUrl = encodeURIComponent(url);
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/f_auto,q_auto,w_${width}/${encodedUrl}`;
}

// Idempotent: the raw source URLs are kept alongside the transformed ones, so
// re-mapping an already-mapped product does not wrap a Cloudinary URL in itself.
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
