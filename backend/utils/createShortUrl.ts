import crypto from "crypto";

export function createShortUrl(url: string): string {
  const url_id = get_unique_id(url);
  globalUrls.set(url_id, url);
  return url_id;
}

function get_unique_id(url: string): string {
  const timestamp = Date.now();
  return crypto
    .createHash("sha256")
    .update(url + timestamp)
    .digest("hex")
    .slice(0, 8);
}
