'use client';

import { useMemo, useState } from 'react';
import { Archive, Eye, PackageOpen } from 'lucide-react';
import DetalhesPrivados from '@/components/dashboard/DetalhesPrivados';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import SearchBar from '@/components/ui/SearchBar';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { formatarData, formatarDataHora } from '@/lib/format';
import { disponibilizarRetirada, situacaoPermanencia } from '@/services/biblioteca.service';
import type { Comunicado } from '@/types/comunicado';

const norm = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function SecaoInventario() {
  const { comunicados, atualizar } = useData();
  const { usuario } = useAuth();
  const toast = useToast();
  const [busca, setBusca] = useState('');
  const [ver, setVer] = useState<Comunicado | null>(null);

  const itens = useMemo(() => {
    const q = norm(busca);
    return comunicados.filter((c) => ['RECEBIDO_BIBLIOTECA', 'DISPONIVEL_RETIRADA', 'EM_PROCESSO_DEVOLUCAO'].includes(c.status) && (!q || norm(`${c.titulo} ${c.categoria} ${c.autorNome}`).includes(q)))
      .sort((a, b) => (b.recebimento?.em ?? '').localeCompare(a.recebimento?.em ?? ''));
  }, [comunicados, busca]);

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Inventário</h1>
      <p className="mt-1 text-suave">Objetos sob custódia da biblioteca.</p>
      <div className="mt-6"><SearchBar valor={busca} onChange={setBusca} placeholder="Buscar objeto, categoria ou aluno" rotulo="Buscar no inventário" /></div>
      <div className="mt-5">
        {itens.length === 0 ? <EmptyState icone={PackageOpen} titulo="Nenhum objeto no inventário" texto="Confirme recebimentos para que os objetos apareçam aqui." /> : (
          <ul className="grid gap-4 md:grid-cols-2">
            {itens.map((c) => {
              const sit = situacaoPermanencia(c);
              return (
                <li key={c.id} className="card flex flex-col p-4">
                  <div className="flex items-start justify-between gap-2"><h3 className="font-bold text-navy">{c.titulo}</h3><StatusBadge status={c.status} /></div>
                  <p className="mt-1 text-sm text-suave">{c.categoria} · {c.local}</p>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div><dt className="font-semibold text-suave">Recebido em</dt><dd>{c.recebimento ? formatarDataHora(c.recebimento.em) : '—'}</dd></div>
                    <div><dt className="font-semibold text-suave">Por</dt><dd>{c.recebimento?.funcionarioNome ?? '—'}</dd></div>
                    <div><dt className="font-semibold text-suave">Permanência até</dt><dd>{c.permanenciaAte ? formatarData(c.permanenciaAte) : '—'}</dd></div>
                    <div><dt className="font-semibold text-suave">Situação</dt><dd>{sit === 'vencida' ? <Badge cor="vermelho">Prazo vencido</Badge> : sit === 'proxima' ? <Badge cor="amarelo">Perto de vencer</Badge> : <Badge cor="verde">Regular</Badge>}</dd></div>
                  </dl>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                    <Button variante="secundario" tamanho="sm" icone={<Eye className="h-4 w-4" />} onClick={() => setVer(c)}>Informações privadas</Button>
                    {c.status === 'RECEBIDO_BIBLIOTECA' && (
                      <Button tamanho="sm" icone={<Archive className="h-4 w-4" />} onClick={() => { if (usuario && disponibilizarRetirada(c.id, usuario).ok) { atualizar(); toast('sucesso', `"${c.titulo}" disponível para retirada.`); } }}>Disponibilizar para retirada</Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <DetalhesPrivados comunicado={ver} onClose={() => setVer(null)} />
    </div>
  );
}
