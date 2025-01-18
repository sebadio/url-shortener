import { Elysia, redirect, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import crypto from "crypto";

let globalUrls: Map<string, string> = new Map();

const app = new Elysia()
  .use(swagger())
  .use(cors())
  .get("/", () => {
    return "Welcome to url shortening realm!";
  })
  .post("/shorten", ({ query }) => {
    if (!query.url) return { error: "Malformed" };

    return {
      error: false,
      original_url: query.url,
      short_url: addToUrl(query.url),
    };
  })
  .get("/:url", ({ params }) => {
    const url = getUrl(params.url);

    if (!url || url === "") return "That url doesn't exist!";

    return redirect(url, 302);
  })
  .listen(80, ({ port, hostname }) => {
    console.log(`Listening on ${hostname}:${port}`);
  });

function addToUrl(url: string): string {
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

function getUrl(shortened: string): string {
  return globalUrls.get(shortened) || "";
}
