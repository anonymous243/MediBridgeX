'use client';

/**
 * BrandLogo — Central reusable brand component for MediBridgeX.
 *
 * Handles all branding rendering across the entire application with:
 * - Intelligent click routing (public → /, dashboard → /dashboard)
 * - Four rendering variants: hero | full | compact | icon
 * - Five sizes: xs | sm | md | lg | xl
 * - Inverted mode for dark backgrounds
 * - Animated heart icon and ECG line from the existing identity
 * - AuthBrandHeader: dedicated premium card header composition for auth/onboarding
 */

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// ─── Size Maps ────────────────────────────────────────────────────────────────

const ICON_SIZES = {
  xs: 18,
  sm: 24,
  md: 32,
  lg: 44,
  xl: 56,
};

const TEXT_SIZES: Record<string, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-2xl',
};

const TAGLINE_SIZES: Record<string, string> = {
  xs: 'text-[7px]',
  sm: 'text-[8px]',
  md: 'text-[9px]',
  lg: 'text-[10px]',
  xl: 'text-xs',
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type BrandLogoVariant = 'hero' | 'full' | 'compact' | 'icon';
export type BrandLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type BrandLogoContext = 'public' | 'dashboard';

export interface BrandLogoProps {
  /** Visual variant: hero (large stacked), full (icon+wordmark+tagline), compact (icon+wordmark), icon (icon-only pill) */
  variant?: BrandLogoVariant;
  /** Routing context: 'public' → /, 'dashboard' → /dashboard */
  context?: BrandLogoContext;
  /** Size scale */
  size?: BrandLogoSize;
  /** Invert colours for dark backgrounds */
  inverted?: boolean;
  /** Extra className on the wrapper */
  className?: string;
  /** Disable link wrapping (decorative use) */
  noLink?: boolean;
}

// ─── Heart Icon ───────────────────────────────────────────────────────────────

function HeartIcon({ size, inverted }: { size: number; inverted: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', flexShrink: 0 }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mbx-heart-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <style>{`
          @keyframes mbx-heartbeat {
            0%   { transform: scale(1); }
            50%  { transform: scale(1.045); }
            100% { transform: scale(1); }
          }
          .mbx-heart-base {
            transform-origin: 20px 20px;
            animation: mbx-heartbeat 3s ease-in-out infinite;
          }
          @keyframes mbx-heartline {
            0%   { stroke-dashoffset: 60; }
            100% { stroke-dashoffset: 0; }
          }
          .mbx-heartline {
            stroke-dasharray: 30 30;
            animation: mbx-heartline 3s linear infinite;
          }
        `}</style>
      </defs>

      <g className="mbx-heart-base">
        <path
          d="M20 34 C16 31 4 22 4 13 C4 8 8 4 13 4 C16 4 18 6 20 10 C22 6 24 4 27 4 C32 4 36 8 36 13 C36 22 24 31 20 34"
          fill={inverted ? 'white' : 'url(#mbx-heart-grad)'}
          opacity={inverted ? 0.92 : 1}
        />
        <path
          className="mbx-heartline"
          d="M2 18 L12 18 L15 12 L18 24 L22 18 L38 18"
          stroke={inverted ? '#1e3a5f' : 'white'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.9"
        />
      </g>
    </svg>
  );
}

// ─── Icon Pill Container ──────────────────────────────────────────────────────

function IconPill({
  size,
  inverted,
  padded = false,
  className: extraCn,
}: {
  size: number;
  inverted: boolean;
  padded?: boolean;
  className?: string;
}) {
  const p = padded ? Math.round(size * 0.3) : 0;
  const dim = size + p * 2;
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-2xl shadow-xl transition-transform hover:scale-105',
        inverted
          ? 'bg-white/15 ring-1 ring-white/20 shadow-white/5'
          : 'bg-slate-950 shadow-slate-900/30',
        extraCn
      )}
      style={{ width: dim, height: dim }}
    >
      <HeartIcon size={size} inverted={inverted} />
    </div>
  );
}

// ─── Wordmark ─────────────────────────────────────────────────────────────────

function Wordmark({
  size,
  inverted,
  tagline,
}: {
  size: BrandLogoSize;
  inverted: boolean;
  tagline?: string;
}) {
  return (
    <div className="flex flex-col">
      <span
        className={cn(
          'font-black tracking-[-0.04em] leading-none',
          TEXT_SIZES[size],
          inverted ? 'text-white' : 'text-slate-950'
        )}
      >
        MediBridgeX
      </span>
      {tagline && (
        <span
          className={cn(
            'font-bold uppercase tracking-[0.25em] mt-[3px]',
            TAGLINE_SIZES[size],
            inverted ? 'text-white/45' : 'text-slate-400'
          )}
        >
          {tagline}
        </span>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function BrandLogo({
  variant = 'compact',
  context = 'public',
  size = 'md',
  inverted = false,
  className,
  noLink = false,
}: BrandLogoProps) {
  const iconPx = ICON_SIZES[size];
  const href = context === 'dashboard' ? '/dashboard' : '/';

  let content: React.ReactNode;

  if (variant === 'icon') {
    content = (
      <div className={className}>
        <IconPill size={iconPx} inverted={inverted} padded />
      </div>
    );
  } else if (variant === 'compact') {
    content = (
      <div className={cn('flex items-center gap-2.5', className)}>
        <IconPill size={iconPx} inverted={inverted} />
        <Wordmark size={size} inverted={inverted} />
      </div>
    );
  } else if (variant === 'full') {
    const tagline =
      size === 'lg' || size === 'xl' ? 'Healthcare Solutions' : undefined;
    content = (
      <div className={cn('flex items-center gap-3', className)}>
        <IconPill size={iconPx} inverted={inverted} />
        <Wordmark size={size} inverted={inverted} tagline={tagline} />
      </div>
    );
  } else {
    // hero — large icon pill centered above stacked wordmark
    content = (
      <div className={cn('flex flex-col items-center gap-4', className)}>
        <IconPill size={iconPx} inverted={inverted} padded />
        <div className="flex flex-col items-center gap-1">
          <span
            className={cn(
              'font-black tracking-[-0.04em] leading-none',
              TEXT_SIZES[size],
              inverted ? 'text-white' : 'text-slate-950'
            )}
          >
            MediBridgeX
          </span>
          <span
            className={cn(
              'font-bold uppercase tracking-[0.3em]',
              TAGLINE_SIZES[size],
              inverted ? 'text-white/45' : 'text-slate-400'
            )}
          >
            Healthcare Solutions
          </span>
        </div>
      </div>
    );
  }

  if (noLink) return <>{content}</>;

  return (
    <Link
      href={href}
      className="outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-2xl"
      aria-label="MediBridgeX — Go to home"
    >
      {content}
    </Link>
  );
}

// ─── AuthBrandHeader ──────────────────────────────────────────────────────────
// Premium card-header composition for auth (sign-in, sign-up) and onboarding.
// Renders: large icon pill → wordmark → enterprise tagline → context subtitle.
// Follows the same visual hierarchy as the sidebar/dashboard branding.

export interface AuthBrandHeaderProps {
  /** Contextual subtitle beneath the logo (e.g. "Sign in to your account") */
  subtitle?: string;
  /** Optional secondary descriptor (e.g. "Workspace Provisioning") */
  descriptor?: string;
  /** Trust/compliance badges to show below the subtitle */
  badges?: string[];
  className?: string;
}

export function AuthBrandHeader({
  subtitle,
  descriptor,
  badges,
  className,
}: AuthBrandHeaderProps) {
  return (
    <div className={cn('flex flex-col items-center text-center gap-5 pb-8 pt-2', className)}>
      {/* Logo lockup — icon pill + stacked wordmark */}
      <div className="flex flex-col items-center gap-3">
        {/* Icon pill — sized to match dashboard sidebar pill */}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 shadow-xl shadow-slate-900/20 transition-transform hover:scale-[1.03]">
          <HeartIcon size={28} inverted={false} />
        </div>

        {/* Wordmark block */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-xl font-black tracking-[-0.04em] text-slate-950 leading-none">
            MediBridgeX
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-slate-400">
            Healthcare Infrastructure
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="flex w-full items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        {descriptor && (
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 shrink-0 px-1">
            {descriptor}
          </span>
        )}
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-semibold text-slate-500 leading-relaxed max-w-xs">
            {subtitle}
          </p>

          {/* Compliance badges */}
          {badges && badges.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {badges.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── SidebarBrand ─────────────────────────────────────────────────────────────

export interface SidebarBrandProps {
  collapsed: boolean;
  className?: string;
}

export function SidebarBrand({ collapsed, className }: SidebarBrandProps) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        'flex items-center outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl transition-all',
        collapsed ? 'justify-center' : 'gap-3',
        className
      )}
      aria-label="MediBridgeX — Dashboard home"
    >
      {collapsed ? (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 shadow-lg shadow-slate-900/20 transition-transform hover:scale-105">
          <HeartIcon size={20} inverted={false} />
        </div>
      ) : (
        <>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 shadow-lg shadow-slate-900/20">
            <HeartIcon size={20} inverted={false} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-lg font-black tracking-[-0.04em] text-slate-950 leading-none">
              MediBridgeX
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
              Interoperability
            </span>
          </div>
        </>
      )}
    </Link>
  );
}
