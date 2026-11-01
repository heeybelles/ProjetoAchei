'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import NovoComunicadoWizard from '@/components/forms/NovoComunicadoWizard';
import type { TipoComunicado } from '@/types/comunicado';

interface WizardCtx { abrir: (tipo?: TipoComunicado) => void }
const Ctx = createContext<WizardCtx>({ abrir: () => undefined });

/** Controla o formulário de cadastro de comunicados, acessível de qualquer tela. */
export function WizardProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [tipoInicial, setTipoInicial] = useState<TipoComunicado | undefined>();

  const abrir = useCallback((tipo?: TipoComunicado) => {
    if (!usuario) { router.push('/login'); return; }
    if (usuario.perfil !== 'aluno') { router.push('/biblioteca'); return; }
    setTipoInicial(tipo);
    setAberto(true);
  }, [usuario, router]);

  const valor = useMemo(() => ({ abrir }), [abrir]);
  return (
    <Ctx.Provider value={valor}>
      {children}
      {aberto && <NovoComunicadoWizard tipoInicial={tipoInicial} onClose={() => setAberto(false)} />}
    </Ctx.Provider>
  );
}

export const useWizard = () => useContext(Ctx);
