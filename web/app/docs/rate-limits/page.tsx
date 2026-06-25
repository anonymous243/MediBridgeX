import React from 'react';
import { Metadata } from 'next';
import { CodeSnippetTerminal } from '@/components/marketing/CodeSnippetTerminal';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata: Metadata = {
  title: 'Rate Limits | MediBridgeX Docs',
  description: 'API rate limiting algorithms, headers, and threshold configuration.',
};

export default function RateLimitsPage() {
  const headers = `HTTP/1.1 200 OK
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 998
X-RateLimit-Reset: 1698403200
Retry-After: 0`;

  return (
    <div className="max-w-3xl">
      <FadeIn delay={0.1}>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Rate Limiting</h1>
        <p className="text-xl text-gray-600 leading-relaxed mb-12">
          To guarantee high availability and protect against volumetric attacks, MediBridgeX implements a strict distributed leaky bucket algorithm across our Edge infrastructure.
        </p>

        <div className="prose prose-purple max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Rate Limit Headers</h2>
          <p className="text-gray-600 mb-6">
            Every API response includes standard rate limit headers. Monitoring these headers allows your integration to implement intelligent exponential backoff before hitting the threshold.
          </p>

          <div className="mb-12">
            <CodeSnippetTerminal 
              filename="Response Headers" 
              code={headers} 
              language="bash" 
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">HTTP 429 Too Many Requests</h2>
          <p className="text-gray-600 mb-6">
            If you exceed your allotted quota, the gateway drops connections at the Edge and returns a <code>429 Too Many Requests</code> status. The response will explicitly include a <code>Retry-After</code> header denoting the exact number of seconds your client must halt execution.
          </p>

          <div className="overflow-x-auto mt-8">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 uppercase tracking-wider text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Tier</th>
                  <th className="px-6 py-4 font-semibold">Requests per minute</th>
                  <th className="px-6 py-4 font-semibold">Burst Allowance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Developer Sandbox</td>
                  <td className="px-6 py-4 text-gray-600">60</td>
                  <td className="px-6 py-4 text-gray-600">10</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Production Standard</td>
                  <td className="px-6 py-4 text-gray-600">1,000</td>
                  <td className="px-6 py-4 text-gray-600">250</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Enterprise Dedicated</td>
                  <td className="px-6 py-4 text-gray-600">Custom (SLA backed)</td>
                  <td className="px-6 py-4 text-gray-600">Custom</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
