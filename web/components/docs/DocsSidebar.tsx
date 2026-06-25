"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, Shield, Zap, Database, Activity } from 'lucide-react';

export const DOCS_NAVIGATION = [
  {
    title: 'Getting Started',
    icon: Book,
    items: [
      { name: 'Introduction', href: '/docs' },
      { name: 'Quickstart', href: '/docs/quickstart' },
    ],
  },
  {
    title: 'Core Concepts',
    icon: Zap,
    items: [
      { name: 'Authentication', href: '/docs/authentication' },
      { name: 'Rate Limits', href: '/docs/rate-limits' },
      { name: 'Errors', href: '/docs/errors' },
    ],
  },
  {
    title: 'FHIR Gateway',
    icon: Database,
    items: [
      { name: 'Patients', href: '/docs/fhir/patients' },
      { name: 'Encounters', href: '/docs/fhir/encounters' },
      { name: 'Observations', href: '/docs/fhir/observations' },
    ],
  },
  {
    title: 'Security & Compliance',
    icon: Shield,
    items: [
      { name: 'HIPAA Audit Trail', href: '/docs/security/audit' },
      { name: 'Data Encryption', href: '/docs/security/encryption' },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-64 flex-shrink-0 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto border-r border-gray-100 bg-white/50 backdrop-blur-sm py-8 px-6 no-scrollbar">
      <div className="space-y-8">
        {DOCS_NAVIGATION.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title}>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                <Icon className="w-4 h-4 text-purple-500" />
                {section.title}
              </h3>
              <ul className="space-y-2 border-l border-gray-100 ml-2 pl-4">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`block text-sm transition-colors ${
                          isActive
                            ? 'text-purple-600 font-medium'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
