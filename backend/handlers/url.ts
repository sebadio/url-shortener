import { Elysia, error, redirect, t } from "elysia";
import { deleteUrl, getUrl, urlExists } from "@utils/db";
import logger from "@utils/logger";

export const urlHandler = new Elysia()
  .guard({
    params: t.Object({
      url: t.String(),
    }),
  })
  .get("/:url", ({ params }) => {
    const url = getUrl(params.url);
    if (!url || url === "") {
      logger.info({ code: 404, error: "URL Not Found" }, "URL Not found");
      return error(404, "Not Found");
    }
    logger.info({ short_id: params.url, url }, "Request Redirected");
    return redirect(url, 302);
  })
  .delete("/:url", ({ params, set }) => {
    if (!urlExists(params.url)) {
      return error(404, "Not Found");
    }
    deleteUrl(params.url);
    logger.info(
      {
        url: params.url,
      },
      "Deleted success"
    );

    set.status = 200;

    return {
      message: "Success",
      code: 200,
    };
  });
