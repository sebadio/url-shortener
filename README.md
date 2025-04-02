# URL Shorneter

A simple url shortener service, both backend and frontend, the idea was taken from: [roadmap.sh](https://roadmap.sh/projects/url-shortening-service)

## Tech Stack

### Backend
- [Bun](https://bun.sh/)
- [ElysiaJS](https://elysiajs.com/)
- [SQLite](https://www.sqlite.org/index.html)
- [Pino](https://getpino.io/)
- TypeScript
- Docker

### Frontend
- [Astro](https://astro.build/)
- [TailwindCSS](https://tailwindcss.com/)
- [React](https://react.dev/)

When building with the Dockerfile, this gets hosted locally with nginx

## How to run

### Docker

---

This is the easiest and recommended way, you only have to run docker compose and the service will be running.

```bash
docker compose up -d
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

## How to use

After runing the commands above, you can go to https://localhost:4321 and see the frontend, or you can use a CLI to interact with the backend directly like this:

```bash
# Create a short url
curl -X POST -H "Content-Type: application/json" \
-d '{"original_url":"https://youtube.com"}' \
localhost:8080/shorten
```

```bash
# Update a short url
curl -X PUT -H "Content-Type: application/json" \
-d '{"url":"https://google.com"}' \
localhost:8080/:urlId
```

```bash
# Delete a short url
curl -X DELETE localhost:8080/:urlId
```

```bash
# Get the latest 5 urls
curl -X GET localhost:8080/stats/latest
```

```bash
# Get the all links as an array
curl -X GET localhost:8080/stats/allLinks
```

```bash
# Get the stats of one url
curl -X GET localhost:8080/stats/:urlId
```
