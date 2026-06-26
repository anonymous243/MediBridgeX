"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
    children: React.ReactNode;
    className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, className }) => {
    return (
        <div className={cn(
            "relative w-full rounded-[32px] bg-white border border-slate-100 overflow-hidden",
            "shadow-[0_24px_80px_rgba(15,23,42,0.10),0_4px_20px_rgba(15,23,42,0.06)]",
            "sm:px-12 sm:pt-8 sm:pb-12 p-8 pt-8",
            className
        )}>
            {/* Premium top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 rounded-t-[32px]" />

            {/* Ambient glow behind the logo area */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-blue-500/4 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};