export function SkeletonTable() {
    return (
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
            {/* HEADER */}
            <div className="grid grid-cols-5 border-b border-slate-100 bg-slate-50">
                {[1, 2, 3, 4, 5].map((item) => (
                    <div
                        key={item}
                        className="px-8 py-5"
                    >
                        <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                    </div>
                ))}
            </div>

            {/* ROWS */}
            {[1, 2, 3, 4].map((row) => (
                <div
                    key={row}
                    className="grid grid-cols-5 border-b border-slate-100 px-8 py-6"
                >
                    {[1, 2, 3, 4, 5].map((cell) => (
                        <div key={cell}>
                            <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}