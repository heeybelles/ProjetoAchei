'use client';

import Link from 'next/link';
import { ArrowRight, ClipboardList, Eye, PackageSearch, ShieldCheck, Handshake, Search } from 'lucide-react';
import PublicHeader from '@/components/layout/PublicHeader';
import Footer from '@/components/layout/Footer';
import HeroIlustracao from '@/components/layout/HeroIlustracao';
import ComunicadoCard from '@/components/comunicados/ComunicadoCard';
import ComunicadoDetalhes from '@/components/comunicados/ComunicadoDetalhes';
import { Button, LinkButton } from '@/components/ui/Button';
import { useData } from '@/contexts/DataContext';
import { useWizard } from '@/contexts/WizardContext';
import { useState } from 'react';
import type { Comunicado } from '@/types/comunicado';

const etapas = [
  { Icon: ClipboardList, titulo: 'Registre', texto: 'Informe o objeto perdido ou encontrado em poucos passos. O sistema guarda data e horário automaticamente.' },
  { Icon: Eye, titulo: 'Acompanhe', texto: 'Consulte os comunicados e receba atualizações sobre prazos, recebimentos e solicitações.' },
  { Icon: Handshake, titulo: 'Recupere', texto: 'Procure a biblioteca, valide a propriedade do objeto e retire o que é seu.' },
];

export default function Landing() {
  const { comunicados } = useData();
  const { abrir } = useWizard();
  const [aberto, setAberto] = useState<Comunicado | null>(null);
  const recentes = comunicados.slice().sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <section className="bg-white">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-20">
            <div>
              <h1 className="text-4xl font-extrabold leading-tight text-navy sm:text-5xl">Perdeu ou encontrou algo na FATEC?</h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-suave">Com o Achei, encontrar objetos perdidos ficou mais simples. Registre, acompanhe e ajude a comunidade acadêmica.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <LinkButton href="/comunicados" tamanho="lg" icone={<Search className="h-5 w-5" />}>Encontrar meu objeto</LinkButton>
                <Button variante="secundario" tamanho="lg" icone={<PackageSearch className="h-5 w-5" />} onClick={() => abrir()}>Registrar objeto</Button>
              </div>
              <p className="mt-5 text-sm font-semibold text-navy">Perdeu ou encontrou? A gente te ajuda!</p>
            </div>
            <HeroIlustracao />
          </div>
        </section>

        <section id="como-funciona" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-extrabold">Como funciona</h2>
          <p className="mt-2 max-w-xl text-suave">Três etapas simples, da publicação à devolução.</p>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {etapas.map((e, i) => (
              <li key={e.titulo} className="card p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white"><e.Icon className="h-6 w-6" aria-hidden /></span>
                  <span className="text-sm font-bold text-suave">Etapa {i + 1}</span>
                </div>
                <h3 className="mt-4 text-xl font-bold">{e.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-suave">{e.texto}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div><h2 className="text-3xl font-extrabold">Comunicados recentes</h2><p className="mt-2 text-suave">Veja o que foi publicado nos últimos dias.</p></div>
              <Link href="/comunicados" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">Ver todos os comunicados<ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {recentes.map((c) => <ComunicadoCard key={c.id} comunicado={c} onVer={setAberto} />)}
            </div>
          </div>
        </section>

        <section id="sobre" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
          <div className="card grid gap-8 overflow-hidden bg-navy p-8 text-white md:grid-cols-2 md:p-12">
            <div>
              <h2 className="text-3xl font-extrabold !text-white">Sobre o Projeto Achei</h2>
              <p className="mt-4 leading-relaxed text-slate-200">O Achei foi criado para facilitar a organização dos achados e perdidos da FATEC. A biblioteca guarda os objetos encontrados e cuida da devolução, enquanto os alunos publicam comunicados e acompanham cada etapa.</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold !text-white"><ShieldCheck className="h-5 w-5 text-sol" aria-hidden />Privacidade em primeiro lugar</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">Publicamos apenas um resumo do objeto. Fotos e características específicas ficam disponíveis somente para a biblioteca, evitando que alguém reivindique o que não é seu.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ComunicadoDetalhes comunicado={aberto} onClose={() => setAberto(null)} />
    </div>
  );
}
