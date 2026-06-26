'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { useUIStore } from '@/stores/useUIStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isSidebarCollapsed, isMobileMenuOpen } = useUIStore();
  const { user, fetchUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      // Restore session from httpOnly cookie via /api/auth/me
      // If cookie is missing/expired, fetchUser sets user=null → middleware redirect fires
      fetchUser().then(() => {
        const currentUser = useAuthStore.getState().user;
        if (!currentUser) {
          router.push('/auth/sign-in');
        } else if (!currentUser.onboardingCompleted) {
          router.push('/onboarding');
        }
      });
    } else if (!user.onboardingCompleted) {
      router.push('/onboarding');
    }
  }, [user, router, fetchUser]);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#f8fafc]">
        <div className="h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading session...</p>
      </div>
    );
  }

  if (!user.onboardingCompleted) {
    return null; // Will redirect in effect
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-950 selection:bg-slate-900 selection:text-white">
      {/* MOBILE SIDEBAR DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && <Sidebar variant="mobile" />}
      </AnimatePresence>

      {/* DESKTOP/TABLET SIDEBAR */}
      <Sidebar variant="desktop" />

      {/* MAIN CONTENT AREA */}
      <div 
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "lg:pl-[88px]" : "lg:pl-[280px]"
        )}
      >
        <Header />

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-[1600px] w-full">
            {children}
          </div>
        </main>

        <footer className="mt-auto border-t border-slate-200 bg-white/50 px-6 py-6 md:px-10">
          <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              © 2026 MediBridgeX Infrastructure. All Rights Reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-[10px] font-black uppercase tracking-tighter text-slate-400 hover:text-slate-900 transition-colors">Privacy Policy</a>
              <a href="#" className="text-[10px] font-black uppercase tracking-tighter text-slate-400 hover:text-slate-900 transition-colors">Compliance Center</a>
              <a href="#" className="text-[10px] font-black uppercase tracking-tighter text-slate-400 hover:text-slate-900 transition-colors">Status</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}