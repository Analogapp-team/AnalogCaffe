export function parseFileToUrl(fileOrString) {
  if (!fileOrString) return null;
  // If it's a Parse File-like object with url() method
  if (typeof fileOrString?.url === "function") return fileOrString.url();
  // If it's already a string URL
  if (typeof fileOrString === "string") return fileOrString;
  return null;
}

export function parseImagesToUrls(images) {
  if (!images || !Array.isArray(images)) return [];
  return images
    .map((img) => parseFileToUrl(img))
    .filter((url) => url);
}
