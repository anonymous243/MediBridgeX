"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SSOButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

export function SSOButton({ icon, children, className, ...props }: SSOButtonProps) {
  return (
    <button
      className={cn(
        "group flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-slate-900 bg-slate-900 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-slate-800 hover:border-slate-800 active:scale-[0.98] shadow-lg shadow-slate-900/10",
        className
      )}
      {...props}
    >
      {icon && <span className="text-slate-300 group-hover:text-white transition-colors">{icon}</span>}
      {children}
    </button>
  );
}
