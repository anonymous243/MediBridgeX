'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Key, 
  Webhook, 
  Activity, 
  Code2, 
  BookOpen, 
  Plus,
  Zap,
  Shield,
  Layers,
  ChevronRight,
  Loader2
} from 'lucide-react';

import { PageContainer } from '@/components/dashboard/PageContainer';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { ApiKeyCard } from '@/components/developers/ApiKeyCard';
import { WebhookTable } from '@/components/developers/WebhookTable';
import { RequestViewer } from '@/components/developers/RequestViewer';
import { ApiPlayground } from '@/components/developers/ApiPlayground';
import { UsageChart } from '@/components/developers/UsageChart';
import { CodeBlock } from '@/components/developers/CodeBlock';
import { useDeveloperStore } from '@/stores/useDeveloperStore';

import { ProtectedRoute } from '@/components/dashboard/ProtectedRoute';
import { PermissionGuard } from '@/components/dashboard/PermissionGuard';

const SECTIONS = [
  { id: 'metrics', name: 'Usage Metrics', icon: Activity },
  { id: 'keys', name: 'API Keys', icon: Key },
  { id: 'webhooks', name: 'Webhooks', icon: Webhook },
  { id: 'logs', name: 'Request Logs', icon: Terminal },
  { id: 'playground', name: 'API Playground', icon: Zap },
  { id: 'docs', name: 'Documentation', icon: BookOpen },
];

export default function DevelopersPage() {
  const [activeSection, setActiveSection] = useState('metrics');
  const { 
    apiKeys, 
    webhooks, 
    requestLogs, 
    usageMetrics, 
    isLoading, 
    initialize,
    createKey
  } = useDeveloperStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      
      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ProtectedRoute requiredPermissions={['access:developer_tools']}>
      <PageContainer>
        <div className="flex gap-12">
          {/* STICKY NAV */}
          <aside className="sticky top-32 hidden h-fit w-64 flex-col gap-1 lg:flex">
            <p className="mb-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Developer Workspace</p>
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all",
                  activeSection === section.id 
                    ? 'bg-blue-50 text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <section.icon className="h-4 w-4" />
                {section.name}
                {activeSection === section.id && (
                  <motion.div layoutId="active-nav" className="ml-auto h-1 w-1 rounded-full bg-blue-600" />
                )}
              </button>
            ))}
            
            <div className="mt-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-xl">
               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white mb-4">
                  <Shield className="h-5 w-5" />
               </div>
               <p className="text-xs font-black uppercase tracking-widest text-white/50">Developer Tier</p>
               <h4 className="mt-1 text-lg font-bold">Enterprise</h4>
               <p className="mt-2 text-xs font-medium text-white/60 leading-relaxed">You have unlimited API access and priority support.</p>
               <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2 text-xs font-black uppercase tracking-widest text-slate-950 transition hover:bg-white/90">
                  View Limits
               </button>
            </div>
          </aside>

          {/* CONTENT */}
          <div className="flex-1 space-y-24 pb-32">
            {/* HEADER */}
            <section>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-black tracking-tight text-slate-950 flex items-center gap-4"
                  >
                    Developer Platform
                    {isLoading && <Loader2 className="h-6 w-6 animate-spin text-blue-600" />}
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-2 text-lg font-medium text-slate-500"
                  >
                    Manage API keys, webhooks, and monitor real-time interoperability traffic.
                  </motion.p>
                </div>
                <div className="flex gap-3">
                  <button className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-600 transition hover:bg-slate-50">
                    <Code2 className="h-4 w-4" /> View API Docs
                  </button>
                  <PermissionGuard requiredPermissions={['manage:api_keys']}>
                    <button 
                      onClick={() => createKey('New Production Key', 'live', ['*'])}
                      className="flex h-12 items-center gap-2 rounded-2xl bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" /> Create API Key
                    </button>
                  </PermissionGuard>
                </div>
              </div>
            </section>

            {/* USAGE METRICS */}
            <section id="metrics" className="scroll-mt-32">
              <SectionHeader title="System Performance" description="Real-time API throughput and error rates across all regions." />
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                <UsageChart data={usageMetrics} title="API Requests" metric="requests" />
                <UsageChart data={usageMetrics} title="Error Rate" metric="errors" color="#ef4444" />
                <UsageChart data={usageMetrics} title="P95 Latency" metric="latency" color="#8b5cf6" />
              </div>
            </section>

            {/* API KEYS */}
            <section id="keys" className="scroll-mt-32">
              <div className="flex items-center justify-between">
                 <SectionHeader title="API Credentials" description="Secure access keys for your applications and services." />
                 <PermissionGuard requiredPermissions={['manage:api_keys']}>
                   <button className="text-xs font-black uppercase tracking-widest text-blue-600 hover:underline">Revoke All Keys</button>
                 </PermissionGuard>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
                {apiKeys.map(key => (
                  <ApiKeyCard key={key.id} apiKey={key} />
                ))}
                <PermissionGuard requiredPermissions={['manage:api_keys']}>
                  <button 
                    onClick={() => createKey('New Sandbox Key', 'test', ['patient.read'])}
                    className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 p-8 transition-all hover:border-blue-500 hover:bg-blue-50 group"
                  >
                     <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Plus className="h-6 w-6" />
                     </div>
                     <p className="mt-4 font-bold text-slate-500 group-hover:text-blue-600">Create a new API Key</p>
                     <p className="mt-1 text-xs text-slate-400">Generate a secure key for a new environment</p>
                  </button>
                </PermissionGuard>
              </div>
            </section>

            {/* WEBHOOKS */}
            <section id="webhooks" className="scroll-mt-32">
              <div className="flex items-center justify-between">
                  <SectionHeader title="Webhook Endpoints" description="Receive real-time notifications when events occur in MediBridgeX." />
                  <PermissionGuard requiredPermissions={['manage:webhooks']}>
                    <button className="flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-colors">
                        Add Endpoint
                    </button>
                  </PermissionGuard>
              </div>
              <div className="mt-8">
                <WebhookTable endpoints={webhooks} />
              </div>
            </section>

            {/* REQUEST LOGS */}
            <section id="logs" className="scroll-mt-32">
              <SectionHeader title="Observability Stream" description="Live inspection of every API request passing through the infrastructure." />
              <div className="mt-8">
                <RequestViewer logs={requestLogs} />
              </div>
            </section>

            {/* API PLAYGROUND */}
            <section id="playground" className="scroll-mt-32">
              <SectionHeader title="Interactive Sandbox" description="Test FHIR resources and API endpoints directly from your browser." />
              <div className="mt-8">
                <ApiPlayground />
              </div>
            </section>

            {/* DOCUMENTATION */}
            <section id="docs" className="scroll-mt-32 pb-12">
              <SectionHeader title="Developer Resources" description="Quickstarts and SDKs to get you integrated in minutes." />
              <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                   <div className="rounded-3xl bg-slate-50 p-8 border border-slate-100">
                      <h4 className="text-xl font-bold text-slate-900">Authentication</h4>
                      <p className="mt-2 text-slate-500 text-sm leading-relaxed">All API requests must be authenticated using your Bearer token in the Authorization header.</p>
                      <div className="mt-6">
                          <CodeBlock 
                            language="bash"
                            filename="Auth Header"
                            code={`Authorization: Bearer YOUR_API_KEY`}
                          />
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      {[
                          { name: 'TypeScript SDK', icon: Code2, size: '4.2MB' },
                          { name: 'Python SDK', icon: Layers, size: '2.1MB' },
                          { name: 'Java SDK', icon: Database, size: '8.4MB' },
                          { name: 'Go SDK', icon: Terminal, size: '1.2MB' },
                      ].map(sdk => (
                          <button key={sdk.name} className="flex flex-col items-start rounded-2xl border border-slate-200 p-4 transition-all hover:border-blue-500 hover:shadow-md group text-left">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 mb-4 transition-colors">
                                  <sdk.icon className="h-5 w-5" />
                              </div>
                              <span className="text-sm font-bold text-slate-900">{sdk.name}</span>
                              <span className="mt-1 text-[10px] font-bold text-slate-400 uppercase">{sdk.size} • v1.4.2</span>
                          </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-4">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Quickstart Example (TypeScript)</p>
                   <CodeBlock 
                      language="typescript"
                      filename="index.ts"
                      code={`import { MediBridgeX } from '@medibridgex/sdk';

const mbx = new MediBridgeX({
  apiKey: process.env.MBX_API_KEY,
  environment: 'production'
});

// Fetch a patient record
const patient = await mbx.fhir.patients.retrieve('pat_9281');

console.log(\`Patient Name: \${patient.name[0].family}\`);`}
                   />
                   
                   <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
                      <div className="flex items-center gap-3 text-blue-600 mb-3">
                          <BookOpen className="h-5 w-5" />
                          <span className="text-sm font-bold">Deep Dive into FHIR</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                          Learn how to leverage our clinical data models to build powerful healthcare applications.
                      </p>
                      <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:gap-3 transition-all">
                          Read Full Docs <ChevronRight className="h-4 w-4" />
                      </button>
                   </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

const Database = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5V19A9 3 0 0 0 21 19V5" />
    <path d="M3 12A9 3 0 0 0 21 12" />
  </svg>
);
