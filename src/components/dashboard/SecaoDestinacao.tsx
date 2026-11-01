'use client';

import { useState } from 'react';
import { CalendarPlus, Gavel, History } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import EmptyState from '@/components/ui/EmptyState';
import { Select, Textarea } from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { formatarData, formatarDataHora } from '@/lib/format';
import { OPCOES_DESTINACAO, prorrogarPermanencia, registrarDestinacao, situacaoPermanencia } from '@/services/biblioteca.service';
import type { Comunicado } from '@/types/comunicado';

export default function SecaoDestinacao() {
  const { comunicados, atualizar } = useData();
  const { usuario } = useAuth();
  const toast = useToast();
  const [alvo, setAlvo] = useState<Comunicado | null>(null);
  const [tipo, setTipo] = useState('');
  const [analise, setAnalise] = useState('');

  const candidatos = comunicados.filter((c) => ['RECEBIDO_BIBLIOTECA', 'DISPONIVEL_RETIRADA'].includes(c.status) && situacaoPermanencia(c) !== 'regular')
    .sort((a, b) => (a.permanenciaAte ?? '').localeCompare(b.permanenciaAte ?? ''));
  const historico = comunicados.filter((c) => c.destinacao);

  function registrar() {
    if (!usuario || !alvo) return;
    if (!tipo) return void toast('erro', 'Escolha a destinação conforme as regras da instituição.');
    if (analise.trim().length < 10) return void toast('erro', 'Registre a análise realizada (mínimo de 10 caracteres).');
    const r = registrarDestinacao(alvo.id, usuario, tipo, analise.trim());
    if (r.ok) { atualizar(); toast('sucesso', 'Destinação registrada e comunicado encerrado.'); setAlvo(null); } else toast('erro', r.erro);
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Destinação</h1>
      <p className="mt-1 text-suave">Objetos com prazo de permanência vencido ou perto de vencer (90 dias).</p>
      <div className="mt-5"><Alert tipo="info">Nenhuma doação ou descarte é feito automaticamente. A biblioteca analisa cada caso e registra a decisão conforme as regras da instituição.</Alert></div>

      <div className="mt-6">
        {candidatos.length === 0 ? <EmptyState icone={Gavel} titulo="Nenhum objeto para destinação" texto="Objetos aparecem aqui quando o prazo de permanência está vencido ou próximo do vencimento." /> : (
          <ul className="space-y-3">
            {candidatos.map((c) => (
              <li key={c.id} className="card flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-navy">{c.titulo}</h3>{situacaoPermanencia(c) === 'vencida' ? <Badge cor="vermelho">Prazo vencido</Badge> : <Badge cor="amarelo">Perto de vencer</Badge>}</div>
                  <p className="mt-1 text-sm text-suave">{c.categoria} · recebido em {c.recebimento ? formatarData(c.recebimento.em) : '—'} · permanência até {c.permanenciaAte ? formatarData(c.permanenciaAte) : '—'}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variante="secundario" tamanho="sm" icone={<CalendarPlus className="h-4 w-4" />} onClick={() => { if (usuario && prorrogarPermanencia(c.id, usuario, 30).ok) { atualizar(); toast('sucesso', 'Permanência prorrogada em 30 dias.'); } }}>Prorrogar 30 dias</Button>
                  <Button tamanho="sm" icone={<Gavel className="h-4 w-4" />} onClick={() => { setAlvo(c); setTipo(''); setAnalise(''); }}>Registrar análise e destinação</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {historico.length > 0 && (
        <section className="mt-10" aria-labelledby="hd">
          <h2 id="hd" className="mb-3 flex items-center gap-2 text-xl font-bold"><History className="h-5 w-5" aria-hidden />Destinações registradas</h2>
          <ul className="card divide-y divide-slate-100">
            {historico.map((c) => <li key={c.id} className="p-4 text-sm"><p className="font-semibold text-navy">{c.titulo} — {c.destinacao!.tipo}</p><p className="text-suave">{c.destinacao!.analise} · {c.destinacao!.funcionarioNome}, {formatarDataHora(c.destinacao!.em)}</p></li>)}
          </ul>
        </section>
      )}

      <Modal aberto={!!alvo} onClose={() => setAlvo(null)} titulo="Registrar destinação" descricao={alvo?.titulo}
        rodape={<><Button variante="secundario" onClick={() => setAlvo(null)}>Cancelar</Button><Button onClick={registrar}>Registrar e encerrar</Button></>}>
        <div className="space-y-4">
          <Select label="Destinação" obrigatorio value={tipo} onChange={(e) => setTipo(e.target.value)}><option value="">Selecione…</option>{OPCOES_DESTINACAO.map((o) => <option key={o}>{o}</option>)}</Select>
          <Textarea label="Análise realizada" obrigatorio placeholder="Ex.: Tentativas de contato realizadas, sem reivindicação em 90 dias." value={analise} onChange={(e) => setAnalise(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
