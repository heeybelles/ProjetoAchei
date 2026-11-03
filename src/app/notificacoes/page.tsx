'use client';

import { useMemo, useState } from 'react';
import { BellOff, CheckCheck } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import ComunicadoDetalhes from '@/components/comunicados/ComunicadoDetalhes';
import NotificationItem from '@/components/notifications/NotificationItem';
import EmptyState from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { marcarComoLida, marcarTodasComoLidas } from '@/services/notificacao.service';
import type { Comunicado } from '@/types/comunicado';
import { TIPO_NOTIFICACAO_LABEL, type TipoNotificacao } from '@/types/notificacao';

type Filtro = 'todas' | 'nao-lidas' | TipoNotificacao;

function Conteudo() {
  const { usuario } = useAuth();
  const { notificacoes, comunicados, atualizar } = useData();
  const toast = useToast();
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [comunicadoAberto, setComunicadoAberto] = useState<Comunicado | null>(null);

  const minhas = useMemo(() => notificacoes.filter((n) => n.usuarioId === usuario?.id).sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)), [notificacoes, usuario]);
  const naoLidas = minhas.filter((n) => !n.lida).length;
  const lista = minhas.filter((n) => filtro === 'todas' || (filtro === 'nao-lidas' ? !n.lida : n.tipo === filtro));
  const filtros: { id: Filtro; rotulo: string }[] = [
    { id: 'todas', rotulo: 'Todas' }, { id: 'nao-lidas', rotulo: `Não lidas (${naoLidas})` },
    ...(Object.keys(TIPO_NOTIFICACAO_LABEL) as TipoNotificacao[]).map((t) => ({ id: t as Filtro, rotulo: TIPO_NOTIFICACAO_LABEL[t] })),
  ];

  return (
    <div>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Notificações</h1>
          <p className="mt-1 text-suave">{naoLidas > 0 ? `Você tem ${naoLidas} ${naoLidas === 1 ? 'aviso não lido' : 'avisos não lidos'}.` : 'Você está em dia com seus avisos.'}</p>
        </div>
        <Button variante="secundario" icone={<CheckCheck className="h-4 w-4" />} disabled={naoLidas === 0}
          onClick={() => { if (usuario) { marcarTodasComoLidas(usuario.id); atualizar(); toast('sucesso', 'Todas as notificações foram marcadas como lidas.'); } }}>Marcar todas como lidas</Button>
      </header>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Filtrar notificações">
        {filtros.map((f) => (
          <button key={f.id} role="tab" aria-selected={filtro === f.id} onClick={() => setFiltro(f.id)}
            className={`min-h-[40px] shrink-0 rounded-full px-4 text-sm font-semibold transition ${filtro === f.id ? 'bg-navy text-white' : 'border border-slate-300 bg-white text-ink hover:bg-slate-50'}`}>{f.rotulo}</button>
        ))}
      </div>

      <div className="mt-4">
        {lista.length === 0 ? <EmptyState icone={BellOff} titulo="Nenhuma notificação por aqui" texto="Quando houver novidades sobre seus comunicados, elas aparecerão nesta página." /> : (
          <ul className="space-y-3">{lista.map((n) => (
            <NotificationItem key={n.id} n={n} onLer={(id) => { marcarComoLida(id); atualizar(); }}
              onVerComunicado={(cid) => {
                const c = comunicados.find((x) => x.id === cid) ?? null;
                if (c) {
                  if (!n.lida) { marcarComoLida(n.id); atualizar(); }
                  setComunicadoAberto(c);
                }
              }} />
          ))}</ul>
        )}
      </div>
      <ComunicadoDetalhes comunicado={comunicadoAberto} onClose={() => setComunicadoAberto(null)} modo={comunicadoAberto?.autorId === usuario?.id ? 'autor' : 'publico'} />
    </div>
  );
}

export default function NotificacoesPage() {
  return <AppShell><Conteudo /></AppShell>;
}
