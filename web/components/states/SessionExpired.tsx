import React from 'react';
import { Clock, LogIn } from 'lucide-react';
import { PrimaryButton } from '@/components/forms/PrimaryButton';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/useAuthStore';

export function SessionExpired() {
  const { logout } = useAuthStore();

  const handleReAuth = async () => {
    // In our mock, logout will reset state. 
    // In a real app, this would redirect to /auth/login
    await logout();
    window.location.href = '/portal';
  };

  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <Card className="max-w-md w-full p-8 border-amber-100 bg-amber-50/50 shadow-sm flex flex-col items-center">
        <div className="rounded-full bg-amber-100 p-4 mb-6">
          <Clock className="h-8 w-8 text-amber-600" />
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Session Expired</h2>
        
        <p className="text-sm text-slate-600 mb-8 leading-relaxed">
          Your secure session has expired due to inactivity or a backend security event. Please authenticate again to continue.
        </p>

        <div className="flex w-full">
          <PrimaryButton onClick={handleReAuth} className="w-full bg-slate-900 hover:bg-slate-800 text-white">
            <LogIn className="mr-2 h-4 w-4" />
            Authenticate
          </PrimaryButton>
        </div>
      </Card>
      
      <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
        MediBridgeX Security Policy Enforcement
      </p>
    </div>
  );
}
