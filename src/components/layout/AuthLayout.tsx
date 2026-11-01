import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/layout/Logo';

export default function AuthLayout({ titulo, subtitulo, children, lateral }: { titulo: string; subtitulo: string; children: ReactNode; lateral?: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <aside className="hidden flex-col justify-between bg-navy p-12 text-white lg:flex">
        <Logo claro />
        <div>
          <p className="text-3xl font-extrabold leading-tight">Perdeu ou encontrou? A gente te ajuda!</p>
          <p className="mt-3 max-w-sm text-slate-300">Registre objetos, acompanhe prazos e recupere o que é seu com segurança.</p>
          {lateral}
        </div>
        <p className="text-xs text-slate-400">Projeto acadêmico demonstrativo — FATEC.</p>
      </aside>
      <main className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden"><Logo /></div>
          <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-suave hover:text-navy"><ArrowLeft className="h-4 w-4" aria-hidden />Voltar ao início</Link>
          <h1 className="text-3xl font-extrabold">{titulo}</h1>
          <p className="mt-2 text-suave">{subtitulo}</p>
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
