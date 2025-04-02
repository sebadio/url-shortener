FROM oven/bun:alpine AS builder

WORKDIR /app
COPY ./src ./src
COPY ./bun.lockb .
COPY ./package.json .
COPY ./tsconfig.json .

RUN bun install
RUN bun run build

FROM oven/bun:alpine

WORKDIR /app
COPY --from=builder /app/build/index.js .
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8080

CMD [ "bun", "run", "index.js" ]