"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, Zap, Globe, Database, Network, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Logo } from "@/components/ui/logo";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const MetricCard = ({ icon: Icon, label, value, color }: { icon: LucideIcon, label: string, value: string, color: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative group overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-xl transition-all hover:bg-white/10"
  >
    <div className={cn("absolute -right-4 -top-4 h-24 w-24 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-30", color)} />
    <div className="relative flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/70 ring-1 ring-white/10 group-hover:text-white">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">{label}</p>
        <p className="text-lg font-bold text-white tabular-nums">{value}</p>
      </div>
    </div>
  </motion.div>
);

const Badge = ({ text, delay }: { text: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/60 backdrop-blur-md"
  >
    {text}
  </motion.div>
);

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900 selection:bg-blue-500/30">
      {/* Left Panel: Infrastructure Visuals (Hidden on Mobile) */}
      <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-slate-950 text-white lg:flex">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000" />

          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        {/* Floating Branding Content */}
        <div className="relative z-10 flex w-full max-w-md flex-col space-y-12 px-8">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <Logo size={40} showText={true} layout="horizontal" className="brightness-110 invert lg:invert-0" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-extrabold leading-tight tracking-tighter text-white lg:text-5xl"
            >
              Healthcare Interoperability <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Infrastructure</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-2 pt-2"
            >
              <Badge text="HL7" delay={0.3} />
              <Badge text="FHIR" delay={0.4} />
              <Badge text="DICOM" delay={0.5} />
              <Badge text="HIPAA" delay={0.6} />
            </motion.div>
          </div>

          {/* Infrastructure Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              icon={Activity}
              label="System Uptime"
              value="99.99%"
              color="bg-emerald-500"
            />
            <MetricCard
              icon={Zap}
              label="Throughput"
              value="8.2M/day"
              color="bg-pink-500"
            />
            <MetricCard
              icon={Database}
              label="Secure Records"
              value="24.1B+"
              color="bg-blue-500"
            />
            <MetricCard
              icon={Network}
              label="Nodes Active"
              value="4,821"
              color="bg-purple-500"
            />
          </div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative mt-8 group h-[320px] w-full rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden backdrop-blur-md"
          >
            <Image
              src="/images/auth/auth-hero.png"
              alt="Medical Interoperability"
              fill
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 group-hover:scale-105 transition-transform duration-[2000ms]"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Subtle Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 to-transparent" />

            {/* Live Indicator overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1.5 backdrop-blur-md border border-white/10">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Infrastructure Live</span>
              </div>
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 w-6 rounded-full border border-slate-950 bg-slate-800 flex items-center justify-center text-[8px] font-bold">
                    {i}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Subtle Bottom Glow */}
        <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-purple-600/20 rounded-full blur-[160px]" />
      </div>

      {/* Right Panel: Auth Form */}
      <div className="flex w-full flex-col lg:w-1/2">
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-8 pb-4 lg:px-24">
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>

        {/* Mobile Footer Brand */}
        <div className="lg:hidden border-t border-slate-100 px-6 py-5 flex flex-col items-center gap-3">
          <div className="opacity-60 -ml-8">
              <Logo size={20} showText={true} layout="horizontal" />
          </div>
          <p className="text-[10px] text-slate-400 tracking-wide text-center">Healthcare Interoperability Infrastructure</p>
        </div>
      </div>
    </div >
  );
};
