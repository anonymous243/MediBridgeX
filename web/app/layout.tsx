import type { Metadata } from 'next';

import { Inter } from 'next/font/google';

import './globals.css';

import { Toaster } from 'sonner';

import { SessionTimeout } from '@/components/auth/SessionTimeout';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MediBridgeX',
  description:
    'Healthcare interoperability infrastructure platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionTimeout />
        {children}

        {/* TOAST SYSTEM */}
        <Toaster
          richColors
          position="top-right"
          expand
          closeButton
          toastOptions={{
            classNames: {
              toast:
                `
                rounded-3xl border border-slate-200
                bg-white shadow-[0_20px_80px_rgba(15,23,42,0.12)]
                `,
              title:
                'text-sm font-black text-slate-950',
              description:
                'text-sm text-slate-500',
            },
          }}
        />
      </body>
    </html>
  );
}