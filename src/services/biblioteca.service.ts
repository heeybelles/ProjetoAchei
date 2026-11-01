import { atualizar, buscar, KEYS } from '@/lib/storage';
import { gerarId } from '@/lib/format';
import { DIAS_AVISO_DESTINACAO, DIAS_PERMANENCIA } from '@/lib/mock-data';
import { listarComunicados, listarSolicitacoes } from '@/services/comunicado.service';
import { criarNotificacoes } from '@/services/notificacao.service';
import type { UsuarioPublico } from '@/types/auth';
import type { Comunicado, Feriado, RegistroHistorico, Solicitacao, StatusComunicado } from '@/types/comunicado';

const DIA_MS = 24 * 3600 * 1000;
export const listarHistoricoBiblioteca = () => buscar<RegistroHistorico[]>(KEYS.historico, []);

function registrar(func: UsuarioPublico, acao: string, detalhe: string, comunicadoId?: string) {
  const r: RegistroHistorico = { id: gerarId('h'), em: new Date().toISOString(), funcionario: func.nome, acao, detalhe, comunicadoId };
  atualizar<RegistroHistorico[]>(KEYS.historico, [], (l) => [r, ...l]);
}

function alterar(id: string, func: UsuarioPublico, texto: string, mudar: (c: Comunicado) => Comunicado) {
  atualizar<Comunicado[]>(KEYS.comunicados, [], (l) =>
    l.map((c) => (c.id === id ? { ...mudar(c), historico: [...c.historico, { em: new Date().toISOString(), texto, por: func.nome }] } : c)),
  );
}

type R = { ok: true } | { ok: false; erro: string };
const obter = (id: string) => listarComunicados().find((c) => c.id === id);

export function confirmarRecebimento(id: string, func: UsuarioPublico, observacoes: string): R {
  const c = obter(id);
  if (!c || !['AGUARDANDO_ENTREGA', 'ENTREGA_ATRASADA'].includes(c.status)) return { ok: false, erro: 'Este objeto não está aguardando entrega.' };
  const agora = new Date();
  alterar(id, func, 'Recebimento físico confirmado pela biblioteca', (x) => ({
    ...x,
    status: 'RECEBIDO_BIBLIOTECA',
    recebimento: { funcionarioId: func.id, funcionarioNome: func.nome, em: agora.toISOString(), observacoes: observacoes.trim() },
    permanenciaAte: new Date(agora.getTime() + DIAS_PERMANENCIA * DIA_MS).toISOString(),
  }));
  // Se já havia solicitação pendente, o processo de devolução começa.
  if (listarSolicitacoes().some((s) => s.comunicadoId === id && s.status === 'PENDENTE')) {
    alterar(id, func, 'Processo de devolução iniciado', (x) => ({ ...x, status: 'EM_PROCESSO_DEVOLUCAO' }));
  }
  registrar(func, 'Recebimento confirmado', `${c.titulo}${observacoes.trim() ? `: ${observacoes.trim()}` : ''}`, id);
  criarNotificacoes([{
    usuarioId: c.autorId, tipo: 'recebimento', comunicadoId: id, titulo: 'Recebimento confirmado',
    mensagem: `A biblioteca confirmou o recebimento do objeto "${c.titulo}". Obrigado por ajudar!`,
  }]);
  return { ok: true };
}

export function disponibilizarRetirada(id: string, func: UsuarioPublico): R {
  const c = obter(id);
  if (!c || c.status !== 'RECEBIDO_BIBLIOTECA') return { ok: false, erro: 'O objeto precisa estar recebido pela biblioteca.' };
  alterar(id, func, 'Disponibilizado para retirada', (x) => ({ ...x, status: 'DISPONIVEL_RETIRADA' }));
  registrar(func, 'Disponibilizado para retirada', c.titulo, id);
  return { ok: true };
}

export function encerrarComunicado(id: string, func: UsuarioPublico, motivo: string): R {
  const c = obter(id);
  if (!c || c.status !== 'PUBLICADO') return { ok: false, erro: 'Somente comunicados publicados podem ser encerrados aqui.' };
  alterar(id, func, `Comunicado encerrado: ${motivo}`, (x) => ({ ...x, status: 'ENCERRADO' }));
  registrar(func, 'Comunicado encerrado', `${c.titulo}: ${motivo}`, id);
  return { ok: true };
}

export function analisarSolicitacao(
  solicitacaoId: string, resultado: 'APROVADA' | 'REPROVADA', parecer: string, func: UsuarioPublico,
): R {
  const s = listarSolicitacoes().find((x) => x.id === solicitacaoId);
  if (!s || s.status !== 'PENDENTE') return { ok: false, erro: 'Esta solicitação já foi analisada.' };
  const c = obter(s.comunicadoId);
  if (!c || c.status !== 'EM_PROCESSO_DEVOLUCAO') return { ok: false, erro: 'O objeto ainda não está sob custódia da biblioteca.' };
  const agora = new Date().toISOString();
  atualizar<Solicitacao[]>(KEYS.solicitacoes, [], (l) =>
    l.map((x) => (x.id === s.id ? { ...x, status: resultado, parecer, analisadoPor: func.nome, analisadoEm: agora } : x)),
  );
  const restantes = listarSolicitacoes().some((x) => x.comunicadoId === c.id && ['PENDENTE', 'APROVADA'].includes(x.status));
  const proximo: StatusComunicado = restantes ? 'EM_PROCESSO_DEVOLUCAO' : 'DISPONIVEL_RETIRADA';
  alterar(c.id, func, `Solicitação de ${s.alunoNome} ${resultado === 'APROVADA' ? 'aprovada' : 'reprovada'}`, (x) => ({ ...x, status: proximo }));
  registrar(func, resultado === 'APROVADA' ? 'Propriedade validada' : 'Reivindicação reprovada', `${c.titulo} — ${s.alunoNome}. ${parecer}`, c.id);
  criarNotificacoes([{
    usuarioId: s.alunoId, tipo: 'solicitacao', comunicadoId: c.id, titulo: 'Solicitação atualizada',
    mensagem: resultado === 'APROVADA'
      ? `Sua solicitação para "${c.titulo}" foi aprovada. Procure a biblioteca com um documento de identificação para retirar o objeto.`
      : `Sua solicitação para "${c.titulo}" não foi aprovada na validação. Procure a biblioteca para mais informações.`,
  }]);
  return { ok: true };
}

export function registrarDevolucao(solicitacaoId: string, func: UsuarioPublico, observacoes: string): R {
  const s = listarSolicitacoes().find((x) => x.id === solicitacaoId);
  if (!s || s.status !== 'APROVADA') return { ok: false, erro: 'A solicitação precisa estar aprovada.' };
  const c = obter(s.comunicadoId);
  if (!c) return { ok: false, erro: 'Comunicado não encontrado.' };
  const agora = new Date().toISOString();
  atualizar<Solicitacao[]>(KEYS.solicitacoes, [], (l) =>
    l.map((x) => {
      if (x.id === s.id) return { ...x, status: 'DEVOLVIDA' as const, devolvidoEm: agora, parecer: [x.parecer, observacoes].filter(Boolean).join(' | ') };
      if (x.comunicadoId === c.id && x.status === 'PENDENTE') {
        return { ...x, status: 'REPROVADA' as const, parecer: 'Objeto devolvido a outro solicitante.', analisadoPor: func.nome, analisadoEm: agora };
      }
      return x;
    }),
  );
  alterar(c.id, func, `Objeto devolvido a ${s.alunoNome}`, (x) => ({ ...x, status: 'DEVOLVIDO' }));
  registrar(func, 'Devolução registrada', `${c.titulo} devolvido a ${s.alunoNome}`, c.id);
  criarNotificacoes([
    { usuarioId: s.alunoId, tipo: 'solicitacao', comunicadoId: c.id, titulo: 'Objeto devolvido', mensagem: `A devolução de "${c.titulo}" foi registrada pela biblioteca.` },
    { usuarioId: c.autorId, tipo: 'recebimento', comunicadoId: c.id, titulo: 'Objeto devolvido ao dono', mensagem: `O objeto "${c.titulo}" que você encontrou foi devolvido ao proprietário. Obrigado!` },
  ]);
  return { ok: true };
}

export const OPCOES_DESTINACAO = [
  'Doação a instituição parceira (após aprovação da coordenação)',
  'Entrega à coordenação para reaproveitamento',
  'Descarte conforme norma institucional',
  'Encaminhamento para reciclagem',
] as const;

export function registrarDestinacao(id: string, func: UsuarioPublico, tipo: string, analise: string): R {
  const c = obter(id);
  if (!c || !['RECEBIDO_BIBLIOTECA', 'DISPONIVEL_RETIRADA'].includes(c.status)) return { ok: false, erro: 'Objeto indisponível para destinação.' };
  alterar(id, func, `Destinação registrada: ${tipo}`, (x) => ({
    ...x, status: 'ENCERRADO', destinacao: { tipo, analise, funcionarioNome: func.nome, em: new Date().toISOString() },
  }));
  registrar(func, 'Destinação registrada', `${c.titulo}: ${tipo}`, id);
  return { ok: true };
}

export function prorrogarPermanencia(id: string, func: UsuarioPublico, dias: number): R {
  const c = obter(id);
  if (!c?.permanenciaAte) return { ok: false, erro: 'Objeto não encontrado.' };
  const base = Math.max(new Date(c.permanenciaAte).getTime(), Date.now());
  alterar(id, func, `Permanência prorrogada em ${dias} dias`, (x) => ({ ...x, permanenciaAte: new Date(base + dias * DIA_MS).toISOString() }));
  registrar(func, 'Permanência prorrogada', `${c.titulo}: +${dias} dias`, id);
  return { ok: true };
}

export function adicionarFeriado(data: string, nome: string): R {
  if (listarFeriadosOrdenados().some((f) => f.data === data)) return { ok: false, erro: 'Já existe um feriado nesta data.' };
  atualizar<Feriado[]>(KEYS.feriados, [], (l) => [...l, { data, nome: nome.trim() }]);
  return { ok: true };
}

export function removerFeriado(data: string): void {
  atualizar<Feriado[]>(KEYS.feriados, [], (l) => l.filter((f) => f.data !== data));
}

export const listarFeriadosOrdenados = () =>
  buscar<Feriado[]>(KEYS.feriados, []).slice().sort((a, b) => a.data.localeCompare(b.data));

export type SituacaoPermanencia = 'vencida' | 'proxima' | 'regular';
export function situacaoPermanencia(c: Comunicado, agora = new Date()): SituacaoPermanencia {
  if (!c.permanenciaAte) return 'regular';
  const resta = new Date(c.permanenciaAte).getTime() - agora.getTime();
  if (resta < 0) return 'vencida';
  return resta <= DIAS_AVISO_DESTINACAO * DIA_MS ? 'proxima' : 'regular';
}

export function calcularIndicadores(comunicados: Comunicado[], solicitacoes: Solicitacao[]) {
  const nosStatus = (...s: StatusComunicado[]) => comunicados.filter((c) => s.includes(c.status)).length;
  return {
    pendentes: nosStatus('PUBLICADO'),
    aguardando: nosStatus('AGUARDANDO_ENTREGA', 'ENTREGA_ATRASADA'),
    recebidos: nosStatus('RECEBIDO_BIBLIOTECA', 'DISPONIVEL_RETIRADA', 'EM_PROCESSO_DEVOLUCAO'),
    solicitacoes: solicitacoes.filter((s) => s.status === 'PENDENTE').length,
    vencidos: nosStatus('ENTREGA_ATRASADA'),
  };
}
