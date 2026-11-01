export type TipoComunicado = 'PERDIDO' | 'ENCONTRADO';

export type StatusComunicado =
  | 'PUBLICADO'
  | 'AGUARDANDO_ENTREGA'
  | 'ENTREGA_ATRASADA'
  | 'RECEBIDO_BIBLIOTECA'
  | 'DISPONIVEL_RETIRADA'
  | 'EM_PROCESSO_DEVOLUCAO'
  | 'DEVOLVIDO'
  | 'ENCERRADO';

export const STATUS_LABEL: Record<StatusComunicado, string> = {
  PUBLICADO: 'Publicado',
  AGUARDANDO_ENTREGA: 'Aguardando entrega',
  ENTREGA_ATRASADA: 'Entrega atrasada',
  RECEBIDO_BIBLIOTECA: 'Recebido pela biblioteca',
  DISPONIVEL_RETIRADA: 'Disponível para retirada',
  EM_PROCESSO_DEVOLUCAO: 'Em processo de devolução',
  DEVOLVIDO: 'Devolvido',
  ENCERRADO: 'Encerrado',
};

export const TIPO_LABEL: Record<TipoComunicado, string> = { PERDIDO: 'Perdido', ENCONTRADO: 'Encontrado' };

export const CATEGORIAS = [
  'Eletrônicos',
  'Material escolar',
  'Acessórios',
  'Documentos',
  'Garrafas e utensílios',
  'Outros',
] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export const LOCAIS = [
  'Biblioteca',
  'Bloco de salas',
  'Laboratório de informática',
  'Cantina',
  'Corredor principal',
  'Área de convivência',
  'Estacionamento',
  'Quadra poliesportiva',
  'Outro local',
] as const;

export interface HistoricoItem {
  em: string;
  texto: string;
  por: string;
}

export interface Recebimento {
  funcionarioId: string;
  funcionarioNome: string;
  em: string;
  observacoes: string;
}

export interface Destinacao {
  tipo: string;
  analise: string;
  funcionarioNome: string;
  em: string;
}

export interface Comunicado {
  id: string;
  tipo: TipoComunicado;
  titulo: string;
  categoria: Categoria;
  /** Informação pública */
  resumoPublico: string;
  /** Informações privadas: somente biblioteca e autor */
  descricaoPrivada: string;
  caracteristicasPrivadas: string;
  imagem?: string;
  local: string;
  dataOcorrido: string;
  status: StatusComunicado;
  autorId: string;
  autorNome: string;
  autorMatricula: string;
  criadoEm: string;
  prazoEntrega?: string;
  avisoPrazoEnviado?: boolean;
  recebimento?: Recebimento;
  permanenciaAte?: string;
  destinacao?: Destinacao;
  historico: HistoricoItem[];
}

export type StatusSolicitacao = 'PENDENTE' | 'APROVADA' | 'REPROVADA' | 'DEVOLVIDA';

export interface Solicitacao {
  id: string;
  comunicadoId: string;
  alunoId: string;
  alunoNome: string;
  alunoMatricula: string;
  criadoEm: string;
  status: StatusSolicitacao;
  parecer?: string;
  analisadoPor?: string;
  analisadoEm?: string;
  devolvidoEm?: string;
}

export interface Feriado {
  data: string; // AAAA-MM-DD
  nome: string;
}

export interface RegistroHistorico {
  id: string;
  em: string;
  funcionario: string;
  acao: string;
  comunicadoId?: string;
  detalhe: string;
}
