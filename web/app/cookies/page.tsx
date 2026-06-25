"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Check } from "lucide-react";

export default function CookieSettingsPage() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In a real app, this would save to a cookie consent manager
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 sm:px-12 max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Cookie Preferences
          </h1>
          <p className="text-slate-500 leading-relaxed">
            We use cookies to ensure our platform functions securely and to understand how you interact with our website. You can manage your privacy settings below.
          </p>
        </div>

        <div className="space-y-6 mb-10">
          {/* Strictly Necessary */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-start justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Strictly Necessary</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                These cookies are required for the website to function properly, including user authentication, security, and session management. They cannot be disabled.
              </p>
            </div>
            <div className="shrink-0 pt-1">
              <span className="text-xs font-bold text-slate-400 bg-slate-200 px-3 py-1 rounded-full uppercase">Always On</span>
            </div>
          </div>

          {/* Analytics */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start justify-between gap-6 hover:border-slate-300 transition-colors">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Analytics & Performance</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                These cookies help us understand how visitors use our site by collecting and reporting information anonymously. (e.g., Google Analytics, PostHog).
              </p>
            </div>
            <div className="shrink-0 pt-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={analyticsEnabled}
                  onChange={() => setAnalyticsEnabled(!analyticsEnabled)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9d174d]"></div>
              </label>
            </div>
          </div>

          {/* Marketing */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start justify-between gap-6 hover:border-slate-300 transition-colors">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Marketing & Advertising</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.
              </p>
            </div>
            <div className="shrink-0 pt-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={marketingEnabled}
                  onChange={() => setMarketingEnabled(!marketingEnabled)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9d174d]"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleSave}
            className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all shadow-md"
          >
            Save Preferences
          </button>
          
          {saved && (
            <span className="flex items-center gap-2 text-sm font-bold text-green-600 animate-in fade-in slide-in-from-left-2">
              <Check className="w-4 h-4" />
              Preferences saved
            </span>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
