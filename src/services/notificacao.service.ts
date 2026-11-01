import { atualizar, buscar, KEYS } from '@/lib/storage';
import { gerarId } from '@/lib/format';
import type { Notificacao, TipoNotificacao } from '@/types/notificacao';

export function listarNotificacoes(): Notificacao[] {
  return buscar<Notificacao[]>(KEYS.notificacoes, []);
}

export interface NovaNotificacao {
  usuarioId: string;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  comunicadoId?: string;
}

export function criarNotificacoes(itens: NovaNotificacao[]): void {
  if (itens.length === 0) return;
  const agora = new Date().toISOString();
  const novas: Notificacao[] = itens.map((i) => ({ ...i, id: gerarId('n'), criadoEm: agora, lida: false }));
  atualizar<Notificacao[]>(KEYS.notificacoes, [], (atual) => [...novas, ...atual]);
}

export function marcarComoLida(id: string): void {
  atualizar<Notificacao[]>(KEYS.notificacoes, [], (l) => l.map((n) => (n.id === id ? { ...n, lida: true } : n)));
}

export function marcarTodasComoLidas(usuarioId: string): void {
  atualizar<Notificacao[]>(KEYS.notificacoes, [], (l) =>
    l.map((n) => (n.usuarioId === usuarioId ? { ...n, lida: true } : n)),
  );
}
