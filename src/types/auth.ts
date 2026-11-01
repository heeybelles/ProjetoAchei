export type Perfil = 'aluno' | 'funcionario';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  matricula: string;
  curso: string;
  /** Senha fictícia, apenas para demonstração. Nunca use senhas reais. */
  senha: string;
  perfil: Perfil;
  criadoEm: string;
}

export type UsuarioPublico = Omit<Usuario, 'senha'>;

export const CURSOS = [
  'Análise e Desenvolvimento de Sistemas',
  'Gestão Empresarial',
  'Logística',
  'Desenvolvimento de Software Multiplataforma',
  'Gestão da Produção Industrial',
  'Comércio Exterior',
] as const;
