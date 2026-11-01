import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ pagina, total, onChange }: { pagina: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  const btn = 'flex h-10 min-w-[40px] items-center justify-center rounded-lg px-2 text-sm font-semibold transition disabled:opacity-40';
  return (
    <nav aria-label="Paginação" className="mt-6 flex items-center justify-center gap-1.5">
      <button className={`${btn} border border-slate-300 bg-white hover:bg-slate-50`} disabled={pagina === 1} onClick={() => onChange(pagina - 1)} aria-label="Página anterior"><ChevronLeft className="h-4 w-4" /></button>
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button key={p} onClick={() => onChange(p)} aria-current={p === pagina ? 'page' : undefined}
          className={`${btn} ${p === pagina ? 'bg-navy text-white' : 'border border-slate-300 bg-white text-ink hover:bg-slate-50'}`}>{p}</button>
      ))}
      <button className={`${btn} border border-slate-300 bg-white hover:bg-slate-50`} disabled={pagina === total} onClick={() => onChange(pagina + 1)} aria-label="Próxima página"><ChevronRight className="h-4 w-4" /></button>
    </nav>
  );
}
