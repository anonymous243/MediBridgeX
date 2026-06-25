"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, className, leftIcon, rightIcon, id, ...props }, ref) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
      <div className="w-full space-y-2">
        <label
          htmlFor={id}
          className="text-xs font-bold uppercase tracking-wider text-slate-500"
        >
          {label}
        </label>

        {/* Render a placeholder skeleton on SSR to avoid extension hydration mismatch */}
        {!mounted ? (
          <div className="h-12 w-full rounded-full border border-slate-200 bg-white shadow-sm" />
        ) : (
          <div className="relative group">
            {leftIcon && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500">
                {leftIcon}
              </div>
            )}
            <input
              id={id}
              ref={ref}
              className={cn(
                "w-full rounded-full border border-slate-200 bg-white text-slate-900 py-3 transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 shadow-sm",
                leftIcon ? "pl-11" : "pl-6",
                rightIcon ? "pr-11" : "pr-6",
                error ? "border-red-500 focus:border-red-500/50 focus:ring-red-500/10 placeholder:text-red-500/80" : "",
                className
              )}
              {...props}
            />
            {rightIcon && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors">
                {rightIcon}
              </div>
            )}
          </div>
        )}

        {error && <p className="text-xs text-red-500 ml-4">{error}</p>}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
