"use client";

import React from "react";

interface AuthHeaderProps {
  title: string;
  description: string;
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="space-y-2 mb-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>
      <p className="text-slate-500 font-medium">
        {description}
      </p>
    </div>
  );
}