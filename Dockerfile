# استخدام صورة Node.js الرسمية
FROM node:18-alpine AS base

# تثبيت dependencies فقط عند الحاجة
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# نسخ ملفات package
COPY package.json package-lock.json* ./
RUN npm ci

# إعادة بناء الكود المصدري فقط عند الحاجة
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# تعطيل telemetry أثناء البناء
ENV NEXT_TELEMETRY_DISABLED 1

# تعيين عنوان API أثناء البناء
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

# بناء التطبيق
RUN npm run build

# صورة الإنتاج، نسخ جميع الملفات وتشغيل next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# نسخ الملفات الضرورية من builder
RUN [ -d /app/public ] && cp -r /app/public ./public || echo "No public folder, skipping"
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 4001

ENV PORT 4001
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
