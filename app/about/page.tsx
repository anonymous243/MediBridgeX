import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 sm:px-12 max-w-4xl mx-auto text-center">
        <div className="inline-block px-3 py-1 mb-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-widest uppercase border border-slate-200">
          About Us
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          Building the future of healthcare interoperability.
        </h1>
        
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-16 leading-relaxed">
          MediBridgeX was founded on a simple premise: healthcare data should be secure, accessible, and standardized. We're on a mission to dismantle data silos and empower providers with seamless, compliant FHIR integrations.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-10 max-w-3xl mx-auto shadow-sm text-left">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            By building the most developer-friendly and scalable interoperability engines, we aim to accelerate digital health innovation. Whether you are a rapidly growing digital health startup or a major hospital system, we provide the enterprise-grade infrastructure so you can focus entirely on what matters most—patient care.
          </p>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Story</h2>
          <p className="text-slate-600 leading-relaxed">
            Our team brings together decades of expertise at the intersection of healthcare, enterprise security, and modern distributed systems. Having witnessed firsthand the friction caused by fragmented medical records and legacy protocols, we built MediBridgeX to serve as the missing connectivity layer. Today, we are dedicated to setting the standard for how health data moves across the globe.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
