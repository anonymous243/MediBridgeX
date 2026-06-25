interface SectionHeaderProps {
  title: string;
  description: string;
}

export function SectionHeader({
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div>
      <h1 className="text-[40px] font-black tracking-[-0.05em] text-slate-950">
        {title}
      </h1>

      <p className="mt-2 text-lg text-slate-500">
        {description}
      </p>
    </div>
  );
}