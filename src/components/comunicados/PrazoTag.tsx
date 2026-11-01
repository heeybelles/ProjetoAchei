'use client';

import { Clock } from 'lucide-react';
import { descreverPrazo } from '@/lib/business-days';
import { useData } from '@/contexts/DataContext';
import type { Comunicado } from '@/types/comunicado';

/** Mostra o prazo de entrega (3 dias úteis) enquanto o objeto aguarda entrega. */
export default function PrazoTag({ comunicado }: { comunicado: Comunicado }) {
  const { feriados } = useData();
  if (comunicado.tipo !== 'ENCONTRADO' || !comunicado.prazoEntrega) return null;
  if (!['AGUARDANDO_ENTREGA', 'ENTREGA_ATRASADA'].includes(comunicado.status)) return null;
  const p = descreverPrazo(new Date(), new Date(comunicado.prazoEntrega), feriados.map((f) => f.data));
  const cor = p.vencido ? 'bg-red-50 text-red-800' : p.urgente ? 'bg-amber-50 text-amber-900' : 'bg-slate-100 text-slate-700';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${cor}`}>
      <Clock className="h-3.5 w-3.5" aria-hidden />{p.texto}
    </span>
  );
}
