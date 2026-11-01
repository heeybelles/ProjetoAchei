import { CalendarDays, MapPin } from 'lucide-react';
import { StatusBadge, TipoBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import CategoriaIcone from '@/components/comunicados/CategoriaIcone';
import { formatarData } from '@/lib/format';
import type { Comunicado } from '@/types/comunicado';

/** Card público: exibe apenas o resumo, sem imagem nem características privadas. */
export default function ComunicadoCard({ comunicado: c, onVer }: { comunicado: Comunicado; onVer: (c: Comunicado) => void }) {
  return (
    <article className="card flex h-full flex-col p-5 transition hover:border-brand/40">
      <div className="flex items-start gap-3.5">
        <CategoriaIcone categoria={c.categoria} />
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-snug text-navy">{c.titulo}</h3>
          <p className="mt-0.5 text-xs text-suave">{c.categoria}</p>
        </div>
        <TipoBadge tipo={c.tipo} />
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-ink">{c.resumoPublico}</p>
      <dl className="mt-4 space-y-1.5 text-xs text-suave">
        <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" aria-hidden /><dt className="sr-only">Local</dt><dd>{c.local}</dd></div>
        <div className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" aria-hidden /><dt className="sr-only">Data</dt><dd>{formatarData(c.dataOcorrido)}</dd></div>
      </dl>
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
        <StatusBadge status={c.status} />
        <Button variante="secundario" tamanho="sm" onClick={() => onVer(c)} aria-label={`Ver detalhes: ${c.titulo}`}>Ver detalhes</Button>
      </div>
    </article>
  );
}
