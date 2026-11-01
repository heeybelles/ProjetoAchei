'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { inicializarDadosDemo, restaurarDadosDemo } from '@/lib/storage';
import { atualizarPrazos, listarComunicados, listarSolicitacoes } from '@/services/comunicado.service';
import { listarFeriadosOrdenados, listarHistoricoBiblioteca } from '@/services/biblioteca.service';
import { listarNotificacoes } from '@/services/notificacao.service';
import type { Comunicado, Feriado, RegistroHistorico, Solicitacao } from '@/types/comunicado';
import type { Notificacao } from '@/types/notificacao';

interface DataCtx {
  pronto: boolean;
  comunicados: Comunicado[];
  solicitacoes: Solicitacao[];
  notificacoes: Notificacao[];
  feriados: Feriado[];
  historico: RegistroHistorico[];
  /** Relê os dados do armazenamento local. Chame após qualquer alteração. */
  atualizar: () => void;
  restaurar: () => void;
}

const Ctx = createContext<DataCtx | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [pronto, setPronto] = useState(false);
  const [dados, setDados] = useState({
    comunicados: [] as Comunicado[], solicitacoes: [] as Solicitacao[], notificacoes: [] as Notificacao[],
    feriados: [] as Feriado[], historico: [] as RegistroHistorico[],
  });

  const atualizar = useCallback(() => {
    setDados({
      comunicados: listarComunicados(),
      solicitacoes: listarSolicitacoes(),
      notificacoes: listarNotificacoes(),
      feriados: listarFeriadosOrdenados(),
      historico: listarHistoricoBiblioteca(),
    });
  }, []);

  useEffect(() => {
    inicializarDadosDemo();
    const ciclo = () => { atualizarPrazos(); atualizar(); };
    ciclo();
    setPronto(true);
    const timer = setInterval(ciclo, 60_000);
    const aoMudarOutraAba = () => atualizar();
    window.addEventListener('storage', aoMudarOutraAba);
    return () => { clearInterval(timer); window.removeEventListener('storage', aoMudarOutraAba); };
  }, [atualizar]);

  const valor = useMemo<DataCtx>(
    () => ({
      pronto, ...dados, atualizar,
      restaurar: () => { restaurarDadosDemo(); atualizarPrazos(); atualizar(); },
    }),
    [pronto, dados, atualizar],
  );
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useData(): DataCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useData deve ser usado dentro de DataProvider');
  return c;
}
