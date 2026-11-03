'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { LogOut, type LucideIcon } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import RequireAuth from '@/components/layout/RequireAuth';
import { useAuth } from '@/contexts/AuthContext';
import { iniciais } from '@/lib/format';

export interface AbaBiblioteca { id: string; rotulo: string; Icon: LucideIcon; badge?: number }

export default function LibraryShell({ abas, ativa, onChange, children }: { abas: AbaBiblioteca[]; ativa: string; onChange: (id: string) => void; children: ReactNode }) {
  const { usuario, logout } = useAuth();
  const router = useRouter();
  const sair = () => { logout(); router.push('/'); };
  const cls = (a: boolean) => `flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition ${a ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`;

  return (
    <RequireAuth perfil="funcionario">
      <div className="min-h-screen lg:pl-72">
        <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col bg-navy p-5 lg:flex">
          <div className="mb-2" onClick={() => onChange('resumo')}><Logo claro href="/biblioteca" /></div>
          <p className="mb-6 ml-1 mt-3 text-xs font-semibold text-sol">Painel da biblioteca</p>
          <nav aria-label="Seções da biblioteca" className="flex flex-1 flex-col">
            <ul className="space-y-1">
              {abas.map((a) => (
                <li key={a.id}>
                  <button onClick={() => onChange(a.id)} className={cls(ativa === a.id)} aria-current={ativa === a.id ? 'page' : undefined}>
                    <a.Icon className="h-5 w-5" aria-hidden /><span className="flex-1 text-left">{a.rotulo}</span>
                    {!!a.badge && <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-sol px-1.5 text-xs font-bold text-navy">{a.badge}</span>}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              {usuario && (
                <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-agua text-sm font-bold text-navy" aria-hidden>{iniciais(usuario.nome)}</span>
                  <div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{usuario.nome}</p><p className="text-xs text-slate-400">Funcionário(a) da biblioteca</p></div>
                </div>
              )}
              <button className={cls(false)} onClick={sair}><LogOut className="h-5 w-5" aria-hidden />Sair</button>
            </div>
          </nav>
        </aside>

        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white lg:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <div onClick={() => onChange('resumo')}><Logo href="/biblioteca" mostrarSubtitulo={false} /></div>
            <button onClick={sair} className="flex min-h-[40px] items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-navy hover:bg-slate-100"><LogOut className="h-4 w-4" />Sair</button>
          </div>
          <nav aria-label="Seções da biblioteca (celular)" className="flex gap-1 overflow-x-auto px-3 pb-2">
            {abas.map((a) => (
              <button key={a.id} onClick={() => onChange(a.id)} aria-current={ativa === a.id ? 'page' : undefined}
                className={`flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold ${ativa === a.id ? 'bg-navy text-white' : 'bg-slate-100 text-ink'}`}>
                {a.rotulo}{!!a.badge && <span className="rounded-full bg-sol px-1.5 text-xs font-bold text-navy">{a.badge}</span>}
              </button>
            ))}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-10">{children}</main>
      </div>
    </RequireAuth>
  );
}
