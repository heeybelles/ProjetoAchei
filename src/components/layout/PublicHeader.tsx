'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import { LinkButton } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

const links = [
  { href: '/', rotulo: 'Início' },
  { href: '/#como-funciona', rotulo: 'Como funciona' },
  { href: '/comunicados', rotulo: 'Comunicados' },
];

export default function PublicHeader() {
  const { usuario } = useAuth();
  const [aberto, setAberto] = useState(false);
  const painel = usuario?.perfil === 'funcionario' ? '/biblioteca' : '/home';
  const link = 'rounded-lg px-3 py-2 text-sm font-semibold text-ink hover:bg-slate-100';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {links.map((l) => <Link key={l.href} href={l.href} className={link}>{l.rotulo}</Link>)}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {usuario ? (
            <LinkButton href={painel}>{usuario.perfil === 'funcionario' ? 'Abrir painel da biblioteca' : 'Ir para meu painel'}</LinkButton>
          ) : (
            <>
              <LinkButton href="/login" variante="secundario">Entrar</LinkButton>
              <LinkButton href="/cadastro">Criar conta</LinkButton>
            </>
          )}
        </div>
        <button className="rounded-lg p-2 text-navy hover:bg-slate-100 md:hidden" onClick={() => setAberto((v) => !v)} aria-expanded={aberto} aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}>
          {aberto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {aberto && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <nav aria-label="Principal (celular)" className="flex flex-col gap-1">
            {links.map((l) => <Link key={l.href} href={l.href} onClick={() => setAberto(false)} className={`${link} py-3`}>{l.rotulo}</Link>)}
          </nav>
          <div className="mt-3 flex gap-2">
            {usuario ? <LinkButton href={painel} cheio>Ir para meu painel</LinkButton> : (
              <><LinkButton href="/login" variante="secundario" cheio>Entrar</LinkButton><LinkButton href="/cadastro" cheio>Criar conta</LinkButton></>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
