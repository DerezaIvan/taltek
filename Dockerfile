# syntax=docker/dockerfile:1

FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG PUBLIC_DIRECTUS_URL=
ARG DIRECTUS_TOKEN=
ARG PUBLIC_API_URL=

ENV PUBLIC_DIRECTUS_URL=$PUBLIC_DIRECTUS_URL
ENV DIRECTUS_TOKEN=$DIRECTUS_TOKEN
ENV PUBLIC_API_URL=$PUBLIC_API_URL

RUN npm run build

FROM nginx:1.27-alpine AS runtime

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
