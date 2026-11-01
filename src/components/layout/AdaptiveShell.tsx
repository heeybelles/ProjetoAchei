'use client';

import type { ReactNode } from 'react';
import AppShell from '@/components/layout/AppShell';
import Footer from '@/components/layout/Footer';
import PublicHeader from '@/components/layout/PublicHeader';
import { useAuth } from '@/contexts/AuthContext';

/** Páginas públicas que também aparecem dentro da área do aluno quando há sessão. */
export default function AdaptiveShell({ children }: { children: ReactNode }) {
  const { usuario, carregando } = useAuth();
  if (!carregando && usuario?.perfil === 'aluno') return <AppShell>{children}</AppShell>;
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:py-12">{children}</main>
      <Footer />
    </div>
  );
}
