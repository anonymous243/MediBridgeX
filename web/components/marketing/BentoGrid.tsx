import React from 'react';
import { FadeIn } from '@/components/animations/FadeIn';

export interface BentoItem {
  title: string;
  description: string;
  icon: React.ElementType;
  className?: string;
}

interface BentoGridProps {
  items: BentoItem[];
}

export function BentoGrid({ items }: BentoGridProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <FadeIn key={index} delay={index * 0.1}>
              <div 
                className={`group relative h-full rounded-3xl bg-white p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${item.className || ''}`}
              >
                <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-gray-900/5 group-hover:ring-purple-500/20 transition-all"></div>
                
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 group-hover:bg-purple-100 transition-colors">
                  <Icon className="h-6 w-6 text-purple-600" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
                
                {/* Decorative corner gradient on hover */}
                <div 
                  className="absolute bottom-0 right-0 h-32 w-32 -m-8 opacity-0 group-hover:opacity-10 transition-opacity blur-2xl rounded-full"
                  style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
                />
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
