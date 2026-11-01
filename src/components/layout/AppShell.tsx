'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { Bell, FilePlus2, FileText, Home, Search, LogOut, Menu, User, X } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import RequireAuth from '@/components/layout/RequireAuth';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useWizard } from '@/contexts/WizardContext';
import { useHash } from '@/hooks/useHash';
import { iniciais } from '@/lib/format';

function NavAluno({ aoNavegar }: { aoNavegar?: () => void }) {
  const pathname = usePathname();
  const hash = useHash();
  const router = useRouter();
  const { usuario, logout } = useAuth();
  const { notificacoes } = useData();
  const { abrir } = useWizard();
  const naoLidas = notificacoes.filter((n) => n.usuarioId === usuario?.id && !n.lida).length;

  const itens = [
    { href: '/home', rotulo: 'Início', Icon: Home, ativo: pathname === '/home' },
    { href: '/comunicados', rotulo: 'Comunicados', Icon: Search, ativo: pathname === '/comunicados' },
    { href: '/perfil#comunicados', rotulo: 'Meus comunicados', Icon: FileText, ativo: pathname === '/perfil' && hash === 'comunicados' },
    { href: '/notificacoes', rotulo: 'Notificações', Icon: Bell, ativo: pathname === '/notificacoes', badge: naoLidas },
    { href: '/perfil', rotulo: 'Perfil', Icon: User, ativo: pathname === '/perfil' && hash !== 'comunicados' },
  ];
  const cls = (ativo: boolean) => `flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition ${ativo ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`;

  return (
    <nav aria-label="Navegação do aluno" className="flex flex-1 flex-col">
      <ul className="space-y-1">
        {itens.slice(0, 2).map((it) => (
          <li key={it.rotulo}>
            <Link href={it.href} onClick={aoNavegar} className={cls(it.ativo)} aria-current={it.ativo ? 'page' : undefined}><it.Icon className="h-5 w-5" aria-hidden />{it.rotulo}</Link>
          </li>
        ))}
        <li>
          <button onClick={() => { aoNavegar?.(); abrir(); }} className={cls(false)}><FilePlus2 className="h-5 w-5" aria-hidden />Cadastrar comunicado</button>
        </li>
        {itens.slice(2).map((it) => (
          <li key={it.rotulo}>
            <Link href={it.href} onClick={aoNavegar} className={cls(it.ativo)} aria-current={it.ativo ? 'page' : undefined}>
              <it.Icon className="h-5 w-5" aria-hidden />
              <span className="flex-1">{it.rotulo}</span>
              {!!it.badge && <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-sol px-1.5 text-xs font-bold text-navy" aria-label={`${it.badge} não lidas`}>{it.badge}</span>}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        {usuario && (
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white" aria-hidden>{iniciais(usuario.nome)}</span>
            <div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{usuario.nome}</p><p className="truncate text-xs text-slate-400">{usuario.email}</p></div>
          </div>
        )}
        <button className={cls(false)} onClick={() => { logout(); aoNavegar?.(); router.push('/'); }}><LogOut className="h-5 w-5" aria-hidden />Sair</button>
      </div>
    </nav>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false);
  const { usuario } = useAuth();
  const { notificacoes } = useData();
  const naoLidas = notificacoes.filter((n) => n.usuarioId === usuario?.id && !n.lida).length;

  return (
    <RequireAuth perfil="aluno">
      <div className="min-h-screen lg:pl-72">
        <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col bg-navy p-5 lg:flex">
          <div className="mb-8"><Logo claro href="/home" /></div>
          <NavAluno />
        </aside>

        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
          <Logo href="/home" mostrarSubtitulo={false} />
          <div className="flex items-center gap-1">
            <Link href="/notificacoes" aria-label={`Notificações${naoLidas ? `, ${naoLidas} não lidas` : ''}`} className="relative rounded-lg p-2.5 text-navy hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              {naoLidas > 0 && <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-sol ring-2 ring-white" />}
            </Link>
            <button onClick={() => setMenu(true)} aria-label="Abrir menu" className="rounded-lg p-2.5 text-navy hover:bg-slate-100"><Menu className="h-6 w-6" /></button>
          </div>
        </header>

        {menu && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-navy-900/60" onClick={() => setMenu(false)} />
            <aside className="absolute inset-y-0 right-0 flex w-72 max-w-[85vw] flex-col bg-navy p-5" role="dialog" aria-modal="true" aria-label="Menu">
              <div className="mb-6 flex items-center justify-between">
                <Logo claro mostrarSubtitulo={false} href="/home" />
                <button onClick={() => setMenu(false)} aria-label="Fechar menu" className="rounded-lg p-2 text-white hover:bg-white/10"><X className="h-5 w-5" /></button>
              </div>
              <NavAluno aoNavegar={() => setMenu(false)} />
            </aside>
          </div>
        )}

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-10">{children}</main>
      </div>
    </RequireAuth>
  );
}
