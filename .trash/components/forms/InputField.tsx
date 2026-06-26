import React from 'react';

interface InputFieldProps {
    label: string;
    placeholder?: string;
    type?: string;
}

export function InputField({
    label,
    placeholder,
    type = 'text',
}: InputFieldProps) {
    return (
        <div className="space-y-2.5">
            <label className="ml-1 text-sm font-bold tracking-tight text-slate-800">
                {label}
            </label>

            <input
                type={type}
                placeholder={placeholder}
                className="h-14 w-full rounded-full border border-slate-200 bg-slate-50/50 px-6 text-sm transition-all focus:border-pink-500/50 focus:bg-white focus:shadow-[0_0_20px_rgba(236,72,153,0.1)] focus:outline-none"
            />
        </div>
    );
}