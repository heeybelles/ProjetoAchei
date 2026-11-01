'use client';

import { AlertTriangle, ClipboardList, Hourglass, PackageCheck, PackageOpen, Inbox } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import Alert from '@/components/ui/Alert';
import EmptyState from '@/components/ui/EmptyState';
import { useData } from '@/contexts/DataContext';
import { formatarDataHora } from '@/lib/format';
import { calcularIndicadores } from '@/services/biblioteca.service';

export default function LibraryDashboard({ irPara }: { irPara: (aba: string) => void }) {
  const { comunicados, solicitacoes, historico } = useData();
  const i = calcularIndicadores(comunicados, solicitacoes);
  const atrasados = comunicados.filter((c) => c.status === 'ENTREGA_ATRASADA');

  return (
    <div className="space-y-8">
      <header><h1 className="text-3xl font-extrabold">Painel da biblioteca</h1><p className="mt-1 text-suave">Acompanhe recebimentos, solicitações e prazos em um só lugar.</p></header>
      <section aria-label="Indicadores" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icone={ClipboardList} rotulo="Comunicados pendentes" valor={i.pendentes} onClick={() => irPara('comunicados')} />
        <StatCard icone={Hourglass} rotulo="Aguardando recebimento" valor={i.aguardando} tom="sol" onClick={() => irPara('recebimentos')} />
        <StatCard icone={PackageCheck} rotulo="Objetos recebidos" valor={i.recebidos} tom="agua" onClick={() => irPara('inventario')} />
        <StatCard icone={Inbox} rotulo="Solicitações de retirada" valor={i.solicitacoes} tom="navy" onClick={() => irPara('solicitacoes')} />
        <StatCard icone={AlertTriangle} rotulo="Prazos vencidos" valor={i.vencidos} tom="vermelho" onClick={() => irPara('recebimentos')} />
      </section>

      {atrasados.length > 0 && (
        <Alert tipo="erro" titulo={`${atrasados.length} ${atrasados.length === 1 ? 'entrega atrasada' : 'entregas atrasadas'}`}
          acao={<button onClick={() => irPara('recebimentos')} className="shrink-0 text-sm font-semibold underline">Ver recebimentos</button>}>
          {atrasados.map((c) => c.titulo).join(', ')} — mantidos aguardando análise. Nada é marcado como recebido automaticamente.
        </Alert>
      )}

      <section aria-labelledby="hist">
        <h2 id="hist" className="mb-3 text-xl font-bold">Histórico recente</h2>
        {historico.length === 0 ? <EmptyState icone={PackageOpen} titulo="Sem ações registradas" texto="As ações da biblioteca aparecerão aqui." /> : (
          <ul className="card divide-y divide-slate-100">
            {historico.slice(0, 8).map((h) => (
              <li key={h.id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="text-sm font-semibold text-navy">{h.acao}</p><p className="text-sm text-suave">{h.detalhe}</p></div>
                <p className="shrink-0 text-xs text-suave">{h.funcionario} · {formatarDataHora(h.em)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
