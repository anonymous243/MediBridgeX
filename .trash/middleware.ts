import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ==========================================
// CONFIGURATION & THRESHOLDS
// ==========================================

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000; // Default 1 minute

const LIMITS = {
  AUTH: Number(process.env.RATE_LIMIT_MAX_AUTH) || 5,         // /auth/sign-in, /auth/sign-up
  FORM: Number(process.env.RATE_LIMIT_MAX_FORM) || 10,        // /contact, /onboarding
  DASHBOARD: Number(process.env.RATE_LIMIT_MAX_DASHBOARD) || 60,// /dashboard/*
  PUBLIC: Number(process.env.RATE_LIMIT_MAX_PUBLIC) || 120,    // General pages (landing, about, partners, etc.)
};

// Map of route categories to their path matchers
const ROUTE_CATEGORIES = [
  { prefix: '/auth/', limit: LIMITS.AUTH, code: 'RL_AUTH' },
  { prefix: '/api/auth/', limit: LIMITS.AUTH, code: 'RL_AUTH' },   // BFF auth routes same limit
  { prefix: '/onboarding', limit: LIMITS.FORM, code: 'RL_FORM' },
  { prefix: '/contact', limit: LIMITS.FORM, code: 'RL_FORM' },
  { prefix: '/dashboard', limit: LIMITS.DASHBOARD, code: 'RL_DASH' },
];

// Helper to determine rate limit configuration for a path
function getRouteConfig(pathname: string) {
  for (const route of ROUTE_CATEGORIES) {
    if (pathname.startsWith(route.prefix)) {
      return { limit: route.limit, code: route.code };
    }
  }
  return { limit: LIMITS.PUBLIC, code: 'RL_PUB' };
}

// ==========================================
// CLIENT IP RESOLVER
// ==========================================

function getClientIp(req: NextRequest): string {
  // Try X-Forwarded-For (typically: client, proxy1, proxy2)
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',');
    const clientIp = ips[0]?.trim();
    if (clientIp) return clientIp;
  }

  // Try X-Real-IP
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  // Try Next.js built-in property
  const nextIp = (req as unknown as { ip?: string }).ip;
  if (nextIp) return nextIp;

  return '127.0.0.1';
}

// ==========================================
// RATE LIMITING ENGINES
// ==========================================

// 1. Edge-compatible In-Memory Rate Limiter (with lazy garbage collection)
interface IpRateLimitRecord {
  timestamps: number[];
}

class InMemoryRateLimiter {
  private cache = new Map<string, IpRateLimitRecord>();
  private maxCacheSize = 5000;
  private cleanupCount = 0;

  constructor() {}

  // Run a simple cleanup scan every 100 requests to prevent leaks
  private lazyCleanup() {
    this.cleanupCount++;
    if (this.cleanupCount % 100 === 0) {
      const now = Date.now();
      for (const [key, record] of this.cache.entries()) {
        const validTimestamps = record.timestamps.filter(t => now - t < WINDOW_MS);
        if (validTimestamps.length === 0) {
          this.cache.delete(key);
        } else {
          this.cache.set(key, { timestamps: validTimestamps });
        }
      }
    }
  }

  public check(key: string, limit: number): { success: boolean; remaining: number; reset: number } {
    this.lazyCleanup();
    
    const now = Date.now();
    let record = this.cache.get(key);

    if (!record) {
      if (this.cache.size >= this.maxCacheSize) {
        // Evict oldest map key
        const firstKey = this.cache.keys().next().value;
        if (firstKey) this.cache.delete(firstKey);
      }
      record = { timestamps: [] };
      this.cache.set(key, record);
    }

    // Filter timestamps falling inside the window
    record.timestamps = record.timestamps.filter(t => now - t < WINDOW_MS);

    const success = record.timestamps.length < limit;

    if (success) {
      record.timestamps.push(now);
      this.cache.set(key, record);
    }

    const remaining = Math.max(0, limit - record.timestamps.length);
    const oldestTimestamp = record.timestamps[0] || now;
    const reset = oldestTimestamp + WINDOW_MS;

    return { success, remaining, reset };
  }
}

const localRateLimiter = new InMemoryRateLimiter();

// 2. Upstash Redis Rate Limiter (Lightweight REST implementation for Edge compatibility)
async function checkRedisRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ success: boolean; remaining: number; reset: number } | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null; // Gracefully fall back to memory
  }

  const now = Date.now();
  
  // Lua script matching the sliding window algorithm
  const luaScript = `
    local key = KEYS[1]
    local now = tonumber(ARGV[1])
    local window = tonumber(ARGV[2])
    local limit = tonumber(ARGV[3])
    
    local min = now - window
    redis.call('zremrangebyscore', key, 0, min)
    local count = redis.call('zcard', key)
    
    if count < limit then
      redis.call('zadd', key, now, now)
      redis.call('expire', key, math.ceil(window / 1000) * 2) -- padded expiry
      return {1, limit - count - 1, now + window}
    else
      local oldest = redis.call('zrange', key, 0, 0, 'WITHSCORES')
      local reset = now + window
      if #oldest > 0 then
        reset = tonumber(oldest[2]) + window
      end
      return {0, 0, reset}
    end
  `;

  try {
    const response = await fetch(`${url}/eval`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script: luaScript,
        keys: [key],
        args: [now.toString(), windowMs.toString(), limit.toString()],
      }),
      // Short timeout to guarantee API responsiveness is not bottlenecked by Redis latency
      signal: AbortSignal.timeout(1500),
    });

    if (!response.ok) {
      console.warn('Upstash Redis check returned non-200. Falling back to local memory rate limiting.');
      return null;
    }

    const data = await response.json();
    const result = data.result; // [success_flag, remaining_count, reset_timestamp]
    
    if (Array.isArray(result)) {
      return {
        success: result[0] === 1,
        remaining: Number(result[1]),
        reset: Number(result[2]),
      };
    }
    return null;
  } catch (error) {
    console.error('Error contacting Upstash Redis rate limiter:', error);
    return null; // Fallback to local memory limiter
  }
}

// ==========================================
// CUSTOM 429 BLOCK SCREEN
// ==========================================

function renderBlockScreen(ip: string, requestId: string, ruleCode: string, resetTime: number): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Shield Activated - MediBridgeX</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(17, 24, 39, 0.7);
      --border: rgba(55, 65, 81, 0.4);
      --text: #f3f4f6;
      --text-muted: #9ca3af;
      --primary: #3b82f6;
      --danger: #ef4444;
      --neon-glow: rgba(59, 130, 246, 0.15);
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      overflow-x: hidden;
      position: relative;
    }

    .glow-1 {
      position: absolute;
      top: -10%;
      left: -10%;
      width: 40%;
      height: 40%;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
      pointer-events: none;
      z-index: 1;
    }

    .glow-2 {
      position: absolute;
      bottom: -10%;
      right: -10%;
      width: 40%;
      height: 40%;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
      pointer-events: none;
      z-index: 1;
    }
    
    .container {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 540px;
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 80px var(--neon-glow);
      animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .icon-wrapper {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 50%;
      margin-bottom: 24px;
      color: var(--danger);
      box-shadow: 0 0 20px rgba(239, 68, 68, 0.1);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
      70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    
    .icon-wrapper svg {
      width: 40px;
      height: 40px;
    }
    
    h1 {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    p.subtitle {
      font-size: 15px;
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 28px;
    }
    
    .timer-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 28px;
    }
    
    .timer-text {
      font-size: 14px;
      color: var(--text-muted);
    }
    
    .timer-val {
      font-size: 28px;
      font-weight: 700;
      color: var(--primary);
      font-family: 'JetBrains Mono', monospace;
      margin-top: 4px;
    }
    
    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 44px;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      margin-bottom: 20px;
    }
    
    .action-btn:hover {
      background: #2563eb;
      transform: translateY(-1px);
    }
    
    .action-btn:disabled {
      background: #1e293b;
      color: #64748b;
      cursor: not-allowed;
      transform: none;
      border: 1px solid var(--border);
    }
    
    .footer-links {
      font-size: 13px;
      color: var(--text-muted);
    }
    
    .footer-links a {
      color: var(--primary);
      text-decoration: none;
    }
    
    .footer-links a:hover {
      text-decoration: underline;
    }
    
    .divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.08);
      margin: 24px 0;
    }
    
    details {
      text-align: left;
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 8px;
      padding: 12px;
    }
    
    details summary {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      user-select: none;
    }
    
    .details-content {
      margin-top: 10px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #34d399;
      line-height: 1.5;
    }
    
    .details-content div {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    
    .details-content span.label {
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <div class="glow-1"></div>
  <div class="glow-2"></div>
  <div class="container">
    <div class="icon-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
      </svg>
    </div>
    <h1>Too Many Requests</h1>
    <p class="subtitle">MediBridgeX security systems detected an unusually high volume of traffic from your IP address. To safeguard health data and system integrity, requests have been temporarily paused.</p>
    
    <div class="timer-card">
      <p class="timer-text">Security cooldown active. You can retry in:</p>
      <div class="timer-val" id="countdown">--s</div>
    </div>
    
    <button class="action-btn" id="retry-btn" disabled onclick="window.location.reload()">Reload Page</button>
    
    <details>
      <summary>Diagnostic Details</summary>
      <div class="details-content">
        <div><span class="label">IP Address:</span> <span>${ip}</span></div>
        <div><span class="label">Request ID:</span> <span>${requestId}</span></div>
        <div><span class="label">Rule Code:</span> <span>${ruleCode}</span></div>
        <div><span class="label">Timestamp:</span> <span>${new Date().toISOString()}</span></div>
      </div>
    </details>
    
    <div class="divider"></div>
    
    <div class="footer-links">
      Need immediate assistance? Contact the <a href="mailto:security@medibridgex.io">MediBridgeX Security Operations Center</a>
    </div>
  </div>

  <script>
    const resetTime = ${resetTime};
    const countdownEl = document.getElementById('countdown');
    const retryBtn = document.getElementById('retry-btn');
    
    function updateCountdown() {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((resetTime - now) / 1000));
      
      countdownEl.textContent = diff + 's';
      
      if (diff <= 0) {
        countdownEl.textContent = 'Ready';
        retryBtn.disabled = false;
        clearInterval(timerId);
      }
    }
    
    updateCountdown();
    const timerId = setInterval(updateCountdown, 1000);
  </script>
</body>
</html>`;
}

// ==========================================
// AUTH COOKIE NAME (must match route handlers)
// ==========================================
const AUTH_COOKIE_NAME = 'mbx_auth_token';

// Routes that require a valid auth cookie
const PROTECTED_PREFIXES = ['/dashboard'];

// Routes excluded from CSRF check (GET, HEAD, OPTIONS are safe methods)
const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

// ==========================================
// MAIN MIDDLEWARE ENTRYPOINT
// ==========================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  // ─────────────────────────────────────────────
  // STEP 1: Server-side Auth Guard
  // Check httpOnly cookie for protected routes before rendering.
  // This replaces the client-side useEffect guard — ensures the
  // dashboard page never even starts rendering for unauthenticated users.
  // ─────────────────────────────────────────────
  const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
  if (isProtected) {
    const authCookie = request.cookies.get(AUTH_COOKIE_NAME);
    if (!authCookie?.value) {
      const signInUrl = new URL('/auth/sign-in', request.url);
      signInUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // ─────────────────────────────────────────────
  // STEP 2: CSRF Origin Validation
  // For state-mutating API requests, validate the Origin header matches
  // the app's host. SameSite=Strict cookie already blocks most CSRF,
  // but this adds an explicit defense-in-depth layer.
  // ─────────────────────────────────────────────
  if (pathname.startsWith('/api/') && MUTATION_METHODS.has(method)) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    // Allow requests with no origin (e.g. server-to-server) or same-origin
    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          return new NextResponse(
            JSON.stringify({ error: { message: 'CSRF validation failed: Origin mismatch.', code: 'CSRF_BLOCKED' } }),
            {
              status: 403,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }
      } catch {
        // Malformed origin — block the request
        return new NextResponse(
          JSON.stringify({ error: { message: 'CSRF validation failed: Malformed Origin.', code: 'CSRF_BLOCKED' } }),
          {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }
  }

  // ─────────────────────────────────────────────
  // STEP 3: Rate Limiting (existing Layer 2 DDoS protection)
  // ─────────────────────────────────────────────
  const ip = getClientIp(request);
  const routeConfig = getRouteConfig(pathname);
  const rateLimitKey = `ratelimit:${ip}:${routeConfig.code}`;

  let checkResult = await checkRedisRateLimit(rateLimitKey, routeConfig.limit, WINDOW_MS);
  if (!checkResult) {
    checkResult = localRateLimiter.check(rateLimitKey, routeConfig.limit);
  }

  const { success, remaining, reset } = checkResult;

  if (!success) {
    const requestId = crypto.randomUUID();
    const blockHtml = renderBlockScreen(ip, requestId, routeConfig.code, reset);
    const retryAfterSeconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000));

    return new NextResponse(blockHtml, {
      status: 429,
      statusText: 'Too Many Requests',
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Retry-After': retryAfterSeconds.toString(),
        'X-RateLimit-Limit': routeConfig.limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(reset / 1000).toString(),
      },
    });
  }

  // Pass through with rate limit headers
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', routeConfig.limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', Math.ceil(reset / 1000).toString());

  return response;
}


// ==========================================
// ROUTE MATCHING (MATCHER)
// ==========================================
// Exclude static resources, images, favicon, icons, and API proxy routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml, robots.txt (search engine files)
     * - any files with an extension (e.g. .svg, .png, .jpg, .css, .js)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.[a-zA-Z0-9]+$).*)',
  ],
};
