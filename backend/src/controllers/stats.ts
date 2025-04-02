import { Elysia, error, t } from "elysia";
import { getAllLinks, getLatestLinks, getLinkStats } from "@libs/db";

export const stats = new Elysia({ prefix: "/stats" })
  .get("/", () => error(400, "Bad Request"))
  .get(
    "/:url",
    ({ params }) => {
      return getLinkStats(params.url);
    },
    {
      params: t.Object({
        url: t.String(),
      }),
    }
  )
  .get("/allLinks", () => {
    return getAllLinks();
  })
  .get("/latest", () => {
    return getLatestLinks();
  });
