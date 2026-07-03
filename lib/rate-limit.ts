import "server-only";

import { headers } from "next/headers";

type Bucket = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  ok: boolean;
  retryAfterSeconds: number;
};

export async function requestIdentity(fallback = "anonymous") {
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = headerStore.get("x-real-ip")?.trim();
  return forwardedFor || realIp || fallback;
}

export function rateLimit({ key, limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { ok: true, retryAfterSeconds: 0 };
}

export function rateLimitMessage(result: RateLimitResult) {
  return `Bạn thao tác quá nhanh. Vui lòng thử lại sau ${result.retryAfterSeconds} giây.`;
}
