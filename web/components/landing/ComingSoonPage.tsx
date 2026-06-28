import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Construction } from "lucide-react";

interface ComingSoonPageProps {
  title: string;
  subtitle: string;
  description: string;
  badge: string;
}

export function ComingSoonPage({ title, subtitle, description, badge }: ComingSoonPageProps) {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        {/* Soft radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute w-[600px] h-[600px] rounded-full opacity-30 blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-xl mx-auto">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-8">
            <Construction className="w-8 h-8 text-slate-500" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-purple-600">
              {badge}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            {title}
          </h1>
          <p className="text-lg font-semibold text-slate-500 mb-3">{subtitle}</p>
          <p className="text-sm text-slate-400 leading-relaxed mb-10">{description}</p>

          {/* CTA */}
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)" }}
            >
              Back to Home
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
