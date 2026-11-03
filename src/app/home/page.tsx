'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FileText, PackageCheck, PackageSearch, Hourglass, Plus, Search } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import ComunicadoCard from '@/components/comunicados/ComunicadoCard';
import ComunicadoDetalhes from '@/components/comunicados/ComunicadoDetalhes';
import PrazoTag from '@/components/comunicados/PrazoTag';
import Alert from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import StatCard from '@/components/ui/StatCard';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useWizard } from '@/contexts/WizardContext';
import { primeiroNome } from '@/lib/format';
import type { Comunicado } from '@/types/comunicado';

function Conteudo() {
  const { usuario } = useAuth();
  const { comunicados, solicitacoes } = useData();
  const { abrir } = useWizard();
  const [aberto, setAberto] = useState<Comunicado | null>(null);
  if (!usuario) return null;

  const meus = comunicados.filter((c) => c.autorId === usuario.id);
  const andamento = solicitacoes.filter((s) => s.alunoId === usuario.id && ['PENDENTE', 'APROVADA'].includes(s.status)).length;
  const recentes = comunicados.slice().sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)).slice(0, 6);
  const pendentesEntrega = meus.filter((c) => ['AGUARDANDO_ENTREGA', 'ENTREGA_ATRASADA'].includes(c.status));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold">Olá, {primeiroNome(usuario.nome)}!</h1>
        <p className="mt-1 text-suave">Vamos encontrar o que você procura?</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button tamanho="lg" icone={<PackageSearch className="h-5 w-5" />} onClick={() => abrir('PERDIDO')}>Perdi um objeto</Button>
          <Button tamanho="lg" variante="sucesso" icone={<PackageCheck className="h-5 w-5" />} onClick={() => abrir('ENCONTRADO')}>Encontrei um objeto</Button>
        </div>
      </header>

      {pendentesEntrega.length > 0 && (
        <Alert tipo={pendentesEntrega.some((c) => c.status === 'ENTREGA_ATRASADA') ? 'erro' : 'aviso'} titulo="Você tem objetos para entregar na biblioteca">
          <ul className="mt-1.5 space-y-1.5">
            {pendentesEntrega.map((c) => <li key={c.id} className="flex flex-wrap items-center gap-2"><span className="font-semibold">{c.titulo}</span><PrazoTag comunicado={c} /></li>)}
          </ul>
        </Alert>
      )}

      <section aria-label="Resumo" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icone={FileText} rotulo="Meus comunicados" valor={meus.length} />
        <StatCard icone={PackageSearch} rotulo="Objetos perdidos" valor={meus.filter((c) => c.tipo === 'PERDIDO').length} tom="vermelho" />
        <StatCard icone={PackageCheck} rotulo="Objetos encontrados" valor={meus.filter((c) => c.tipo === 'ENCONTRADO').length} tom="agua" />
        <StatCard icone={Hourglass} rotulo="Solicitações em andamento" valor={andamento} tom="sol" />
      </section>

      <section aria-labelledby="recentes">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="recentes" className="text-xl font-bold">Comunicados recentes</h2>
          <Link href="/comunicados" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"><Search className="h-4 w-4" aria-hidden />Ver todos</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {recentes.map((c) => <ComunicadoCard key={c.id} comunicado={c} onVer={setAberto} />)}
        </div>
        <div className="mt-6"><Button variante="secundario" icone={<Plus className="h-4 w-4" />} onClick={() => abrir()}>Cadastrar comunicado</Button></div>
      </section>
      <ComunicadoDetalhes comunicado={aberto} onClose={() => setAberto(null)} />
    </div>
  );
}

export default function HomePage() {
  return <AppShell><Conteudo /></AppShell>;
}
