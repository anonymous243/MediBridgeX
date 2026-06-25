import React from 'react';

interface TextAreaFieldProps {
    label: string;
    placeholder?: string;
}

export function TextAreaField({
    label,
    placeholder,
}: TextAreaFieldProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
                {label}
            </label>

            <textarea
                placeholder={placeholder}
                rows={5}
                className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none transition focus:border-pink-500"
            />
        </div>
    );
}