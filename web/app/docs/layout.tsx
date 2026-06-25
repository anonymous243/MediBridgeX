import React from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { DocsSidebar } from '@/components/docs/DocsSidebar';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white selection:bg-purple-100 selection:text-purple-900">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-start">
        <DocsSidebar />
        <main className="flex-1 py-12 px-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
