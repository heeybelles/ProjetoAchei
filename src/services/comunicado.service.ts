import { atualizar, buscar, KEYS, salvar } from '@/lib/storage';
import { calcularPrazoEntrega } from '@/lib/business-days';
import { gerarId } from '@/lib/format';
import { criarNotificacoes, type NovaNotificacao } from '@/services/notificacao.service';
import type { UsuarioPublico } from '@/types/auth';
import type {
  Categoria, Comunicado, Feriado, Solicitacao, TipoComunicado,
} from '@/types/comunicado';

export const listarComunicados = () => buscar<Comunicado[]>(KEYS.comunicados, []);
export const listarSolicitacoes = () => buscar<Solicitacao[]>(KEYS.solicitacoes, []);
export const listarFeriados = () => buscar<Feriado[]>(KEYS.feriados, []);
const datasFeriados = () => listarFeriados().map((f) => f.data);

export interface NovoComunicado {
  tipo: TipoComunicado;
  titulo: string;
  categoria: Categoria;
  resumoPublico: string;
  descricaoPrivada: string;
  caracteristicasPrivadas: string;
  local: string;
  dataOcorrido: string;
  imagem?: string;
}

const palavras = (t: string) => t.toLowerCase().split(/[^a-zà-ú]+/).filter((p) => p.length >= 4);

export function criarComunicado(
  input: NovoComunicado, autor: UsuarioPublico,
): { ok: true; comunicado: Comunicado } | { ok: false; erro: string } {
  const agora = new Date();
  const encontrado = input.tipo === 'ENCONTRADO';
  const criadoEm = agora.toISOString();
  const c: Comunicado = {
    ...input,
    id: gerarId('c'),
    status: encontrado ? 'AGUARDANDO_ENTREGA' : 'PUBLICADO',
    autorId: autor.id,
    autorNome: autor.nome,
    autorMatricula: autor.matricula,
    criadoEm,
    prazoEntrega: encontrado ? calcularPrazoEntrega(agora, datasFeriados()).toISOString() : undefined,
    historico: [{ em: criadoEm, texto: 'Comunicado publicado', por: autor.nome }],
  };
  const lista = [c, ...listarComunicados()];
  if (!salvar(KEYS.comunicados, lista)) {
    return { ok: false, erro: 'Não foi possível salvar. O armazenamento do navegador está cheio; tente uma imagem menor.' };
  }

  const notifs: NovaNotificacao[] = [{
    usuarioId: autor.id, tipo: 'comunicado', comunicadoId: c.id, titulo: 'Comunicado publicado',
    mensagem: encontrado
      ? `Seu comunicado "${c.titulo}" foi publicado. Entregue o objeto na biblioteca em até 3 dias úteis.`
      : `Seu comunicado "${c.titulo}" foi publicado com sucesso.`,
  }];

  // Possível correspondência: tipo oposto, mesma categoria e ao menos uma palavra em comum no título.
  const pc = palavras(c.titulo);
  listarComunicados().forEach((o) => {
    if (o.id === c.id || o.tipo === c.tipo || o.categoria !== c.categoria || o.autorId === autor.id) return;
    if (['DEVOLVIDO', 'ENCERRADO'].includes(o.status)) return;
    if (!palavras(o.titulo).some((p) => pc.includes(p))) return;
    const perdido = c.tipo === 'PERDIDO' ? c : o;
    const achado = c.tipo === 'PERDIDO' ? o : c;
    notifs.push({
      usuarioId: perdido.autorId, tipo: 'correspondencia', comunicadoId: achado.id,
      titulo: 'Possível correspondência',
      mensagem: `Um objeto encontrado parece corresponder ao seu comunicado "${perdido.titulo}". Consulte os detalhes e procure a biblioteca.`,
    });
  });
  criarNotificacoes(notifs);
  return { ok: true, comunicado: c };
}

export function solicitarReivindicacao(
  comunicadoId: string, aluno: UsuarioPublico,
): { ok: true } | { ok: false; erro: string } {
  const c = listarComunicados().find((x) => x.id === comunicadoId);
  if (!c) return { ok: false, erro: 'Comunicado não encontrado.' };
  if (c.autorId === aluno.id) return { ok: false, erro: 'Você registrou este comunicado e não pode reivindicá-lo.' };
  const abertas = listarSolicitacoes().some(
    (s) => s.comunicadoId === c.id && s.alunoId === aluno.id && ['PENDENTE', 'APROVADA'].includes(s.status),
  );
  if (abertas) return { ok: false, erro: 'Você já possui uma solicitação em andamento para este objeto.' };

  const agora = new Date().toISOString();
  const s: Solicitacao = {
    id: gerarId('s'), comunicadoId: c.id, alunoId: aluno.id, alunoNome: aluno.nome,
    alunoMatricula: aluno.matricula, criadoEm: agora, status: 'PENDENTE',
  };
  atualizar<Solicitacao[]>(KEYS.solicitacoes, [], (l) => [s, ...l]);
  atualizar<Comunicado[]>(KEYS.comunicados, [], (l) =>
    l.map((x) =>
      x.id === c.id
        ? {
            ...x,
            status: ['RECEBIDO_BIBLIOTECA', 'DISPONIVEL_RETIRADA'].includes(x.status) ? 'EM_PROCESSO_DEVOLUCAO' : x.status,
            historico: [...x.historico, { em: agora, texto: 'Solicitação de retirada registrada', por: aluno.nome }],
          }
        : x,
    ),
  );
  criarNotificacoes([{
    usuarioId: aluno.id, tipo: 'solicitacao', comunicadoId: c.id, titulo: 'Solicitação registrada',
    mensagem: `Sua solicitação de retirada de "${c.titulo}" foi registrada. Procure a biblioteca para validar a propriedade.`,
  }]);
  return { ok: true };
}

const DIA_MS = 24 * 3600 * 1000;

/** Marca entregas atrasadas e avisa prazos próximos. Pode ser chamada várias vezes sem duplicar avisos. */
export function atualizarPrazos(agora = new Date()): void {
  const notifs: NovaNotificacao[] = [];
  let mudou = false;
  const nova = listarComunicados().map((c) => {
    if (c.tipo !== 'ENCONTRADO' || c.status !== 'AGUARDANDO_ENTREGA' || !c.prazoEntrega) return c;
    const limite = new Date(c.prazoEntrega).getTime();
    if (agora.getTime() > limite) {
      mudou = true;
      notifs.push({
        usuarioId: c.autorId, tipo: 'prazo', comunicadoId: c.id, titulo: 'Prazo de entrega vencido',
        mensagem: `O prazo para entregar "${c.titulo}" à biblioteca venceu. Leve o objeto o quanto antes.`,
      });
      return {
        ...c, status: 'ENTREGA_ATRASADA' as const,
        historico: [...c.historico, { em: agora.toISOString(), texto: 'Prazo de entrega vencido', por: 'Sistema' }],
      };
    }
    if (!c.avisoPrazoEnviado && limite - agora.getTime() <= DIA_MS) {
      mudou = true;
      notifs.push({
        usuarioId: c.autorId, tipo: 'prazo', comunicadoId: c.id, titulo: 'Prazo de entrega próximo',
        mensagem: `Falta pouco para o prazo de entrega de "${c.titulo}". Leve o objeto à biblioteca.`,
      });
      return { ...c, avisoPrazoEnviado: true };
    }
    return c;
  });
  if (mudou) {
    salvar(KEYS.comunicados, nova);
    criarNotificacoes(notifs);
  }
}
