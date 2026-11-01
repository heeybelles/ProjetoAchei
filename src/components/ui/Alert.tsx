import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import type { ReactNode } from 'react';

const tipos = {
  info: { cls: 'border-blue-200 bg-blue-50 text-blue-900', Icon: Info },
  sucesso: { cls: 'border-teal-200 bg-teal-50 text-teal-900', Icon: CheckCircle2 },
  aviso: { cls: 'border-amber-300 bg-amber-50 text-amber-900', Icon: AlertTriangle },
  erro: { cls: 'border-red-200 bg-red-50 text-red-900', Icon: AlertCircle },
};

export default function Alert({ tipo = 'info', titulo, children, acao }: { tipo?: keyof typeof tipos; titulo?: string; children?: ReactNode; acao?: ReactNode }) {
  const { cls, Icon } = tipos[tipo];
  return (
    <div role={tipo === 'erro' ? 'alert' : 'status'} className={`flex items-start gap-3 rounded-xl border p-3.5 text-sm ${cls}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div className="flex-1">
        {titulo && <p className="font-semibold">{titulo}</p>}
        {children && <div className={titulo ? 'mt-0.5' : ''}>{children}</div>}
      </div>
      {acao}
    </div>
  );
}
