import React from 'react';
import Link from 'next/link';
import { ArrowRight, Terminal } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';

export function CTABlock() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <FadeIn>
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your interoperability?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Join leading healthcare organizations using MediBridgeX to process, map, and secure millions of HL7 and FHIR messages every day.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/sign-up"
                className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 transition-all hover:scale-105"
              >
                Get Started Free
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 text-sm font-semibold leading-6 text-white hover:text-purple-300 transition-colors"
              >
                <Terminal className="w-4 h-4" />
                Read the Docs <span aria-hidden="true">→</span>
              </Link>
            </div>
            
            {/* Background glow effects */}
            <div className="absolute -top-24 -right-24 -z-10 transform-gpu blur-3xl opacity-30" aria-hidden="true">
              <div 
                className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-[#ec4899] to-[#a855f7]"
                style={{ clipPath: 'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)' }}
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
