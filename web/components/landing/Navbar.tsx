"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { useState, useRef, useEffect } from "react";

export function Navbar() {
  const [isProductOpen, setIsProductOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProductOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ── Logo + Brand ── */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Logo size={30} showText={true} layout="horizontal" />
        </Link>

        {/* ── Nav Links ── */}
        <div className="hidden md:flex items-center gap-8">
          {/* Product Dropdown */}
          <div className="relative py-4" ref={dropdownRef}>
            <button 
              onClick={() => setIsProductOpen(!isProductOpen)}
              className={`text-sm transition-colors duration-150 flex items-center gap-1 ${isProductOpen ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Product
              <svg className={`w-3 h-3 transition-transform duration-200 ${isProductOpen ? 'text-gray-600 rotate-180' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            <div className={`absolute top-full left-0 mt-0 w-72 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-200 transform ${isProductOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
              <div className="p-2 flex flex-col gap-1">
                <Link 
                  href="/product/fhir-gateway" 
                  onClick={() => setIsProductOpen(false)}
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 border border-transparent hover:border-purple-100 transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">FHIR API Gateway</p>
                    <p className="text-xs text-gray-500 group-hover:text-purple-600/70 transition-colors mt-0.5">RESTful JSON resource mapping</p>
                  </div>
                </Link>

                <Link 
                  href="/product/message-pipeline" 
                  onClick={() => setIsProductOpen(false)}
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 border border-transparent hover:border-pink-100 transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-pink-700 transition-colors">Message Pipeline</p>
                    <p className="text-xs text-gray-500 group-hover:text-pink-600/70 transition-colors mt-0.5">Legacy HL7 processing engine</p>
                  </div>
                </Link>

                <div className="h-px bg-gray-100 my-1 mx-2"></div>

                <Link 
                  href="/docs/security/audit" 
                  onClick={() => setIsProductOpen(false)}
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50 border border-transparent hover:border-teal-100 transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth={2} />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 018 0v4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">Security &amp; Audit</p>
                    <p className="text-xs text-gray-500 group-hover:text-teal-600/70 transition-colors mt-0.5">HIPAA cryptographic logs</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {["Solutions", "Resources", "Company"].map((item) => (
            <Link
              key={item}
              href={item === "Developers" ? "/docs" : "/"}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-150"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* ── Right side ── */}
        <div className="flex items-center gap-4">
          {/* Sun/theme icon */}
          <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="4" strokeWidth={2} />
              <path
                strokeLinecap="round"
                strokeWidth={2}
                d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
              />
            </svg>
          </button>

          <Link
            href="/auth/sign-in"
            className="text-sm font-bold text-slate-700 transition hover:text-slate-950"
          >
            Sign In
          </Link>

          <Link
            href="/auth/sign-up"
            className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)",
            }}
          >
            Request Early Access
          </Link>
        </div>
      </div>
    </nav>
  );
}