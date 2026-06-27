'use client';

import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationBadgeProps {
    score: number;
    className?: string;
}

export function ValidationBadge({ score, className }: ValidationBadgeProps) {
    let colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-100';
    let Icon = CheckCircle2;

    if (score < 50) {
        colorClass = 'bg-rose-50 text-rose-700 border-rose-100';
        Icon = AlertCircle;
    } else if (score < 90) {
        colorClass = 'bg-amber-50 text-amber-700 border-amber-100';
        Icon = AlertTriangle;
    }

    return (
        <div className={cn(
            "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest",
            colorClass,
            className
        )}>
            <Icon className="h-3 w-3" />
            {score}% Valid
        </div>
    );
}
