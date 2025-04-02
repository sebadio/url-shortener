import { Elysia, t } from "elysia";
import { createUniqueURL } from "@libs/createShortUrl";
import { insertToDatabase } from "@libs/db";
import logger from "@libs/logger";

class InvalidURL extends Error {
  constructor(public message: string) {
    super(message);
  }
}

const urlRegex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

export const shorten = new Elysia().post(
  "/shorten",
  ({ body, set }) => {
    try {
      const { original_url } = body;

      if (!original_url.match(urlRegex)) throw new InvalidURL("Invalid url");

      let short_url_id = createUniqueURL(original_url);

      const createdAt: string = new Date().toISOString();
      const id = insertToDatabase(short_url_id, original_url, createdAt);

      const entry = { id, original_url, short_url: short_url_id, createdAt };
      logger.info(entry, "Created new short url");
      set.status = 201;
      return entry;
    } catch (error: any) {
      if (error instanceof InvalidURL) {
        logger.info({ error, code: 400 }, "Invalid URL Provided");
        set.status = 400;
        return {
          error: "Internal server error",
          message: error.message,
          code: 400,
        };
      }

      logger.error(error);
      set.status = 500;
      return {
        error: "Internal server error",
        message: error.message,
      };
    }
  },
  {
    body: t.Object({
      original_url: t.String(),
    }),
  }
);
