import { Elysia, error, redirect, t } from "elysia";
import { deleteUrl, getUrl, updateLink, urlExists } from "@libs/db";
import logger from "@libs/logger";

export const urlHandler = new Elysia()
  .put(
    "/:url",
    ({ params, body, set }) => {
      if (!urlExists(params.url)) {
        set.status = 404;
        return error(404, "Not Found");
      }

      const short_url = params.url;
      const newUrl = body.url;
      const updatedDate: string = new Date().toISOString();
      updateLink(short_url, newUrl, updatedDate);
      logger.info({ short_url, newUrl, updatedDate }, "Updated URL");

      set.status = 200;
      return {
        code: 200,
        message: "Success",
      };
    },
    {
      params: t.Object({
        url: t.String(),
      }),
      body: t.Object({
        url: t.String(),
      }),
    }
  )
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
