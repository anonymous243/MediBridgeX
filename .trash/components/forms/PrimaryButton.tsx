import React from 'react';
import { cn } from '@/lib/utils';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

export function PrimaryButton({
    children,
    className,
    ...props
}: PrimaryButtonProps) {
    return (
        <button 
            className={cn(
                "group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-full text-sm font-bold text-white transition-all hover:scale-[1.01] bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-[0.98]",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
            {children}
        </button>
    );
}