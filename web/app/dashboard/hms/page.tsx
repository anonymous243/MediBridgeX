"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

export default function HMSDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
      {/* Loading overlay for the iframe */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-500 animate-pulse tracking-widest uppercase">
            Connecting to HMS Engine...
          </p>
        </div>
      )}
      
      {/* 
        This iframe connects to the Python Flask application running locally on port 5000.
        Once deployed, this URL should be updated to the production URL of the HMS service.
      */}
      <iframe 
        src="http://localhost:5000" 
        className="w-full h-full border-0 z-0 bg-white"
        onLoad={() => setIsLoading(false)}
        title="Healthcare Management System"
      />
    </div>
  );
}
