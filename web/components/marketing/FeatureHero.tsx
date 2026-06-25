import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';

interface FeatureHeroProps {
  badge: string;
  title: React.ReactNode;
  description: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
}

export function FeatureHero({
  badge,
  title,
  description,
  primaryCtaText = 'Get Started Free',
  primaryCtaHref = '/auth/sign-up',
}: FeatureHeroProps) {
  return (
    <div className="relative overflow-hidden bg-white pt-24 pb-16 sm:pt-32 sm:pb-24 border-b border-gray-100">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 z-0 flex justify-center overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 w-[800px] h-[600px] opacity-20 blur-[100px] rounded-full"
          style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <FadeIn>
          <div className="mx-auto flex max-w-max items-center gap-x-2 rounded-full px-4 py-1.5 text-sm font-medium border border-gray-200 bg-white/50 backdrop-blur-sm text-gray-600 mb-8 shadow-sm uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}></span>
            {badge}
          </div>
          
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-8 text-gray-600">
            {description}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
            <Link
              href={primaryCtaHref}
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
            >
              {primaryCtaText}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="text-sm font-semibold leading-6 text-gray-900 hover:text-purple-600 transition-colors">
              Talk to Sales <span aria-hidden="true">→</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
