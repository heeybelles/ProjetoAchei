import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export default function EmptyState({ icone: Icon, titulo, texto, acao }: { icone: LucideIcon; titulo: string; texto?: string; acao?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand"><Icon className="h-7 w-7" aria-hidden /></span>
      <h3 className="mt-4 text-base font-bold text-navy">{titulo}</h3>
      {texto && <p className="mt-1 max-w-sm text-sm text-suave">{texto}</p>}
      {acao && <div className="mt-5">{acao}</div>}
    </div>
  );
}
