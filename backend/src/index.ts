import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { stats } from "@controllers/stats";
import { urlHandler } from "@controllers/url";
import { shorten } from "@controllers/shorten";
import logger, { flushLogger } from "@libs/logger";

const { PORT } = process.env;

const app = new Elysia()
  .onError(({ code, error }) => {
    logger.error({
      code,
      error,
    });
  })
  .use(cors({ origin: "*", methods: ["GET", "POST", "DELETE", "PUT"] }))
  .get("/", () => {
    return "Welcome to url shortening realm!";
  })
  .get("/favicon.ico", ({ set }) => {
    set.status = 204;
    return { status: 204 };
  })
  .use(stats)
  .use(urlHandler)
  .use(shorten);

app.on("stop", () => {
  logger.info("Shutting down gracefully, saving all logs.");
  flushLogger();
  setTimeout(() => {
    logger.info("Finished");
    process.exit(0);
  }, 500);
});

process.on("exit", app.stop);
process.on("SIGINT", app.stop);
process.on("SIGTERM", app.stop);
process.on("beforeExit", app.stop);

app.listen(PORT || 8080, ({ port, hostname }) => {
  logger.info(`Listening on ${hostname}:${port}`);
});
