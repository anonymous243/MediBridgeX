import React from 'react';
import { Metadata } from 'next';
import { CodeSnippetTerminal } from '@/components/marketing/CodeSnippetTerminal';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata: Metadata = {
  title: 'Authentication | MediBridgeX Docs',
  description: 'OAuth 2.0 Client Credentials flow and JWT handling for the MediBridgeX API.',
};

export default function AuthenticationPage() {
  const jwtPayload = `{
  "iss": "https://auth.medibridgex.com",
  "sub": "client_8f92a4bc",
  "aud": "api.medibridgex.com",
  "exp": 1698403200,
  "iat": 1698399600,
  "scopes": ["fhir:read", "fhir:write", "audit:read"]
}`;

  return (
    <div className="max-w-3xl">
      <FadeIn delay={0.1}>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Authentication</h1>
        <p className="text-xl text-gray-600 leading-relaxed mb-12">
          MediBridgeX secures all endpoints using the OAuth 2.0 Client Credentials grant type. This server-to-server flow ensures that integration layers (like EHRs or custom middleware) can securely request short-lived JSON Web Tokens (JWTs) without user intervention.
        </p>

        <div className="prose prose-purple max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The JWT Lifecycle</h2>
          <p className="text-gray-600 mb-6">
            Tokens are cryptographically signed using RS256 and have a maximum lifetime of 1 hour (3600 seconds). We strongly advise implementing token caching and proactive refresh logic in your API clients to minimize latency associated with the token endpoint.
          </p>

          <div className="mb-12">
            <CodeSnippetTerminal 
              filename="Decoded JWT Payload" 
              code={jwtPayload} 
              language="json" 
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Scope Management</h2>
          <p className="text-gray-600 mb-6">
            Access is heavily siloed based on scopes. If your token lacks the necessary scope for an operation (e.g., attempting a POST to <code>/Patient</code> with only <code>fhir:read</code>), the gateway will immediately terminate the request with a <code>403 Forbidden</code> and log an access violation in your audit trail.
          </p>

          <div className="bg-red-50 p-6 rounded-xl border border-red-100 mt-8">
            <h3 className="font-bold text-red-900 mb-2">Security Notice</h3>
            <p className="text-red-800 text-sm">
              Never commit your <code>client_secret</code> to version control. If a secret is compromised, rotate it immediately in the Developer Dashboard. Old tokens signed by the revoked secret are instantly invalidated via our distributed cache.
            </p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
