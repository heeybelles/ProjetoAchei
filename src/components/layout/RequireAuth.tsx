'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { Perfil } from '@/types/auth';

/** Proteção DEMONSTRATIVA de rotas (não oferece segurança real). */
export default function RequireAuth({ perfil, children }: { perfil: Perfil; children: ReactNode }) {
  const { usuario, carregando } = useAuth();
  const router = useRouter();
  const permitido = !!usuario && usuario.perfil === perfil;

  useEffect(() => {
    if (carregando) return;
    if (!usuario) router.replace('/login');
    else if (usuario.perfil !== perfil) router.replace(usuario.perfil === 'funcionario' ? '/biblioteca' : '/home');
  }, [carregando, usuario, perfil, router]);

  if (!permitido) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Carregando">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }
  return <>{children}</>;
}
