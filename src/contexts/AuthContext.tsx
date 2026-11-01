'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as auth from '@/services/auth.service';
import { inicializarDadosDemo } from '@/lib/storage';
import type { UsuarioPublico } from '@/types/auth';

interface AuthCtx {
  usuario: UsuarioPublico | null;
  carregando: boolean;
  login: (email: string, senha: string, lembrar: boolean) => auth.Resultado<UsuarioPublico>;
  cadastrar: (d: auth.DadosCadastro) => auth.Resultado<UsuarioPublico>;
  logout: () => void;
  editarPerfil: (campos: { nome: string; curso: string }) => auth.Resultado<UsuarioPublico>;
  trocarSenha: (atual: string, nova: string) => auth.Resultado;
  recarregar: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioPublico | null>(null);
  const [carregando, setCarregando] = useState(true);

  const recarregar = useCallback(() => {
    inicializarDadosDemo();
    setUsuario(auth.obterSessao());
  }, []);

  // A sessão só é lida depois da montagem, evitando erros de hidratação.
  useEffect(() => {
    recarregar();
    setCarregando(false);
  }, [recarregar]);

  const valor = useMemo<AuthCtx>(
    () => ({
      usuario,
      carregando,
      login: (email, senha, lembrar) => {
        const r = auth.autenticar(email, senha, lembrar);
        if (r.ok) setUsuario(r.dados);
        return r;
      },
      cadastrar: (d) => auth.registrar(d),
      logout: () => {
        auth.encerrarSessao();
        setUsuario(null);
      },
      editarPerfil: (campos) => {
        const r = auth.atualizarPerfil(usuario?.id ?? '', campos);
        if (r.ok) setUsuario(r.dados);
        return r;
      },
      trocarSenha: (atual, nova) => auth.alterarSenha(usuario?.id ?? '', atual, nova),
      recarregar,
    }),
    [usuario, carregando, recarregar],
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return c;
}
