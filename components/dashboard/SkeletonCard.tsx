export function SkeletonCard() {
    return (
        <div className="animate-pulse rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between">
                <div className="w-full">
                    <div className="h-4 w-28 rounded bg-slate-200" />

                    <div className="mt-6 h-10 w-32 rounded bg-slate-200" />
                </div>

                <div className="h-14 w-14 rounded-2xl bg-slate-200" />
            </div>
        </div>
    );
}