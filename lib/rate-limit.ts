/**
 * Simple in-memory rate limiting for authentication endpoints
 * For production, consider using Redis or a dedicated rate limiting service
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (clears on server restart)
// Production: Use Redis or similar for distributed systems
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

/**
 * Check if request should be rate limited
 * @param identifier - Unique identifier (IP address, email, etc.)
 * @param maxAttempts - Maximum attempts allowed
 * @param windowMs - Time window in milliseconds
 * @returns Object with allowed status and remaining attempts
 */
export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 5 * 60 * 1000 // 5 minutes default
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired one
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxAttempts - 1,
      resetTime: now + windowMs,
    };
  }

  if (entry.count >= maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(identifier, entry);

  return {
    allowed: true,
    remaining: maxAttempts - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client identifier from request (IP address)
 */
export function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from headers (if behind proxy)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0] || realIp || request.ip || "unknown";
  return ip;
}

/**
 * Creates a rate limit error response
 * @param rateLimit - Rate limit result from checkRateLimit
 * @param maxAttempts - Maximum attempts allowed
 * @param errorMessage - Error message to display
 * @returns NextResponse with 429 status and rate limit headers
 */
export function createRateLimitResponse(
  rateLimit: { resetTime: number },
  maxAttempts: number,
  errorMessage: string
): NextResponse {
  const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
  
  return NextResponse.json(
    {
      error: errorMessage,
      retryAfter,
    },
    {
      status: 429,
      headers: {
        "Retry-After": retryAfter.toString(),
        "X-RateLimit-Limit": maxAttempts.toString(),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": rateLimit.resetTime.toString(),
      },
    }
  );
}

