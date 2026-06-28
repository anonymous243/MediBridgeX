"use client";

import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

// HIPAA/SOC2 Compliance: 15 minutes of inactivity triggers auto-logout
const TIMEOUT_MS = 15 * 60 * 1000;
const WARNING_MS = 60 * 1000; // Show warning 1 minute before timeout

export function SessionTimeout() {
  const { user, logout, setSessionExpired } = useAuthStore();
  const [showWarning, setShowWarning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimers = () => {
    if (!user) return; // Only track when logged in

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);

    setShowWarning(false);

    // Set warning timer (14 minutes)
    warningRef.current = setTimeout(() => {
      setShowWarning(true);
    }, TIMEOUT_MS - WARNING_MS);

    // Set hard logout timer (15 minutes)
    timeoutRef.current = setTimeout(async () => {
      setSessionExpired(true);
      await logout();
    }, TIMEOUT_MS);
  };

  useEffect(() => {
    if (!user) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      setShowWarning(false);
      return;
    }

    // Initialize timers
    resetTimers();

    // Event listeners for activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const handleActivity = () => resetTimers();

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [user]);

  return (
    <AnimatePresence>
      {showWarning && user && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-[9999] max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-rose-100 flex items-start gap-4"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Session Expiring Soon</h3>
            <p className="mt-1 text-xs text-slate-500 font-medium leading-relaxed">
              For your security and HIPAA compliance, you will be logged out automatically in less than 60 seconds due to inactivity.
            </p>
            <button 
              onClick={resetTimers}
              className="mt-3 w-full rounded-xl bg-slate-900 py-2 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-slate-800"
            >
              Keep Me Logged In
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
