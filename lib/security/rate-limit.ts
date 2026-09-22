import { DomainError } from '@/domain/errors';

export class RateLimiter {
  private requestCounts: Map<string, { count: number, resetAt: number }> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs = 60 * 1000, maxRequests = 20) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  checkRateLimit(ip: string = 'global'): void {
    const now = Date.now();
    const record = this.requestCounts.get(ip);

    if (!record || now > record.resetAt) {
      this.requestCounts.set(ip, { count: 1, resetAt: now + this.windowMs });
      this.cleanup();
      return;
    }

    if (record.count >= this.maxRequests) {
      throw new DomainError('RATE_LIMITED', 'Rate limit exceeded. Please try again later.');
    }

    record.count += 1;
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, record] of this.requestCounts.entries()) {
      if (now > record.resetAt) {
        this.requestCounts.delete(key);
      }
    }
  }

  // Test-only reset method
  resetForTesting() {
    this.requestCounts.clear();
  }
}

// Global instance to persist across API route re-executions in development
const globalForLimiter = globalThis as unknown as {
  globalRateLimiter: RateLimiter | undefined;
};
export const rateLimiter = globalForLimiter.globalRateLimiter || new RateLimiter();
if (process.env.NODE_ENV !== 'production') {
  globalForLimiter.globalRateLimiter = rateLimiter;
}
