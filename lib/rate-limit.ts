type RateLimitInfo = {
  count: number;
  resetTime: number;
};

const cache = new Map<string, RateLimitInfo>();

// Clean up expired items periodically to prevent memory leaks
if (typeof global !== 'undefined') {
  const interval = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of cache.entries()) {
      if (now > value.resetTime) {
        cache.delete(key);
      }
    }
  }, 5 * 60 * 1000);
  
  // Prevent keeping the node process alive in non-serverless environments if any
  if (interval && typeof interval.unref === 'function') {
    interval.unref();
  }
}

export interface RateLimiterOptions {
  limit: number;      // number of requests allowed in window
  windowMs: number;   // window size in milliseconds
}

export function rateLimit(key: string, options: RateLimiterOptions): {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
} {
  const now = Date.now();
  const resetTime = now + options.windowMs;

  const current = cache.get(key);

  if (!current) {
    cache.set(key, { count: 1, resetTime });
    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - 1,
      reset: resetTime,
    };
  }

  if (now > current.resetTime) {
    current.count = 1;
    current.resetTime = resetTime;
    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - 1,
      reset: resetTime,
    };
  }

  if (current.count >= options.limit) {
    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      reset: current.resetTime,
    };
  }

  current.count += 1;
  return {
    success: true,
    limit: options.limit,
    remaining: options.limit - current.count,
    reset: current.resetTime,
  };
}
