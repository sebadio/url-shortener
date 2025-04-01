# url_shortener

A simple url shortener service made with Bun and Elysia.js

I worked on this thanks to the idea in [roadmap.sh](https://roadmap.sh/projects/url-shortening-service)

## How to run

### Docker

---

This is the easiest and recommended way, you only have to run docker compose and the service will be running.

```bash
docker compose up -d
```

After this you can go to https://localhost:4321 and see the frontend, or you can use a CLI to interact with the backend directly like this:

```bash
# Create a short url
curl -X POST -H "Content-Type: application/json" \
-d '{"original_url":"https://youtube.com"}' \
localhost:8080/shorten
```

```bash
# Query the latest urls
curl http://localhost:8080/stats/latest
```

### Locally

---

For this we require [bun](bun.sh), (it might work with npm and Node but it was made to work with bun)

then we can run the following commands:

```bash
cd backend
bun install
bun run dev &
cd ../frontend
bun install
bun run dev
```

This project was created using `bun init` in bun v1.1.45. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
