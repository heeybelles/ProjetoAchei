'use client';

import { useState } from 'react';
import { Eye, PackageCheck, PackageX } from 'lucide-react';
import DetalhesPrivados from '@/components/dashboard/DetalhesPrivados';
import PrazoTag from '@/components/comunicados/PrazoTag';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { Textarea } from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { formatarDataHora } from '@/lib/format';
import { confirmarRecebimento } from '@/services/biblioteca.service';
import type { Comunicado } from '@/types/comunicado';

export default function SecaoRecebimentos() {
  const { comunicados, atualizar } = useData();
  const { usuario } = useAuth();
  const toast = useToast();
  const [alvo, setAlvo] = useState<Comunicado | null>(null);
  const [ver, setVer] = useState<Comunicado | null>(null);
  const [obs, setObs] = useState('');

  const aguardando = comunicados.filter((c) => ['AGUARDANDO_ENTREGA', 'ENTREGA_ATRASADA'].includes(c.status))
    .sort((a, b) => (a.prazoEntrega ?? '').localeCompare(b.prazoEntrega ?? ''));

  function confirmar() {
    if (!usuario || !alvo) return;
    const r = confirmarRecebimento(alvo.id, usuario, obs);
    if (r.ok) { atualizar(); toast('sucesso', `Recebimento de "${alvo.titulo}" confirmado.`); setAlvo(null); setObs(''); } else toast('erro', r.erro);
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Recebimentos</h1>
      <p className="mt-1 text-suave">Objetos encontrados por alunos que ainda não chegaram à biblioteca.</p>
      <div className="mt-6">
        {aguardando.length === 0 ? <EmptyState icone={PackageCheck} titulo="Nenhum objeto aguardando entrega" texto="Quando um aluno registrar um objeto encontrado, ele aparecerá aqui." /> : (
          <ul className="space-y-3">
            {aguardando.map((c) => (
              <li key={c.id} className={`card flex flex-col gap-3 p-4 lg:flex-row lg:items-center ${c.status === 'ENTREGA_ATRASADA' ? 'border-red-200 bg-red-50/40' : ''}`}>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-navy">{c.titulo}</h3><StatusBadge status={c.status} /><PrazoTag comunicado={c} /></div>
                  <p className="mt-1 text-sm text-suave">Encontrado por {c.autorNome} ({c.autorMatricula}) · publicado em {formatarDataHora(c.criadoEm)}</p>
                  {c.prazoEntrega && <p className="text-xs text-suave">Prazo: {formatarDataHora(c.prazoEntrega)}</p>}
                  {c.status === 'ENTREGA_ATRASADA' && <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-red-700"><PackageX className="h-3.5 w-3.5" aria-hidden />Aguardando análise: não foi marcado como recebido.</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variante="secundario" tamanho="sm" icone={<Eye className="h-4 w-4" />} onClick={() => setVer(c)}>Ver detalhes</Button>
                  <Button variante="sucesso" tamanho="sm" icone={<PackageCheck className="h-4 w-4" />} onClick={() => { setAlvo(c); setObs(''); }}>Confirmar recebimento</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <DetalhesPrivados comunicado={ver} onClose={() => setVer(null)} />
      <Modal aberto={!!alvo} onClose={() => setAlvo(null)} titulo="Confirmar recebimento físico" descricao={alvo ? `${alvo.titulo}, entregue por ${alvo.autorNome}` : undefined}
        rodape={<><Button variante="secundario" onClick={() => setAlvo(null)}>Cancelar</Button><Button variante="sucesso" onClick={confirmar}>Confirmar recebimento</Button></>}>
        <dl className="mb-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-sm">
          <div><dt className="text-xs font-semibold text-suave">Funcionário responsável</dt><dd className="font-medium">{usuario?.nome}</dd></div>
          <div><dt className="text-xs font-semibold text-suave">Data e horário</dt><dd className="font-medium">{formatarDataHora(new Date().toISOString())}</dd></div>
        </dl>
        <Textarea label="Observações" placeholder="Ex.: Objeto em bom estado, guardado no armário 3." value={obs} onChange={(e) => setObs(e.target.value)} />
      </Modal>
    </div>
  );
}
