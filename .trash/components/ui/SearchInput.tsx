import { Search } from 'lucide-react';

interface SearchInputProps {
    placeholder: string;
}

export function SearchInput({
    placeholder,
}: SearchInputProps) {
    return (
        <div className="flex h-14 w-full items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-sm">
            <Search className="h-5 w-5 text-slate-400" />

            <input
                type="text"
                placeholder={placeholder}
                className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
        </div>
    );
}