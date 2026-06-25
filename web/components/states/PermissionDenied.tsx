import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PrimaryButton } from '@/components/forms/PrimaryButton';
import { Card } from '@/components/ui/card';

export function PermissionDenied({ message = "You do not have the required permissions to view this module." }: { message?: string }) {
  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <Card className="max-w-md w-full p-8 border-red-100 bg-red-50/50 shadow-sm flex flex-col items-center">
        <div className="rounded-full bg-red-100 p-4 mb-6">
          <ShieldAlert className="h-8 w-8 text-red-600" />
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Access Restricted</h2>
        
        <p className="text-sm text-slate-600 mb-8 leading-relaxed">
          {message} If you believe this is an error, please contact your organization administrator or platform support.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link href="/dashboard" className="w-full">
            <PrimaryButton className="w-full bg-slate-900 hover:bg-slate-800 text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </PrimaryButton>
          </Link>
        </div>
      </Card>
      
      <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
        MediBridgeX Security Policy Enforcement
      </p>
    </div>
  );
}
