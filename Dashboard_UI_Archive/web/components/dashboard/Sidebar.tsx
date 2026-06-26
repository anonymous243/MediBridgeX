'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  X,
  LogOut,
  Settings,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { appConfig } from '@/config/app.config';
import { dashboardNavigation } from '@/constants/navigation';
import { useUIStore } from '@/stores/useUIStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { hasPermission, hasRole } from '@/lib/rbac';
import { Logo } from '@/components/ui/logo';

interface SidebarProps {
  variant?: 'desktop' | 'mobile';
}

export function Sidebar({ variant = 'desktop' }: SidebarProps) {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar, closeMobileMenu } = useUIStore();
  const { user } = useAuthStore();

  const isDesktop = variant === 'desktop';

  const NavContent = (
    <div className="flex h-full flex-col">
      {/* LOGO */}
      <div className={cn(
        "flex h-20 items-center px-6 border-b border-slate-100",
        isSidebarCollapsed && isDesktop ? "justify-center px-2" : "justify-between"
      )}>
        <Link href="/dashboard" className="flex items-center transition-opacity hover:opacity-80 active:opacity-60">
          <Logo size={24} showText={!(isSidebarCollapsed && isDesktop)} layout="horizontal" />
        </Link>

        {!isDesktop && (
          <button 
            onClick={closeMobileMenu}
            className="p-2 text-slate-400 hover:text-slate-900 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto custom-scrollbar">
        {dashboardNavigation.map((item) => {
          // RBAC Filtering
          if (item.requiredPermissions && !item.requiredPermissions.every(p => hasPermission(user, p))) {
            return null;
          }
          if (item.requiredRoles && !hasRole(user, item.requiredRoles)) {
            return null;
          }

          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => !isDesktop && closeMobileMenu()}
              title={isSidebarCollapsed && isDesktop ? item.name : undefined}
              className={cn(
                "group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold transition-all relative",
                isActive 
                  ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-950",
                isSidebarCollapsed && isDesktop && "justify-center px-0 h-12 w-12 mx-auto"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "group-hover:text-slate-950")} />
              {(!isSidebarCollapsed || !isDesktop) && (
                <span className="truncate">{item.name}</span>
              )}
              {isActive && isSidebarCollapsed && isDesktop && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER ACTIONS */}
      <div className={cn(
        "p-4 border-t border-slate-100 bg-slate-50/50",
        isSidebarCollapsed && isDesktop ? "px-0" : "px-4"
      )}>
        <div className="space-y-1">
          <button className={cn(
            "flex w-full items-center gap-4 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-white hover:text-slate-900 transition-all",
            isSidebarCollapsed && isDesktop && "justify-center px-0"
          )}>
            <HelpCircle className="h-4 w-4 shrink-0" />
            {(!isSidebarCollapsed || !isDesktop) && <span>Support</span>}
          </button>
          <button className={cn(
            "flex w-full items-center gap-4 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all",
            isSidebarCollapsed && isDesktop && "justify-center px-0"
          )}>
            <LogOut className="h-4 w-4 shrink-0" />
            {(!isSidebarCollapsed || !isDesktop) && <span>Log Out</span>}
          </button>
        </div>
      </div>

      {/* COLLAPSE TOGGLE (DESKTOP ONLY) */}
      {isDesktop && (
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-24 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:text-slate-950"
        >
          {isSidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      )}
    </div>
  );

  if (!isDesktop) {
    return (
      <div className="fixed inset-0 z-[100] lg:hidden">
        {/* OVERLAY */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeMobileMenu}
          className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm"
        />
        {/* PANEL */}
        <motion.aside
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute inset-y-0 left-0 w-[300px] bg-white shadow-2xl flex flex-col"
        >
          {NavContent}
        </motion.aside>
      </div>
    );
  }

  return (
    <motion.aside
      animate={{ width: isSidebarCollapsed ? 88 : 280 }}
      transition={{ type: 'spring', damping: 20, stiffness: 150 }}
      className="fixed left-0 top-0 z-40 hidden h-screen border-r border-slate-200 bg-white lg:flex lg:flex-col overflow-visible"
    >
      {NavContent}
    </motion.aside>
  );
}
