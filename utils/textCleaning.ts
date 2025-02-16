export function cleanText(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "");
}
