"use client";

import React from "react";

interface AuthDividerProps {
  text?: string;
}

export const AuthDivider: React.FC<AuthDividerProps> = ({ text = "Trusted Access" }) => {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-slate-200"></div>
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-widest">
        <span className="bg-white px-4 text-slate-400 font-semibold">{text}</span>
      </div>
    </div>
  );
};
