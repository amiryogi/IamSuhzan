// Cloudinary can resize and re-encode images on the fly by inserting a
// transformation segment after "/image/upload/". Non-Cloudinary URLs
// (e.g. Unsplash demo data, bundled assets) are returned unchanged.
const isCloudinaryImage = (url) =>
  typeof url === "string" &&
  url.includes("res.cloudinary.com") &&
  url.includes("/image/upload/");

// Resized, auto-format (WebP/AVIF), auto-quality version of an image
export const optimizedImage = (url, width) =>
  isCloudinaryImage(url)
    ? url.replace("/image/upload/", `/image/upload/f_auto,q_auto,c_limit,w_${width}/`)
    : url;

// srcSet so browsers pick the smallest image that fills the slot
export const imageSrcSet = (url, widths = [400, 800, 1200, 1600]) =>
  isCloudinaryImage(url)
    ? widths.map((w) => `${optimizedImage(url, w)} ${w}w`).join(", ")
    : undefined;

export const formatPrice = (price, currency = "USD") => {
  if (price === undefined || price === null) return "";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    // Unknown currency code
    return `${currency} ${price.toLocaleString()}`;
  }
};

const unitSymbols = { inches: '"', cm: " cm", pixels: " px" };

export const formatDimensions = (dimensions) => {
  if (!dimensions?.width || !dimensions?.height) return "";
  const unit = unitSymbols[dimensions.unit] ?? '"';
  return `${dimensions.width}${unit} × ${dimensions.height}${unit}`;
};
