interface StatusBadgeProps {
    status: string;
    variant?:
    | 'success'
    | 'warning'
    | 'error'
    | 'info';
}

const variants = {
    success:
        'bg-emerald-50 border-emerald-100 text-emerald-600',

    warning:
        'bg-amber-50 border-amber-100 text-amber-600',

    error:
        'bg-red-50 border-red-100 text-red-600',

    info:
        'bg-blue-50 border-blue-100 text-blue-600',
};

export function StatusBadge({
    status,
    variant = 'info',
}: StatusBadgeProps) {
    return (
        <div
            className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-bold ${variants[variant]}`}
        >
            {status}
        </div>
    );
}