'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { apiClient } from '@/lib/api-client';
import { ShieldCheckIcon, DocumentTextIcon, UserIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { FadeIn } from '@/components/animations/FadeIn';

interface AuditUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  timestamp: string;
  signature: string;
  user: AuditUser | null;
}

export function AuditLogTable() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<AuditLog[]>('/api/v1/audit');
      setLogs(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch audit logs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case 'CREATE':
        return 'text-green-700 bg-green-50 ring-green-600/20 dark:text-green-400 dark:bg-green-500/10 dark:ring-green-500/20';
      case 'READ':
        return 'text-blue-700 bg-blue-50 ring-blue-600/20 dark:text-blue-400 dark:bg-blue-500/10 dark:ring-blue-500/20';
      case 'UPDATE':
        return 'text-yellow-700 bg-yellow-50 ring-yellow-600/20 dark:text-yellow-400 dark:bg-yellow-500/10 dark:ring-yellow-500/20';
      case 'DELETE':
        return 'text-red-700 bg-red-50 ring-red-600/20 dark:text-red-400 dark:bg-red-500/10 dark:ring-red-500/20';
      default:
        return 'text-gray-600 bg-gray-50 ring-gray-500/10 dark:text-gray-400 dark:bg-gray-500/10 dark:ring-gray-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <ArrowPathIcon className="w-6 h-6 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>Error: {error}</p>
        <button onClick={fetchLogs} className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100">
          Retry
        </button>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <ShieldCheckIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <p>No audit logs found.</p>
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp (UTC)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resource Target
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Signature Hash
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss.SSS')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {log.user?.email || log.user_id}
                      </div>
                      <div className="text-xs text-gray-500">
                        {log.user?.role || 'Unknown Role'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getActionColor(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <DocumentTextIcon className="w-4 h-4 text-gray-400" />
                    <span>{log.resource_type} <span className="text-gray-400">#</span> {log.resource_id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-mono text-xs text-gray-400 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded border border-gray-100 dark:border-gray-800 truncate max-w-[150px]" title={log.signature}>
                    {log.signature.substring(0, 16)}...
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FadeIn>
  );
}
