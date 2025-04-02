import { Database } from "bun:sqlite";
import type { LinkBundle } from "@customTypes/LinkBundle";
import logger from "./logger";

const cache: Map<string, LinkBundle> = new Map<string, LinkBundle>();

import fs from "fs";

if (!fs.existsSync("./database")) {
  fs.mkdirSync("./database");
}

export const db = new Database("./database/db.sqlite");

/*
Queries
*/
// TODO : Add updated_at
db.query(
  'CREATE TABLE IF NOT EXISTS "links" (\
   "short_url"      TEXT NOT NULL UNIQUE, \
   "original_url"   TEXT NOT NULL, \
   "visits"         INTEGER DEFAULT 0,\
   "createdAt"      TEXT NOT NULL, \
   "updatedAt"      TEXT NOT NULL, \
   PRIMARY KEY("short_url")\
  )'
).run();

const get_link_query = db.query(
  `SELECT * FROM links WHERE short_url = $short_url`
);

const get_all_links_query = db.query("SELECT * FROM links");

const insert_link_query = db.query(
  `INSERT INTO links VALUES($short_url, $original_url, $visits, $createdAt, $updatedAt)`
);

const get_latest_links = db.query(
  `SELECT * FROM links ORDER BY createdAt DESC LIMIT 5`
);

const delete_link = db.query(
  `DELETE FROM links WHERE short_url = $short_url_id`
);

const update_cache_links_query = db.prepare(
  "UPDATE links SET visits = $newVisits WHERE short_url = $short_url_id"
);

const update_link = db.query(
  "UPDATE links SET original_url = $new_url, updatedAt = $updatedDate WHERE short_url = $short_url_id"
);

const url_exists = db.query(
  "SELECT short_url FROM links WHERE short_url = $a_short_url"
);

export function insertToDatabase(
  short_url: string,
  original_url: string,
  creationDate: string
) {
  // TODO : Add updatedAt
  const id = insert_link_query.run({
    $short_url: short_url,
    $original_url: original_url,
    $visits: 0,
    $createdAt: creationDate,
    $updatedAt: creationDate,
  }).lastInsertRowid;
  return id;
}

export function updateLink(
  short_url: string,
  new_url: string,
  updatedDate: string
) {
  update_link.run({
    $short_url_id: short_url,
    $new_url: new_url,
    $updatedDate: updatedDate,
  });

  if (cache.has(short_url)) {
    const entry = cache.get(short_url);
    cache.set(short_url, { ...entry!, original_url: new_url });
  } else {
    cache.set(short_url, {
      ...getLinkBundle(short_url)!,
      original_url: new_url,
      updatedAt: updatedDate,
      last_visit: Date.now(),
    });
  }
}

export function getAllLinks(): LinkBundle[] {
  const linkBundle: LinkBundle[] = get_all_links_query.all() as LinkBundle[];
  return linkBundle;
}

function getLinkBundle(shortened: string): LinkBundle | null {
  let lkBundle: LinkBundle | undefined;
  lkBundle = cache.get(shortened);
  if (!lkBundle) {
    lkBundle = get_link_query.get({ $short_url: shortened }) as LinkBundle;
  }

  return lkBundle;
}

export function getLinkStats(shortened: string): LinkBundle | null {
  const dbLinks = getLinkBundle(shortened);
  if (!dbLinks) return null;
  if (!cache.has(dbLinks.short_url)) return dbLinks;
  else return cache.get(dbLinks.short_url)!;
}

export function getLatestLinks(): LinkBundle[] {
  let links = get_latest_links.all() as LinkBundle[];
  links = links.map((link) =>
    cache.has(link.short_url) ? cache.get(link.short_url)! : link
  );

  return links;
}

export function getUrl(shortened: string): string {
  let lkBundle: LinkBundle | null = getLinkBundle(shortened);
  if (!lkBundle) return "";

  lkBundle.last_visit = Date.now();
  lkBundle.visits++;

  cache.set(shortened, lkBundle);

  return lkBundle.original_url;
}

export function urlExists(shortened: string): boolean {
  return url_exists.get({ $a_short_url: shortened }) != null;
}

export function deleteUrl(shortened: string) {
  delete_link.run({ $short_url_id: shortened });
}

// Cache

const tenMinutes = 10 * 60 * 1000;
const cachepdateTime = 5000;

const updateLinks = db.transaction((links: LinkBundle[]) => {
  for (const link of links) {
    update_cache_links_query.run({
      $newVisits: link.visits,
      $short_url_id: link.short_url,
    });
  }
  return links.length;
});

setInterval(() => {
  let linksToUpdate: LinkBundle[] = [];

  cache.forEach((value: LinkBundle, key: string) => {
    const timeElapsed = Date.now() - value.last_visit;
    if (timeElapsed > tenMinutes) {
      linksToUpdate.push(value);
      cache.delete(key);
    }
  });

  if (linksToUpdate.length > 0) {
    logger.info({}, `Updating ${linksToUpdate.length} links from cache`);
    updateLinks(linksToUpdate);
  }
}, cachepdateTime);
