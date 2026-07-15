export const CLOUDINARY_CLOUD_NAME = "sbj4xmfv";

export function cloudinaryFetchImage(url, width = 1200) {
  if (!url || url.startsWith("/")) return url;
  const encodedUrl = encodeURIComponent(url);
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/f_auto,q_auto,w_${width}/${encodedUrl}`;
}

export function withCloudinaryImages(product) {
  const images = (product.images || []).map((image, index) => cloudinaryFetchImage(image, index === 0 ? 1200 : 1600));
  return {
    ...product,
    image: cloudinaryFetchImage(product.image, 1200),
    lifestyle: cloudinaryFetchImage(product.lifestyle || product.image, 1600),
    images,
    originalImages: product.images || [],
  };
}
