"use client";

import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { useUIStore } from '@/stores/useUIStore';
import { cn } from '@/lib/utils';
import { ProtectedRoute } from '@/components/dashboard/ProtectedRoute';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useUIStore();
  
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isSidebarCollapsed ? "lg:ml-[88px]" : "lg:ml-[280px]"
        )}>
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
