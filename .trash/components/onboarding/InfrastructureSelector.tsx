'use client';

import React from 'react';
import { InfrastructureModule } from '@/types/onboarding';
import { InfrastructureCard } from './InfrastructureCard';

interface InfrastructureSelectorProps {
  modules: InfrastructureModule[];
  onChange: (id: string) => void;
}

export function InfrastructureSelector({ modules, onChange }: InfrastructureSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {modules.map((module) => (
        <InfrastructureCard 
            key={module.id} 
            module={module} 
            onToggle={onChange} 
        />
      ))}
    </div>
  );
}
