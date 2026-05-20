import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, LucideIcon } from 'lucide-react';

export interface Column<T> {
    key: keyof T | string;
    header: string;
    render?: (
        value: any,
        row: T
    ) => React.ReactNode;
    className?: string;
}

export interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    onRowClick?: (row: T) => void;
    emptyState?: {
        icon: LucideIcon;
        title: string;
        description: string;
    };
    emptyMessage?: string;
    className?: string;
}

export function DataTable<T extends any>({
    columns,
    data,
    isLoading,
    onRowClick,
    emptyState,
    emptyMessage = 'No data available',
    className,
}: DataTableProps<T>) {
    const gridStyle = {
        gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
    };

    return (
        <div className={cn(
            "overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.04)]",
            className
        )}>
            {/* HEADER */}
            <div 
                className="hidden border-b border-slate-100 bg-slate-50 lg:grid"
                style={gridStyle}
            >
                {columns.map((column, idx) => (
                    <div
                        key={String(column.key) + idx}
                        className={cn(
                            "px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400",
                            column.className
                        )}
                    >
                        {column.header}
                    </div>
                ))}
            </div>

            {/* ROWS */}
            <div className="divide-y divide-slate-100">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <p className="mt-4 text-xs font-black uppercase tracking-widest text-slate-400">Syncing Ledger...</p>
                    </div>
                ) : data.length > 0 ? (
                    data.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            onClick={() => onRowClick?.(row)}
                            className={cn(
                                "grid gap-4 px-8 py-6 transition hover:bg-slate-50 lg:items-center",
                                onRowClick && "cursor-pointer",
                            )}
                            style={gridStyle}
                        >
                            {columns.map((column, colIdx) => {
                                const value = (row as any)[column.key];

                                return (
                                    <div key={String(column.key) + colIdx} className={column.className}>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 lg:hidden mb-1">
                                            {column.header}
                                        </div>

                                        <div className="text-sm font-semibold text-slate-700">
                                            {column.render
                                                ? column.render(
                                                    value,
                                                    row
                                                )
                                                : String(value ?? '')}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-10">
                        {emptyState ? (
                            <>
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-50 text-slate-400">
                                    <emptyState.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-black tracking-tight text-slate-900">{emptyState.title}</h3>
                                <p className="mt-2 max-w-[300px] text-sm font-medium text-slate-500 leading-relaxed">
                                    {emptyState.description}
                                </p>
                            </>
                        ) : (
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                                {emptyMessage}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}