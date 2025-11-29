// Utility functions to parse Parse File objects to URLs (used for user profile images and post images)
export function parseFileToUrl(fileOrString) {
  if (!fileOrString) return null;
  // If it's a Parse File-like object with url() method
  if (typeof fileOrString?.url === "function") return fileOrString.url();
  // If it's already a string URL
  if (typeof fileOrString === "string") return fileOrString;
  return null;
}

// Convert an array of Parse File objects to an array of URLs
export function parseImagesToUrls(images) {
  // Handle null/undefined or non-array inputs
  if (!images || !Array.isArray(images)) return [];
  // Map each image to its URL and filter out any nulls
  return images
    .map((img) => parseFileToUrl(img))
    .filter((url) => url);
}
