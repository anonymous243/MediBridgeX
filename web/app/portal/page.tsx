"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Database, Activity, LayoutTemplate } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function PortalPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-20 px-4">
            <div className="mb-12 flex flex-col items-center">
                <Logo size={48} />
                <h1 className="mt-6 text-3xl font-bold text-slate-900 tracking-tight">Welcome to MediBridgeX</h1>
                <p className="mt-2 text-slate-500 font-medium">Select an application to launch</p>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* FHIR Gateway */}
                <Link href="/products/fhir" className="group">
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 h-full flex flex-col">
                        <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Database className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">FHIR Engine</h2>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 flex-grow">
                            Launch the interoperability gateway to translate, validate, and route FHIR resources to external endpoints.
                        </p>
                        <div className="flex items-center text-sm font-bold text-blue-600 group-hover:text-blue-700">
                            Launch App <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

                {/* HL7 Processor (Coming Soon / Placeholder) */}
                <Link href="/products/hl7" className="group">
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:purple-200 transition-all duration-300 h-full flex flex-col">
                        <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <Activity className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">HL7 Processor</h2>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 flex-grow">
                            Access the HL7 v2.x pipeline for legacy message parsing and real-time conversion monitoring.
                        </p>
                        <div className="flex items-center text-sm font-bold text-purple-600 group-hover:text-purple-700">
                            Launch App <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

                {/* HMS System */}
                <Link href="/products/hms" className="group">
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:teal-200 transition-all duration-300 h-full flex flex-col">
                        <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                            <LayoutTemplate className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">HMS System</h2>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 flex-grow">
                            Open the Hospital Management System for administrative controls, bed management, and staff scheduling.
                        </p>
                        <div className="flex items-center text-sm font-bold text-teal-600 group-hover:text-teal-700">
                            Launch App <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

            </div>
        </div>
    );
}
