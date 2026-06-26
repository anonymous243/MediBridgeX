"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 sm:px-12 max-w-4xl mx-auto text-center">
        <div className="inline-block px-3 py-1 mb-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-widest uppercase border border-slate-200">
          Careers
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          Join the mission to unify healthcare data.
        </h1>
        
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-16 leading-relaxed">
          At MediBridgeX, we're building the infrastructure that powers modern healthcare. We are a team of clinical engineers, security experts, and designers obsessed with interoperability.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-10 max-w-2xl mx-auto shadow-sm">
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-slate-900 mb-3">No Open Roles Right Now</h2>
          
          <p className="text-slate-600 mb-8 leading-relaxed text-sm">
            We are currently fully staffed and heads-down building our core platform. However, we're always excited to connect with brilliant engineers, security researchers, and healthcare integration specialists.
          </p>
          
          <a 
            href="https://www.linkedin.com/company/medibridgex/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-w-[240px] gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all shadow-md"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Send us your resume anyway
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
