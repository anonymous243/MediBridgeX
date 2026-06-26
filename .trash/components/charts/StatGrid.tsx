interface StatItem {
  label: string;
  value: string;
}

interface StatGridProps {
  items: StatItem[];
}

export function StatGrid({
  items,
}: StatGridProps) {
  return (
    <div className="grid grid-cols-2 gap-5">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <div className="text-sm text-slate-400">
            {item.label}
          </div>

          <div className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}