'use client';

import { useState } from 'react';
import { CheckCircle2, Eye, HandHeart, ShieldCheck, ThumbsDown, Undo2 } from 'lucide-react';
import DetalhesPrivados from '@/components/dashboard/DetalhesPrivados';
import { Badge, StatusBadge, type CorBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import EmptyState from '@/components/ui/EmptyState';
import { Textarea } from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { formatarDataHora } from '@/lib/format';
import { analisarSolicitacao, registrarDevolucao } from '@/services/biblioteca.service';
import type { Comunicado, Solicitacao, StatusSolicitacao } from '@/types/comunicado';

const corSol: Record<StatusSolicitacao, CorBadge> = { PENDENTE: 'amarelo', APROVADA: 'agua', REPROVADA: 'vermelho', DEVOLVIDA: 'verde' };
const rotSol: Record<StatusSolicitacao, string> = { PENDENTE: 'Pendente', APROVADA: 'Aprovada', REPROVADA: 'Reprovada', DEVOLVIDA: 'Devolvida' };

export default function SecaoSolicitacoes() {
  const { solicitacoes, comunicados, atualizar } = useData();
  const { usuario } = useAuth();
  const toast = useToast();
  const [filtro, setFiltro] = useState<'' | StatusSolicitacao>('');
  const [ver, setVer] = useState<Comunicado | null>(null);
  const [validar, setValidar] = useState<Solicitacao | null>(null);
  const [devolver, setDevolver] = useState<Solicitacao | null>(null);
  const [check, setCheck] = useState({ carac: false, doc: false });
  const [parecer, setParecer] = useState('');

  const lista = solicitacoes.filter((s) => !filtro || s.status === filtro).sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
  const comunic = (id: string) => comunicados.find((c) => c.id === id);

  function resolver(resultado: 'APROVADA' | 'REPROVADA') {
    if (!usuario || !validar) return;
    if (parecer.trim().length < 5) { toast('erro', 'Registre o resultado da validação no campo de parecer.'); return; }
    const resumo = `${check.carac ? 'Características conferidas. ' : 'Características não conferidas. '}${check.doc ? 'Documento apresentado. ' : 'Sem documento. '}${parecer.trim()}`;
    const r = analisarSolicitacao(validar.id, resultado, resumo, usuario);
    if (r.ok) { atualizar(); toast('sucesso', resultado === 'APROVADA' ? 'Propriedade validada. Registre a devolução quando o aluno retirar.' : 'Reivindicação reprovada.'); setValidar(null); } else toast('erro', r.erro);
  }
  function registrar() {
    if (!usuario || !devolver) return;
    const r = registrarDevolucao(devolver.id, usuario, parecer.trim());
    if (r.ok) { atualizar(); toast('sucesso', 'Devolução registrada.'); setDevolver(null); } else toast('erro', r.erro);
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Solicitações de retirada</h1>
      <p className="mt-1 text-suave">Alunos que acreditam que um objeto é seu. A validação é simulada para fins de demonstração.</p>
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filtrar solicitações">
        {([['', 'Todas'], ['PENDENTE', 'Pendentes'], ['APROVADA', 'Aprovadas'], ['DEVOLVIDA', 'Devolvidas'], ['REPROVADA', 'Reprovadas']] as const).map(([id, r]) => (
          <button key={id} role="tab" aria-selected={filtro === id} onClick={() => setFiltro(id)} className={`min-h-[40px] shrink-0 rounded-full px-4 text-sm font-semibold ${filtro === id ? 'bg-navy text-white' : 'border border-slate-300 bg-white hover:bg-slate-50'}`}>{r}</button>
        ))}
      </div>
      <div className="mt-5">
        {lista.length === 0 ? <EmptyState icone={HandHeart} titulo="Nenhuma solicitação nesta lista" texto="Quando um aluno clicar em “Acredito que este objeto é meu”, a solicitação aparecerá aqui." /> : (
          <ul className="space-y-3">
            {lista.map((s) => {
              const c = comunic(s.comunicadoId);
              const naCustodia = c?.status === 'EM_PROCESSO_DEVOLUCAO';
              return (
                <li key={s.id} className="card p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-navy">{c?.titulo ?? 'Comunicado removido'}</h3><Badge cor={corSol[s.status]}>{rotSol[s.status]}</Badge>{c && <StatusBadge status={c.status} />}</div>
                      <p className="mt-1 text-sm text-suave">Solicitado por {s.alunoNome} ({s.alunoMatricula}) em {formatarDataHora(s.criadoEm)}</p>
                      {s.parecer && <p className="mt-1 text-sm text-ink"><span className="font-semibold">Parecer:</span> {s.parecer}{s.analisadoPor ? ` — ${s.analisadoPor}` : ''}</p>}
                      {s.status === 'PENDENTE' && c && !naCustodia && <p className="mt-1 text-xs font-semibold text-amber-800">Aguardando o recebimento físico do objeto para validar.</p>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {c && <Button variante="secundario" tamanho="sm" icone={<Eye className="h-4 w-4" />} onClick={() => setVer(c)}>Informações privadas</Button>}
                      {s.status === 'PENDENTE' && <Button tamanho="sm" icone={<ShieldCheck className="h-4 w-4" />} disabled={!naCustodia} onClick={() => { setValidar(s); setCheck({ carac: false, doc: false }); setParecer(''); }}>Validar propriedade</Button>}
                      {s.status === 'APROVADA' && <Button variante="sucesso" tamanho="sm" icone={<Undo2 className="h-4 w-4" />} onClick={() => { setDevolver(s); setParecer(''); }}>Registrar devolução</Button>}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <DetalhesPrivados comunicado={ver} onClose={() => setVer(null)} />

      <Modal aberto={!!validar} onClose={() => setValidar(null)} titulo="Validar propriedade" descricao={validar ? `${comunic(validar.comunicadoId)?.titulo} — ${validar.alunoNome}` : undefined} largura="lg"
        rodape={<><Button variante="secundario" onClick={() => setValidar(null)}>Cancelar</Button><Button variante="perigo" icone={<ThumbsDown className="h-4 w-4" />} onClick={() => resolver('REPROVADA')}>Reprovar</Button><Button variante="sucesso" icone={<CheckCircle2 className="h-4 w-4" />} onClick={() => resolver('APROVADA')}>Aprovar</Button></>}>
        {validar && comunic(validar.comunicadoId) && (
          <div className="space-y-4">
            <Alert tipo="info" titulo="Informações privadas para conferência">
              <p>{comunic(validar.comunicadoId)!.descricaoPrivada}</p>
              <p className="mt-1"><span className="font-semibold">Características:</span> {comunic(validar.comunicadoId)!.caracteristicasPrivadas || 'Não informadas'}</p>
            </Alert>
            <fieldset className="space-y-1"><legend className="text-sm font-semibold">Checklist da validação (simulada)</legend>
              <label className="flex min-h-[44px] items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-brand" checked={check.carac} onChange={(e) => setCheck({ ...check, carac: e.target.checked })} />O aluno descreveu corretamente as características do objeto</label>
              <label className="flex min-h-[44px] items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-brand" checked={check.doc} onChange={(e) => setCheck({ ...check, doc: e.target.checked })} />O aluno apresentou documento de identificação</label>
            </fieldset>
            <Textarea label="Parecer da validação" obrigatorio placeholder="Descreva o resultado da conferência." value={parecer} onChange={(e) => setParecer(e.target.value)} />
          </div>
        )}
      </Modal>

      <Modal aberto={!!devolver} onClose={() => setDevolver(null)} titulo="Registrar devolução" descricao={devolver ? `Entrega a ${devolver.alunoNome}` : undefined}
        rodape={<><Button variante="secundario" onClick={() => setDevolver(null)}>Cancelar</Button><Button variante="sucesso" onClick={registrar}>Confirmar devolução</Button></>}>
        <Textarea label="Observações da devolução" placeholder="Ex.: Retirado pessoalmente, documento conferido." value={parecer} onChange={(e) => setParecer(e.target.value)} />
      </Modal>
    </div>
  );
}
