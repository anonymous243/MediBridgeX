"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function Navbar() {
  return (
    <nav className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ── Logo + Brand ── */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Logo size={30} showText={true} layout="horizontal" />
        </Link>

        {/* ── Nav Links ── */}
        <div className="hidden md:flex items-center gap-8">
          {["Product", "Solutions", "Developers", "Resources", "Company"].map((item) => (
            <Link
              key={item}
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-150"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* ── Right side ── */}
        <div className="flex items-center gap-4">
          {/* Sun/theme icon */}
          <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="4" strokeWidth={2} />
              <path
                strokeLinecap="round"
                strokeWidth={2}
                d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
              />
            </svg>
          </button>

          <Link
            href="/auth/sign-in"
            className="text-sm font-bold text-slate-700 transition hover:text-slate-950"
          >
            Sign In
          </Link>

          <Link
            href="/auth/sign-up"
            className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)",
            }}
          >
            Request Early Access
          </Link>
        </div>
      </div>
    </nav>
  );
}