import { Bell, CheckCheck, Clock, FileText, Link2, PackageCheck, type LucideIcon } from 'lucide-react';
import { tempoRelativo, formatarDataHora } from '@/lib/format';
import type { Notificacao, TipoNotificacao } from '@/types/notificacao';

const icones: Record<TipoNotificacao, { Icon: LucideIcon; cls: string }> = {
  comunicado: { Icon: FileText, cls: 'bg-brand-soft text-brand' },
  prazo: { Icon: Clock, cls: 'bg-sol-soft text-sol-dark' },
  recebimento: { Icon: PackageCheck, cls: 'bg-agua-soft text-agua-dark' },
  correspondencia: { Icon: Link2, cls: 'bg-indigo-50 text-indigo-700' },
  solicitacao: { Icon: Bell, cls: 'bg-slate-100 text-navy' },
};

export default function NotificationItem({ n, onLer }: { n: Notificacao; onLer: (id: string) => void }) {
  const { Icon, cls } = icones[n.tipo];
  return (
    <li className={`card flex items-start gap-4 p-4 ${n.lida ? '' : 'border-brand/30 bg-brand-soft/30'}`}>
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${cls}`}><Icon className="h-5 w-5" aria-hidden /></span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-bold text-navy">{n.titulo}</h3>
          {!n.lida && <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white">Nova</span>}
        </div>
        <p className="mt-1 text-sm text-ink">{n.mensagem}</p>
        <p className="mt-1.5 text-xs text-suave"><time dateTime={n.criadoEm}>{formatarDataHora(n.criadoEm)}</time> · {tempoRelativo(n.criadoEm)}</p>
      </div>
      {!n.lida && (
        <button onClick={() => onLer(n.id)} className="flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-brand hover:bg-brand-soft"><CheckCheck className="h-4 w-4" aria-hidden /><span className="hidden sm:inline">Marcar como lida</span><span className="sm:hidden">Lida</span></button>
      )}
    </li>
  );
}
