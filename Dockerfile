FROM --platform=linux/arm64 node:18-slim AS builder
WORKDIR /build
COPY package*.json ./
RUN npm install
COPY . .

FROM --platform=linux/arm64 node:18-slim
WORKDIR /usr/src/app

COPY --from=builder /build/package*.json ./
COPY --from=builder /build/server.js ./
COPY --from=builder /build/index.html ./
COPY --from=builder /build/middleware ./middleware
COPY --from=builder /build/views ./views
RUN npm install --production
RUN mkdir -p configs

EXPOSE 3000
CMD ["node", "server.js"]