FROM node:20-alpine AS base

WORKDIR /app

RUN apk add --no-cache dumb-init

FROM base AS deps

COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM base AS runner

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

RUN npx prisma generate

USER nestjs

EXPOSE 3000

ENV PORT=3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]