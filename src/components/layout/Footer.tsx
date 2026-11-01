import Link from 'next/link';
import { Clock, Mail, MapPin } from 'lucide-react';
import Logo from '@/components/layout/Logo';

export default function Footer() {
  return (
    <footer className="bg-navy text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Logo claro />
          <p className="mt-4 max-w-xs text-sm">Projeto acadêmico demonstrativo para organizar os achados e perdidos da FATEC.</p>
          <p className="mt-3 text-sm font-semibold text-white">Perdeu ou encontrou? A gente te ajuda!</p>
        </div>
        <div>
          <h2 className="text-sm font-bold text-white">Navegação</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/">Início</Link></li>
            <li><Link className="hover:text-white" href="/#como-funciona">Como funciona</Link></li>
            <li><Link className="hover:text-white" href="/comunicados">Comunicados</Link></li>
            <li><Link className="hover:text-white" href="/login">Entrar</Link></li>
            <li><Link className="hover:text-white" href="/cadastro">Criar conta</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold text-white">Biblioteca FATEC</h2>
          <ul className="mt-3 space-y-2.5 text-sm">
            <li className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />Segunda a sexta, das 8h às 21h</li>
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />Bloco A, térreo (endereço demonstrativo)</li>
            <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />biblioteca@fatec.edu.br</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-slate-400">
        © 2026 Projeto Achei — Faculdade de Tecnologia (FATEC). Dados e contatos fictícios, apenas para demonstração.
      </div>
    </footer>
  );
}
