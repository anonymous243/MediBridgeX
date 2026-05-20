'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Menu,
  Command,
  User,
  Settings,
  ChevronDown,
  LogOut,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/useUIStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth.service';

export function Header() {
  const { toggleMobileMenu, isSidebarCollapsed, activeNetworkRequests } = useUIStore();
  const { user, setSessionUser } = useAuthStore();
  const isLoading = activeNetworkRequests > 0;
  const router = useRouter();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    setSessionUser(null);
    router.push('/auth/sign-in');
  };

  return (
    <>
      {/* GLOBAL NETWORK LOADING BAR */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50 animate-pulse" 
          />
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-xl lg:h-24 lg:px-10 transition-all">
      {/* LEFT: MOBILE MENU & LOGO (MOBILE ONLY) */}
      <div className="flex items-center gap-4 lg:hidden">
        <button
          onClick={toggleMobileMenu}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link href="/dashboard">
          <Logo size={24} showText={false} />
        </Link>
      </div>

      {/* SEARCH BAR (ADAPTIVE) */}
      <div className="flex flex-1 items-center justify-start max-w-2xl">
        <div className="group relative w-full max-w-[480px]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-slate-950">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Search records, patient ID, or HL7 message..."
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-12 text-sm font-semibold transition-all focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 outline-none hidden md:block"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 bg-white text-[10px] font-black text-slate-400">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
          
          {/* Mobile Search Trigger */}
          <button className="flex md:hidden h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* RIGHT: ACTIONS & PROFILE */}
      <div className="flex items-center gap-3 lg:gap-5">
        {/* NOTIFICATIONS */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}
            className={cn(
              "relative flex h-11 w-11 items-center justify-center rounded-xl border transition-all",
              isNotificationsOpen ? "bg-slate-100 border-slate-300 text-slate-900" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
            )}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-slate-900">Notifications</h3>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700">Mark all read</button>
                </div>
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 mb-3">
                    <CheckCircle2 className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="text-xs font-bold text-slate-600">You're all caught up!</p>
                  <p className="mt-1 text-[10px] text-slate-400">No new alerts at this time.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* STATUS BADGE (DESKTOP) */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">HL7 Mainline Active</span>
        </div>

        <div className="h-8 w-px bg-slate-200 hidden sm:block mx-1" />

        {/* PROFILE DROPDOWN */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }}
            className={cn(
              "group flex items-center gap-3 rounded-2xl border p-1 transition-all",
              isProfileOpen ? "bg-slate-50 border-slate-200" : "border-transparent hover:bg-slate-50 hover:border-slate-100"
            )}
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 font-black text-white shadow-lg shadow-slate-900/20 uppercase">
              {user?.name?.charAt(0) || 'U'}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-black text-slate-900 leading-none">{user?.name || 'Loading...'}</p>
              <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user?.role?.replace('_', ' ') || 'User'}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:block transition-transform group-hover:translate-y-0.5" />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10"
              >
                <div className="mb-2 border-b border-slate-100 px-3 pb-3 pt-2">
                  <p className="text-sm font-black text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <div className="space-y-1">
                  <Link href="/dashboard/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
                    <User className="h-4 w-4" /> My Profile
                  </Link>
                  <Link href="/dashboard/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
                    <Settings className="h-4 w-4" /> Workspace Settings
                  </Link>
                  <div className="my-1 border-t border-slate-100" />
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" /> Log Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
    </>
  );
}
