'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { SectionCard } from '@/components/dashboard/SectionCard';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry
    console.error('Dashboard Runtime Error:', error);
  }, [error]);

  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center p-4">
      <SectionCard className="flex max-w-lg flex-col items-center p-8 text-center shadow-xl">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <AlertCircle className="h-8 w-8" />
        </div>
        
        <h2 className="mb-2 text-2xl font-black tracking-tight text-slate-900">
          Dashboard Component Failed
        </h2>
        
        <p className="mb-8 text-sm text-slate-500">
          We encountered an unexpected error while rendering this section of the dashboard. The rest of the application should still be fully functional.
        </p>

        <div className="mb-8 w-full rounded-lg bg-slate-100 p-4 text-left font-mono text-[10px] text-slate-700">
          <span className="font-bold text-rose-600">Error:</span> {error.message || 'Unknown render error'}
        </div>

        <button
          onClick={() => reset()}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-md"
        >
          <RefreshCcw className="h-4 w-4" />
          Attempt Recovery
        </button>
      </SectionCard>
    </div>
  );
}
