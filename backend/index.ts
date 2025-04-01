import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { stats } from "handlers/stats";
import { urlHandler } from "handlers/url";
import { shorten } from "handlers/shorten";
import logger from "@utils/logger";

const { PORT } = process.env;

const app = new Elysia()
  .onError(({ code, error }) => {
    logger.error({
      code,
      error,
    });
  })
  .use(cors({ origin: "*", methods: ["GET", "POST", "DELETE"] }))
  .get("/", () => {
    return "Welcome to url shortening realm!";
  })
  .get("/favicon.ico", ({ set }) => {
    set.status = 204;
    return { status: 204 };
  })
  .use(stats)
  .use(urlHandler)
  .use(shorten)
  .listen(PORT || 8080, ({ port, hostname }) => {
    logger.info(`Listening on ${hostname}:${port}`);
  });
