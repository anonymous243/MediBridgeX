// ============================================================
// HTTP Security Headers — MediBridgeX Production Hardening
// Applied to every route. Required for HIPAA technical safeguards.
// ============================================================
const SECURITY_HEADERS = [
  {
    // Prevents XSS, injection, and data-exfiltration attacks
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' http://localhost:8000 https://*.upstash.io wss: ws:",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
  {
    // Forces HTTPS for 2 years — required for HIPAA
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    // Prevents clickjacking attacks (embedding in external iframes)
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    // Prevents MIME-type sniffing attacks
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    // Controls referrer info sent in requests — reduces info leakage
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    // Limits access to sensitive browser APIs (camera, mic, location)
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()',
  },
  {
    // Enables DNS prefetching for performance while maintaining security
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    // Prevents cross-origin information leakage
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    // Prevents cross-origin resource embedding
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin',
  },
];

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['async_hooks', 'node:async_hooks'],
  },
  headers: async () => [
    {
      // Apply security headers to all routes
      source: '/(.*)',
      headers: SECURITY_HEADERS,
    },
  ],
  webpack: (config, { isServer, nextRuntime }) => {
    // Prevent Webpack from trying to bundle or resolve async_hooks in Edge runtime
    if (nextRuntime === 'edge') {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'async_hooks': false,
      };
    }
    return config;
  }
};

export default nextConfig;
