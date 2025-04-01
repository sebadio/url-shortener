# ---- Build Stage ----
FROM oven/bun:alpine AS builder

WORKDIR /app
COPY . .

RUN bun install
RUN bun run build  

# ---- Production Stage ----
FROM nginx:alpine

WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist/ .  

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]