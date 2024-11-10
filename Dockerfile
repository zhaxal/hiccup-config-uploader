FROM --platform=linux/arm64 node:18-slim AS builder
WORKDIR /build
COPY package*.json ./
RUN npm install
COPY . .

# Production stage
FROM --platform=linux/arm64 node:18-slim
WORKDIR /usr/src/app

# Copy only production files
COPY --from=builder /build/package*.json ./
COPY --from=builder /build/server.js ./
COPY --from=builder /build/index.html ./
RUN npm install --production
RUN mkdir -p configs

EXPOSE 3000
CMD ["node", "server.js"]