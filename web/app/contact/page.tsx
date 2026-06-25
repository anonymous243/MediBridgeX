"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function ContactSalesPage() {
  return (
    <main className="min-h-screen bg-[#fafcff]">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 sm:px-12 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left Side: Copy */}
        <div className="flex flex-col justify-center">
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-blue-100/50 text-blue-700 text-xs font-bold tracking-widest uppercase border border-blue-200">
            Enterprise Sales
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Let's build the future of healthcare interoperability.
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Whether you need to securely route HL7 messages, deploy a unified FHIR gateway, or build custom integration pipelines—our clinical engineering team is ready to help you scale securely.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Enterprise Security</h3>
                <p className="text-sm text-slate-500 mt-1">SOC 2 Type II and HIPAA compliant infrastructure built for zero-trust.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Rapid Deployment</h3>
                <p className="text-sm text-slate-500 mt-1">Connect legacy EHRs in days, not months, with our pre-built connectors.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10 relative overflow-hidden">
          {/* Subtle gradient background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Book a Demo</h2>
            <p className="text-sm text-slate-500 mb-8">Fill out the form below and our clinical implementation team will reach out shortly.</p>
            
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()} suppressHydrationWarning>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">First Name</label>
                  <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" placeholder="John" suppressHydrationWarning />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Last Name</label>
                  <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" placeholder="Doe" suppressHydrationWarning />
                </div>
              </div>
              
              <div className="space-y-1.5" suppressHydrationWarning>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Work Email</label>
                <input type="email" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" placeholder="john@hospital.org" suppressHydrationWarning />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Company / Organization</label>
                <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" placeholder="Acme Health" suppressHydrationWarning />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">How can we help?</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none" placeholder="Tell us about your interoperability challenges..."></textarea>
              </div>

              <button className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm shadow-md transition-all">
                Submit Request
              </button>
              
              <p className="text-[10px] text-center text-slate-400 mt-4">
                By submitting this form, you agree to our <a href="/privacy" className="underline hover:text-slate-600">Privacy Policy</a>.
              </p>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
