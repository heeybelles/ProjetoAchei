'use client';

import { useMemo, useState } from 'react';
import { Plus, SearchX } from 'lucide-react';
import AdaptiveShell from '@/components/layout/AdaptiveShell';
import ComunicadoCard from '@/components/comunicados/ComunicadoCard';
import ComunicadoDetalhes from '@/components/comunicados/ComunicadoDetalhes';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import SearchBar from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useWizard } from '@/contexts/WizardContext';
import { usePaginacao } from '@/hooks/usePaginacao';
import { CATEGORIAS, LOCAIS, type Comunicado } from '@/types/comunicado';

const sel = 'input w-full sm:w-auto sm:min-w-[160px]';
const normalizar = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function Lista() {
  const { comunicados } = useData();
  const { usuario } = useAuth();
  const { abrir } = useWizard();
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [local, setLocal] = useState('');
  const [tipo, setTipo] = useState('');
  const [ordem, setOrdem] = useState<'recentes' | 'antigos'>('recentes');
  const [aberto, setAberto] = useState<Comunicado | null>(null);

  const filtrados = useMemo(() => {
    const q = normalizar(busca.trim());
    return comunicados
      .filter((c) => (!categoria || c.categoria === categoria) && (!local || c.local === local) && (!tipo || c.tipo === tipo))
      .filter((c) => !q || normalizar(`${c.titulo} ${c.resumoPublico} ${c.local} ${c.categoria}`).includes(q))
      .sort((a, b) => (ordem === 'recentes' ? b.criadoEm.localeCompare(a.criadoEm) : a.criadoEm.localeCompare(b.criadoEm)));
  }, [comunicados, busca, categoria, local, tipo, ordem]);

  const { pagina, setPagina, total, visiveis } = usePaginacao(filtrados, 6);
  const limpar = () => { setBusca(''); setCategoria(''); setLocal(''); setTipo(''); setOrdem('recentes'); setPagina(1); };
  const temFiltro = !!(busca || categoria || local || tipo);
  const reset = (fn: (v: string) => void) => (e: { target: { value: string } }) => { fn(e.target.value); setPagina(1); };

  return (
    <div>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Comunicados</h1>
          <p className="mt-1 text-suave">Consulte os objetos perdidos e encontrados na FATEC.</p>
        </div>
        {usuario?.perfil !== 'funcionario' && <Button icone={<Plus className="h-4 w-4" />} onClick={() => abrir()}>Cadastrar comunicado</Button>}
      </header>

      <section aria-label="Filtros" className="card mt-6 space-y-3 p-4">
        <SearchBar valor={busca} onChange={(v) => { setBusca(v); setPagina(1); }} placeholder="Buscar por objeto, local ou categoria" rotulo="Buscar comunicados" />
        <div className="flex flex-wrap gap-3">
          <select aria-label="Filtrar por categoria" className={sel} value={categoria} onChange={reset(setCategoria)}><option value="">Todas as categorias</option>{CATEGORIAS.map((c) => <option key={c}>{c}</option>)}</select>
          <select aria-label="Filtrar por localização" className={sel} value={local} onChange={reset(setLocal)}><option value="">Todos os locais</option>{LOCAIS.map((c) => <option key={c}>{c}</option>)}</select>
          <select aria-label="Filtrar por tipo" className={sel} value={tipo} onChange={reset(setTipo)}><option value="">Perdidos e encontrados</option><option value="PERDIDO">Perdidos</option><option value="ENCONTRADO">Encontrados</option></select>
          <select aria-label="Ordenar por data" className={sel} value={ordem} onChange={(e) => setOrdem(e.target.value as 'recentes' | 'antigos')}><option value="recentes">Mais recentes</option><option value="antigos">Mais antigos</option></select>
          {temFiltro && <Button variante="fantasma" onClick={limpar}>Limpar filtros</Button>}
        </div>
      </section>

      <p className="mt-5 text-sm text-suave" aria-live="polite">{filtrados.length} {filtrados.length === 1 ? 'comunicado encontrado' : 'comunicados encontrados'}</p>

      {filtrados.length === 0 ? (
        <div className="mt-4"><EmptyState icone={SearchX} titulo="Nenhum comunicado encontrado" texto="Tente buscar por outra palavra ou remova alguns filtros." acao={<Button variante="secundario" onClick={limpar}>Limpar filtros</Button>} /></div>
      ) : (
        <>
          <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visiveis.map((c) => <ComunicadoCard key={c.id} comunicado={c} onVer={setAberto} />)}</div>
          <Pagination pagina={pagina} total={total} onChange={setPagina} />
        </>
      )}
      <ComunicadoDetalhes comunicado={aberto} onClose={() => setAberto(null)} />
    </div>
  );
}

export default function ComunicadosPage() {
  return <AdaptiveShell><Lista /></AdaptiveShell>;
}
