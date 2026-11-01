/**
 * Camada centralizada de armazenamento (localStorage).
 * Nenhum componente deve acessar window.localStorage diretamente.
 * Todas as funções são seguras no servidor (retornam o valor padrão).
 */
import { gerarDadosDemo } from '@/lib/mock-data';

const PREFIXO = 'achei:v1:';

export const KEYS = {
  usuarios: 'usuarios',
  sessao: 'sessao',
  comunicados: 'comunicados',
  notificacoes: 'notificacoes',
  solicitacoes: 'solicitacoes',
  feriados: 'feriados',
  historico: 'historico',
  inicializado: 'inicializado',
} as const;
export type ChaveArmazenamento = (typeof KEYS)[keyof typeof KEYS];

const noNavegador = () => typeof window !== 'undefined';

export function buscar<T>(chave: ChaveArmazenamento, padrao: T): T {
  if (!noNavegador()) return padrao;
  try {
    const bruto = window.localStorage.getItem(PREFIXO + chave);
    return bruto ? (JSON.parse(bruto) as T) : padrao;
  } catch {
    return padrao;
  }
}

/** Retorna false quando não foi possível salvar (ex.: armazenamento cheio). */
export function salvar<T>(chave: ChaveArmazenamento, valor: T): boolean {
  if (!noNavegador()) return false;
  try {
    window.localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

export function atualizar<T>(chave: ChaveArmazenamento, padrao: T, fn: (atual: T) => T): T {
  const novo = fn(buscar(chave, padrao));
  salvar(chave, novo);
  return novo;
}

export function remover(chave: ChaveArmazenamento): void {
  if (!noNavegador()) return;
  window.localStorage.removeItem(PREFIXO + chave);
}

/** Cria os dados de demonstração na primeira visita. */
export function inicializarDadosDemo(): void {
  if (!noNavegador() || buscar<boolean>(KEYS.inicializado, false)) return;
  semear();
}

/** Apaga tudo e recria os dados iniciais. */
export function restaurarDadosDemo(): void {
  if (!noNavegador()) return;
  Object.values(KEYS).forEach((k) => remover(k));
  window.sessionStorage.removeItem(PREFIXO + KEYS.sessao);
  semear();
}

function semear(): void {
  const d = gerarDadosDemo(new Date());
  salvar(KEYS.usuarios, d.usuarios);
  salvar(KEYS.comunicados, d.comunicados);
  salvar(KEYS.solicitacoes, d.solicitacoes);
  salvar(KEYS.notificacoes, d.notificacoes);
  salvar(KEYS.feriados, d.feriados);
  salvar(KEYS.historico, d.historico);
  salvar(KEYS.inicializado, true);
}

/* Sessão: "lembrar acesso" usa localStorage; caso contrário, sessionStorage. */
export function lerSessao(): string | null {
  if (!noNavegador()) return null;
  try {
    return (
      window.sessionStorage.getItem(PREFIXO + KEYS.sessao) ?? window.localStorage.getItem(PREFIXO + KEYS.sessao)
    );
  } catch {
    return null;
  }
}

export function salvarSessao(usuarioId: string, lembrar: boolean): void {
  if (!noNavegador()) return;
  limparSessao();
  try {
    (lembrar ? window.localStorage : window.sessionStorage).setItem(PREFIXO + KEYS.sessao, usuarioId);
  } catch {
    /* sem armazenamento disponível */
  }
}

export function limparSessao(): void {
  if (!noNavegador()) return;
  try {
    window.sessionStorage.removeItem(PREFIXO + KEYS.sessao);
    window.localStorage.removeItem(PREFIXO + KEYS.sessao);
  } catch {
    /* ignorar */
  }
}
