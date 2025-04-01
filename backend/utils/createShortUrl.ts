import crypto from "crypto";
import { urlExists } from "@utils/db";

export function createUniqueURL(original_url: string): string {
  const timestamp = Date.now();
  let uniqueURL = null;

  while (!uniqueURL || urlExists(uniqueURL)) {
    uniqueURL = crypto
      .createHash("sha256")
      .update(original_url + timestamp)
      .digest("hex")
      .slice(0, 8);
  }

  return uniqueURL;
}
