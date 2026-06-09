FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN sed -i '/^pid/d' /etc/nginx/nginx.conf

RUN adduser -u 1001 -D appuser \
 && chown -R 1001:1001 /usr/share/nginx/html \
 && chown -R 1001:1001 /var/cache/nginx \
 && chown -R 1001:1001 /var/log/nginx

USER 1001

EXPOSE 8080

CMD ["nginx", "-g", "daemon off; pid /tmp/nginx.pid;"]
