'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEP_LABELS = ['Org Setup', 'Infrastructure', 'Compliance', 'Team', 'Provision'];

interface StepperProps {
  currentStep: number;
  totalSteps?: number;
}

export function Stepper({ currentStep, totalSteps = 5 }: StepperProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-2 w-full">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <React.Fragment key={stepNum}>
            <div className="flex flex-col items-center gap-1">
              <motion.div
                animate={{
                  backgroundColor: isDone
                    ? '#10b981'
                    : isActive
                    ? '#2563eb'
                    : '#e2e8f0',
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs font-black transition-all',
                  isDone
                    ? 'text-white'
                    : isActive
                    ? 'text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-400'
                )}
              >
                {isDone ? <CheckCircle2 className="h-4 w-4" /> : stepNum}
              </motion.div>
              <span
                className={cn(
                  'hidden lg:block text-[9px] font-black uppercase tracking-widest whitespace-nowrap',
                  isActive ? 'text-blue-600' : isDone ? 'text-emerald-600' : 'text-slate-400'
                )}
              >
                {STEP_LABELS[i]}
              </span>
            </div>
            {stepNum < totalSteps && (
              <div className="flex-1 relative h-0.5 bg-slate-200 overflow-hidden rounded-full">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-blue-500 rounded-full"
                  animate={{ width: isDone ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
