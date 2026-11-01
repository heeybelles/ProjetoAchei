import { Search, X } from 'lucide-react';

export default function SearchBar({ valor, onChange, placeholder = 'Buscar…', rotulo = 'Buscar' }: { valor: string; onChange: (v: string) => void; placeholder?: string; rotulo?: string }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-suave" aria-hidden />
      <input type="search" value={valor} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={rotulo} className="input pl-10 pr-10" />
      {valor && (
        <button onClick={() => onChange('')} aria-label="Limpar busca" className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-suave hover:bg-slate-100">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
