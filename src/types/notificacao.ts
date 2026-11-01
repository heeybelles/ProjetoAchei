export type TipoNotificacao = 'comunicado' | 'prazo' | 'recebimento' | 'correspondencia' | 'solicitacao';

export const TIPO_NOTIFICACAO_LABEL: Record<TipoNotificacao, string> = {
  comunicado: 'Comunicados',
  prazo: 'Prazos',
  recebimento: 'Biblioteca',
  correspondencia: 'Correspondências',
  solicitacao: 'Solicitações',
};

export interface Notificacao {
  id: string;
  usuarioId: string;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  criadoEm: string;
  lida: boolean;
  comunicadoId?: string;
}
