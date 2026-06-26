"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  href?: string;
  className?: string;
  text?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  href = "/",
  className,
  text = "Back to home",
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-2 text-sm font-medium text-slate-500 transition-all hover:text-slate-900",
        className
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white transition-all group-hover:border-slate-300 group-hover:bg-slate-50 shadow-sm">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      </div>
      <span>{text}</span>
    </Link>
  );
};
