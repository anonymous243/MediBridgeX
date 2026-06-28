"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { useState, useRef, useEffect } from "react";

export function Navbar() {
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const solutionsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProductOpen(false);
      }
      if (solutionsDropdownRef.current && !solutionsDropdownRef.current.contains(event.target as Node)) {
        setIsSolutionsOpen(false);
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
                <Link 
                  href="/product/hms" 
                  onClick={() => setIsProductOpen(false)}
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Healthcare Management (HMS)</p>
                    <p className="text-xs text-gray-500 group-hover:text-blue-600/70 transition-colors mt-0.5">End-to-end hospital management system.</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Solutions Dropdown */}
          <div className="relative py-4" ref={solutionsDropdownRef}>
            <button 
              onClick={() => setIsSolutionsOpen(!isSolutionsOpen)}
              className={`text-sm transition-colors duration-150 flex items-center gap-1 ${isSolutionsOpen ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Solutions
              <svg className={`w-3 h-3 transition-transform duration-200 ${isSolutionsOpen ? 'text-gray-600 rotate-180' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown Menu — single column, no headers */}
            <div className={`absolute top-full left-0 mt-0 w-72 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-200 transform ${isSolutionsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
              <div className="p-2 flex flex-col gap-1">
                <Link href="/solutions/health-systems" onClick={() => setIsSolutionsOpen(false)} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">For Health Systems</p>
                    <p className="text-xs text-gray-500 mt-0.5">Enterprise pipelines and compliance.</p>
                  </div>
                </Link>
                <Link href="/solutions/startups" onClick={() => setIsSolutionsOpen(false)} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">For Digital Health Startups</p>
                    <p className="text-xs text-gray-500 mt-0.5">Developer-friendly APIs to launch faster.</p>
                  </div>
                </Link>
                <Link href="/solutions/payers" onClick={() => setIsSolutionsOpen(false)} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">For Payers & Insurance</p>
                    <p className="text-xs text-gray-500 mt-0.5">Claims processing and bulk data.</p>
                  </div>
                </Link>

                {/* Divider */}
                <div className="h-px bg-gray-100 my-1 mx-2" />

                <Link href="/services/mirth" onClick={() => setIsSolutionsOpen(false)} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">Mirth Connect</p>
                    <p className="text-xs text-gray-500 mt-0.5">Managed HL7 integration engine.</p>
                  </div>
                </Link>
                <Link href="/services/corepoint" onClick={() => setIsSolutionsOpen(false)} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">Corepoint</p>
                    <p className="text-xs text-gray-500 mt-0.5">Clinical message routing engine.</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {["Resources", "Company"].map((item) => (
            <Link
              key={item}
              href="#footer"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-150"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* ── Right side ── */}
        <div className="flex items-center gap-4">
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)",
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}