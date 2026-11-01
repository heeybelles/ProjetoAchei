'use client';

import { useMemo, useState } from 'react';
import { Eye, FileSearch, XCircle } from 'lucide-react';
import DetalhesPrivados from '@/components/dashboard/DetalhesPrivados';
import { StatusBadge, TipoBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { Textarea } from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import Pagination from '@/components/ui/Pagination';
import SearchBar from '@/components/ui/SearchBar';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { usePaginacao } from '@/hooks/usePaginacao';
import { formatarDataHora } from '@/lib/format';
import { encerrarComunicado } from '@/services/biblioteca.service';
import { STATUS_LABEL, type Comunicado, type StatusComunicado } from '@/types/comunicado';

const norm = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function SecaoComunicados() {
  const { comunicados, atualizar } = useData();
  const { usuario } = useAuth();
  const toast = useToast();
  const [busca, setBusca] = useState('');
  const [status, setStatus] = useState('');
  const [tipo, setTipo] = useState('');
  const [ver, setVer] = useState<Comunicado | null>(null);
  const [encerrar, setEncerrar] = useState<Comunicado | null>(null);
  const [motivo, setMotivo] = useState('');

  const lista = useMemo(() => {
    const q = norm(busca);
    return comunicados.filter((c) => (!status || c.status === status) && (!tipo || c.tipo === tipo) && (!q || norm(`${c.titulo} ${c.autorNome} ${c.autorMatricula} ${c.local}`).includes(q)))
      .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
  }, [comunicados, busca, status, tipo]);
  const { pagina, setPagina, total, visiveis } = usePaginacao(lista, 8);

  function confirmarEncerrar() {
    if (!usuario || !encerrar) return;
    if (motivo.trim().length < 5) { toast('erro', 'Informe o motivo do encerramento.'); return; }
    const r = encerrarComunicado(encerrar.id, usuario, motivo.trim());
    if (r.ok) { atualizar(); toast('sucesso', 'Comunicado encerrado.'); setEncerrar(null); setMotivo(''); } else toast('erro', r.erro);
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Comunicados</h1>
      <p className="mt-1 text-suave">Todos os comunicados, com acesso às informações privadas.</p>
      <div className="card mt-6 space-y-3 p-4">
        <SearchBar valor={busca} onChange={(v) => { setBusca(v); setPagina(1); }} placeholder="Buscar por objeto, aluno, matrícula ou local" rotulo="Buscar comunicados" />
        <div className="flex flex-wrap gap-3">
          <select aria-label="Filtrar por status" className="input w-full sm:w-auto" value={status} onChange={(e) => { setStatus(e.target.value); setPagina(1); }}><option value="">Todos os status</option>{(Object.keys(STATUS_LABEL) as StatusComunicado[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select>
          <select aria-label="Filtrar por tipo" className="input w-full sm:w-auto" value={tipo} onChange={(e) => { setTipo(e.target.value); setPagina(1); }}><option value="">Perdidos e encontrados</option><option value="PERDIDO">Perdidos</option><option value="ENCONTRADO">Encontrados</option></select>
        </div>
      </div>
      <div className="mt-5">
        {lista.length === 0 ? <EmptyState icone={FileSearch} titulo="Nenhum comunicado encontrado" texto="Ajuste a busca ou os filtros." /> : (
          <ul className="space-y-3">
            {visiveis.map((c) => (
              <li key={c.id} className="card flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-navy">{c.titulo}</h3><TipoBadge tipo={c.tipo} /><StatusBadge status={c.status} /></div>
                  <p className="mt-1 text-sm text-suave">{c.autorNome} · matrícula {c.autorMatricula} · {c.local} · {formatarDataHora(c.criadoEm)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variante="secundario" tamanho="sm" icone={<Eye className="h-4 w-4" />} onClick={() => setVer(c)}>Informações privadas</Button>
                  {c.status === 'PUBLICADO' && <Button variante="secundario" tamanho="sm" icone={<XCircle className="h-4 w-4" />} onClick={() => setEncerrar(c)}>Encerrar</Button>}
                </div>
              </li>
            ))}
          </ul>
        )}
        <Pagination pagina={pagina} total={total} onChange={setPagina} />
      </div>
      <DetalhesPrivados comunicado={ver} onClose={() => setVer(null)} />
      <Modal aberto={!!encerrar} onClose={() => setEncerrar(null)} titulo="Encerrar comunicado" descricao={encerrar?.titulo}
        rodape={<><Button variante="secundario" onClick={() => setEncerrar(null)}>Cancelar</Button><Button variante="perigo" onClick={confirmarEncerrar}>Encerrar comunicado</Button></>}>
        <Textarea label="Motivo do encerramento" obrigatorio placeholder="Ex.: Aluno informou que localizou o objeto." value={motivo} onChange={(e) => setMotivo(e.target.value)} />
      </Modal>
    </div>
  );
}
