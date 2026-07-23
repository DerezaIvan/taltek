FROM node:22-alpine

RUN apk add --no-cache docker-cli docker-cli-compose

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY index.js ./

EXPOSE 3001

CMD ["node", "index.js"]
