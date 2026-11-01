import type { ReactNode } from 'react';
import { STATUS_LABEL, TIPO_LABEL, type StatusComunicado, type TipoComunicado } from '@/types/comunicado';

const cores = {
  azul: 'bg-blue-50 text-blue-800 ring-blue-200',
  agua: 'bg-teal-50 text-teal-800 ring-teal-200',
  amarelo: 'bg-amber-50 text-amber-900 ring-amber-300',
  vermelho: 'bg-red-50 text-red-800 ring-red-200',
  cinza: 'bg-slate-100 text-slate-700 ring-slate-200',
  roxo: 'bg-indigo-50 text-indigo-800 ring-indigo-200',
  verde: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
};
export type CorBadge = keyof typeof cores;

export function Badge({ cor = 'cinza', children }: { cor?: CorBadge; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${cores[cor]}`}>
      {children}
    </span>
  );
}

const corStatus: Record<StatusComunicado, CorBadge> = {
  PUBLICADO: 'azul',
  AGUARDANDO_ENTREGA: 'amarelo',
  ENTREGA_ATRASADA: 'vermelho',
  RECEBIDO_BIBLIOTECA: 'agua',
  DISPONIVEL_RETIRADA: 'verde',
  EM_PROCESSO_DEVOLUCAO: 'roxo',
  DEVOLVIDO: 'verde',
  ENCERRADO: 'cinza',
};

export const StatusBadge = ({ status }: { status: StatusComunicado }) => (
  <Badge cor={corStatus[status]}>{STATUS_LABEL[status]}</Badge>
);

export const TipoBadge = ({ tipo }: { tipo: TipoComunicado }) => (
  <Badge cor={tipo === 'PERDIDO' ? 'vermelho' : 'agua'}>{TIPO_LABEL[tipo]}</Badge>
);
