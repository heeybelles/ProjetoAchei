/**
 * Dados fictícios de demonstração. Nenhum dado real é utilizado.
 * As datas são geradas em relação ao momento da inicialização, para que
 * prazos e vencimentos sempre façam sentido na apresentação.
 */
import type { Usuario } from '@/types/auth';
import type { Comunicado, Feriado, HistoricoItem, RegistroHistorico, Solicitacao } from '@/types/comunicado';
import type { Notificacao } from '@/types/notificacao';
import { calcularPrazoEntrega, chaveData } from '@/lib/business-days';

export const ID_ALUNO_DEMO = 'u-aluno';
export const ID_FUNCIONARIO_DEMO = 'u-func';
export const DIAS_PERMANENCIA = 90;
export const DIAS_AVISO_DESTINACAO = 15;

export const FERIADOS_PADRAO: Feriado[] = [
  { data: '2026-11-02', nome: 'Finados' },
  { data: '2026-11-20', nome: 'Consciência Negra' },
  { data: '2026-12-25', nome: 'Natal' },
  { data: '2027-01-01', nome: 'Confraternização Universal' },
];

export function gerarDadosDemo(agora: Date) {
  const H = 3600 * 1000;
  const D = 24 * H;
  const ago = (dias: number, horas = 0) => new Date(agora.getTime() - dias * D - horas * H).toISOString();
  const depois = (iso: string, dias: number) => new Date(new Date(iso).getTime() + dias * D).toISOString();
  const feriadosDatas = FERIADOS_PADRAO.map((f) => f.data);

  const usuarios: Usuario[] = [
    { id: ID_ALUNO_DEMO, nome: 'Maria Souza', email: 'aluno@fatec.edu.br', matricula: '2024010231', curso: 'Análise e Desenvolvimento de Sistemas', senha: 'aluno123', perfil: 'aluno', criadoEm: ago(120) },
    { id: ID_FUNCIONARIO_DEMO, nome: 'Carlos Mendes', email: 'biblioteca@fatec.edu.br', matricula: 'FUNC-0042', curso: 'Biblioteca', senha: 'biblioteca123', perfil: 'funcionario', criadoEm: ago(400) },
    { id: 'u-func2', nome: 'Fernanda Ribeiro', email: 'biblioteca2@fatec.edu.br', matricula: 'FUNC-0057', curso: 'Biblioteca', senha: 'biblioteca123', perfil: 'funcionario', criadoEm: ago(300) },
    { id: 'u-joao', nome: 'João Pedro Almeida', email: 'joao.almeida@fatec.edu.br', matricula: '2023020118', curso: 'Logística', senha: 'aluno123', perfil: 'aluno', criadoEm: ago(200) },
    { id: 'u-ana', nome: 'Ana Beatriz Lima', email: 'ana.lima@fatec.edu.br', matricula: '2024030076', curso: 'Gestão Empresarial', senha: 'aluno123', perfil: 'aluno', criadoEm: ago(150) },
    { id: 'u-rafael', nome: 'Rafael Costa', email: 'rafael.costa@fatec.edu.br', matricula: '2022010455', curso: 'Desenvolvimento de Software Multiplataforma', senha: 'aluno123', perfil: 'aluno', criadoEm: ago(260) },
  ];
  const u = (id: string) => usuarios.find((x) => x.id === id)!;
  const func = u(ID_FUNCIONARIO_DEMO);

  type Base = Omit<Comunicado, 'autorId' | 'autorNome' | 'autorMatricula' | 'historico' | 'dataOcorrido'> & {
    historico?: HistoricoItem[];
  };
  const mk = (autorId: string, c: Base): Comunicado => {
    const autor = u(autorId);
    const historico: HistoricoItem[] = [{ em: c.criadoEm, texto: 'Comunicado publicado', por: autor.nome }];
    if (c.recebimento) historico.push({ em: c.recebimento.em, texto: 'Recebimento físico confirmado pela biblioteca', por: c.recebimento.funcionarioNome });
    return {
      ...c,
      autorId,
      autorNome: autor.nome,
      autorMatricula: autor.matricula,
      dataOcorrido: chaveData(new Date(c.criadoEm)),
      historico: c.historico ?? historico,
    };
  };
  const rec = (dias: number, horas: number, obs: string) => ({
    funcionarioId: func.id, funcionarioNome: func.nome, em: ago(dias, horas), observacoes: obs,
  });
  const prazo = (criado: string) => calcularPrazoEntrega(new Date(criado), feriadosDatas).toISOString();
  const perm = (dias: number) => depois(ago(dias), DIAS_PERMANENCIA);

  const comunicados: Comunicado[] = [
    mk('u-joao', {
      id: 'c-001', tipo: 'ENCONTRADO', titulo: 'Garrafa térmica', categoria: 'Garrafas e utensílios',
      resumoPublico: 'Garrafa térmica encontrada próxima às mesas de estudo da biblioteca.',
      descricaoPrivada: 'Garrafa de aço inox azul-petróleo, 500 ml, com pequeno amassado na base.',
      caracteristicasPrivadas: 'Adesivo de gato na lateral; fita azul amarrada na tampa.',
      local: 'Biblioteca', status: 'EM_PROCESSO_DEVOLUCAO', criadoEm: ago(6), prazoEntrega: prazo(ago(6)),
      recebimento: rec(5, 0, 'Objeto entregue em bom estado e guardado no armário 2.'), permanenciaAte: perm(5),
    }),
    mk(ID_ALUNO_DEMO, {
      id: 'c-002', tipo: 'PERDIDO', titulo: 'Carteira', categoria: 'Documentos',
      resumoPublico: 'Carteira perdida no bloco de salas, possivelmente entre as salas 3 e 5.',
      descricaoPrivada: 'Carteira de couro sintético preta com documentos pessoais e cartão de transporte.',
      caracteristicasPrivadas: 'Chaveiro de astronauta; cartão de estudante dentro.',
      local: 'Bloco de salas', status: 'PUBLICADO', criadoEm: ago(2),
    }),
    mk(ID_ALUNO_DEMO, {
      id: 'c-003', tipo: 'ENCONTRADO', titulo: 'Fone de ouvido', categoria: 'Eletrônicos',
      resumoPublico: 'Fone de ouvido sem fio encontrado no laboratório de informática.',
      descricaoPrivada: 'Fone over-ear branco com almofadas cinza, sem estojo.',
      caracteristicasPrivadas: 'Pequena marca de caneta azul na haste direita.',
      local: 'Laboratório de informática', status: 'AGUARDANDO_ENTREGA', criadoEm: ago(3),
      prazoEntrega: new Date(agora.getTime() + 20 * H).toISOString(),
    }),
    mk(ID_ALUNO_DEMO, {
      id: 'c-004', tipo: 'ENCONTRADO', titulo: 'Estojo', categoria: 'Material escolar',
      resumoPublico: 'Estojo encontrado no laboratório de informática.',
      descricaoPrivada: 'Estojo de tecido cinza com zíper, contendo canetas e uma régua de 30 cm.',
      caracteristicasPrivadas: 'Iniciais "L.M." bordadas no zíper; régua com um canto quebrado.',
      local: 'Laboratório de informática', status: 'RECEBIDO_BIBLIOTECA', criadoEm: ago(8), prazoEntrega: prazo(ago(8)),
      recebimento: rec(6, 0, 'Conferido e catalogado.'), permanenciaAte: perm(6),
    }),
    mk('u-rafael', {
      id: 'c-005', tipo: 'ENCONTRADO', titulo: 'Chave', categoria: 'Acessórios',
      resumoPublico: 'Chave encontrada no corredor principal.',
      descricaoPrivada: 'Chaveiro com duas chaves pequenas e uma chave de carro com controle.',
      caracteristicasPrivadas: 'Chaveiro de couro marrom com a letra "T".',
      local: 'Corredor principal', status: 'AGUARDANDO_ENTREGA', criadoEm: ago(9), prazoEntrega: prazo(ago(9)),
    }),
    mk('u-ana', {
      id: 'c-006', tipo: 'PERDIDO', titulo: 'Mochila', categoria: 'Acessórios',
      resumoPublico: 'Mochila perdida na área de convivência.',
      descricaoPrivada: 'Mochila preta de notebook com bolso frontal e refletivo lateral.',
      caracteristicasPrivadas: 'Chaveiro de capivara no zíper principal; caderno de capa verde dentro.',
      local: 'Área de convivência', status: 'PUBLICADO', criadoEm: ago(1),
    }),
    mk('u-rafael', {
      id: 'c-007', tipo: 'ENCONTRADO', titulo: 'Carregador portátil', categoria: 'Eletrônicos',
      resumoPublico: 'Carregador portátil encontrado no bloco de salas.',
      descricaoPrivada: 'Power bank preto de 10.000 mAh, com cabo USB-C enrolado.',
      caracteristicasPrivadas: 'Etiqueta com o nome "Mari" na parte de trás.',
      local: 'Bloco de salas', status: 'EM_PROCESSO_DEVOLUCAO', criadoEm: ago(7), prazoEntrega: prazo(ago(7)),
      recebimento: rec(6, 2, 'Entregue com cabo.'), permanenciaAte: perm(6),
    }),
    mk('u-ana', {
      id: 'c-008', tipo: 'ENCONTRADO', titulo: 'Guarda-chuva', categoria: 'Acessórios',
      resumoPublico: 'Guarda-chuva encontrado perto da cantina.',
      descricaoPrivada: 'Guarda-chuva dobrável azul-marinho com cabo emborrachado.',
      caracteristicasPrivadas: 'Pequeno adesivo de bandeira do Brasil no cabo.',
      local: 'Cantina', status: 'DEVOLVIDO', criadoEm: ago(20), prazoEntrega: prazo(ago(20)),
      recebimento: rec(19, 0, 'Catalogado.'), permanenciaAte: perm(19),
    }),
    mk('u-joao', {
      id: 'c-009', tipo: 'ENCONTRADO', titulo: 'Casaco', categoria: 'Outros',
      resumoPublico: 'Casaco encontrado no estacionamento.',
      descricaoPrivada: 'Casaco de moletom cinza, tamanho M, com capuz.',
      caracteristicasPrivadas: 'Bolso esquerdo com costura refeita; etiqueta com nome apagado.',
      local: 'Estacionamento', status: 'RECEBIDO_BIBLIOTECA', criadoEm: ago(110), prazoEntrega: prazo(ago(110)),
      recebimento: rec(100, 0, 'Sem reivindicação até o momento.'), permanenciaAte: perm(100),
    }),
    mk('u-rafael', {
      id: 'c-010', tipo: 'ENCONTRADO', titulo: 'Caderno universitário', categoria: 'Material escolar',
      resumoPublico: 'Caderno universitário encontrado no bloco de salas.',
      descricaoPrivada: 'Caderno de 10 matérias, capa vermelha, com anotações de cálculo.',
      caracteristicasPrivadas: 'Desenho de um foguete na primeira página; marcador amarelo preso na espiral.',
      local: 'Bloco de salas', status: 'DISPONIVEL_RETIRADA', criadoEm: ago(85), prazoEntrega: prazo(ago(85)),
      recebimento: rec(78, 0, 'Guardado na prateleira de materiais.'), permanenciaAte: perm(78),
    }),
    mk('u-joao', {
      id: 'c-011', tipo: 'PERDIDO', titulo: 'Pen drive', categoria: 'Eletrônicos',
      resumoPublico: 'Pen drive perdido no laboratório de informática.',
      descricaoPrivada: 'Pen drive de 32 GB preto com tampa deslizante, contém trabalhos de Logística.',
      caracteristicasPrivadas: 'Fita colorida amarrada no furo; pasta chamada "TCC_rascunho".',
      local: 'Laboratório de informática', status: 'PUBLICADO', criadoEm: ago(4),
    }),
    mk(ID_ALUNO_DEMO, {
      id: 'c-012', tipo: 'ENCONTRADO', titulo: 'Agenda', categoria: 'Material escolar',
      resumoPublico: 'Agenda encontrada na biblioteca.',
      descricaoPrivada: 'Agenda 2026 de capa dura azul, com anotações de provas.',
      caracteristicasPrivadas: 'Elástico preto; adesivo de estrela na contracapa.',
      local: 'Biblioteca', status: 'AGUARDANDO_ENTREGA', criadoEm: ago(8),
      prazoEntrega: new Date(agora.getTime() - 2 * D).toISOString(),
    }),
    mk('u-rafael', {
      id: 'c-013', tipo: 'ENCONTRADO', titulo: 'Carteira', categoria: 'Documentos',
      resumoPublico: 'Carteira encontrada no bloco de salas.',
      descricaoPrivada: 'Carteira preta de couro sintético com cartão de transporte e documento com foto.',
      caracteristicasPrivadas: 'Chaveiro de astronauta preso ao zíper.',
      local: 'Bloco de salas', status: 'RECEBIDO_BIBLIOTECA', criadoEm: ago(0, 6), prazoEntrega: prazo(ago(0, 6)),
      recebimento: rec(0, 3, 'Entregue pelo próprio aluno.'), permanenciaAte: perm(0),
    }),
  ];

  const solicitacoes: Solicitacao[] = [
    { id: 's-001', comunicadoId: 'c-007', alunoId: ID_ALUNO_DEMO, alunoNome: 'Maria Souza', alunoMatricula: '2024010231', criadoEm: ago(3), status: 'PENDENTE' },
    { id: 's-002', comunicadoId: 'c-001', alunoId: 'u-ana', alunoNome: 'Ana Beatriz Lima', alunoMatricula: '2024030076', criadoEm: ago(2), status: 'PENDENTE' },
    {
      id: 's-003', comunicadoId: 'c-008', alunoId: 'u-joao', alunoNome: 'João Pedro Almeida', alunoMatricula: '2023020118',
      criadoEm: ago(18), status: 'DEVOLVIDA', parecer: 'Descreveu corretamente a cor e o adesivo. Documento conferido.',
      analisadoPor: func.nome, analisadoEm: ago(17, 4), devolvidoEm: ago(17),
    },
  ];

  const n = (
    id: string, usuarioId: string, tipo: Notificacao['tipo'], titulo: string, mensagem: string,
    criadoEm: string, lida: boolean, comunicadoId?: string,
  ): Notificacao => ({ id, usuarioId, tipo, titulo, mensagem, criadoEm, lida, comunicadoId });

  const notificacoes: Notificacao[] = [
    n('n-001', ID_ALUNO_DEMO, 'correspondencia', 'Possível correspondência', 'Um objeto encontrado parece corresponder ao seu comunicado "Carteira". Consulte os detalhes e procure a biblioteca.', ago(0, 2), false, 'c-013'),
    n('n-002', ID_ALUNO_DEMO, 'solicitacao', 'Solicitação em análise', 'Sua solicitação de retirada de "Carregador portátil" está em análise pela biblioteca.', ago(3), false, 'c-007'),
    n('n-003', ID_ALUNO_DEMO, 'comunicado', 'Comunicado publicado', 'Seu comunicado "Carteira" foi publicado com sucesso.', ago(2), true, 'c-002'),
    n('n-004', ID_ALUNO_DEMO, 'recebimento', 'Recebimento confirmado', 'A biblioteca confirmou o recebimento do objeto "Estojo".', ago(6), true, 'c-004'),
    n('n-005', ID_ALUNO_DEMO, 'comunicado', 'Comunicado publicado', 'Seu comunicado "Fone de ouvido" foi publicado com sucesso. Entregue o objeto na biblioteca em até 3 dias úteis.', ago(3), true, 'c-003'),
    n('n-006', 'u-ana', 'solicitacao', 'Solicitação registrada', 'Sua solicitação de retirada de "Garrafa térmica" foi registrada e será analisada pela biblioteca.', ago(2), false, 'c-001'),
    n('n-007', 'u-joao', 'solicitacao', 'Solicitação atualizada', 'O objeto "Guarda-chuva" foi devolvido ao proprietário.', ago(17), true, 'c-008'),
  ];

  const hist = (id: string, dias: number, acao: string, comunicadoId: string, detalhe: string): RegistroHistorico => ({
    id, em: ago(dias), funcionario: func.nome, acao, comunicadoId, detalhe,
  });
  const historico: RegistroHistorico[] = [
    hist('h-001', 0.12, 'Recebimento confirmado', 'c-013', 'Carteira recebida e catalogada.'),
    hist('h-002', 5, 'Recebimento confirmado', 'c-001', 'Garrafa térmica guardada no armário 2.'),
    hist('h-003', 6, 'Recebimento confirmado', 'c-004', 'Estojo conferido e catalogado.'),
    hist('h-004', 17, 'Devolução registrada', 'c-008', 'Guarda-chuva devolvido a João Pedro Almeida.'),
  ];

  return { usuarios, comunicados, solicitacoes, notificacoes, feriados: FERIADOS_PADRAO, historico };
}
