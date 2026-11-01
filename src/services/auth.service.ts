/**
 * Autenticação SIMULADA, apenas para demonstração.
 * Não oferece segurança real. Use somente dados fictícios.
 */
import { atualizar, buscar, KEYS, lerSessao, limparSessao, salvarSessao } from '@/lib/storage';
import { gerarId } from '@/lib/format';
import type { Usuario, UsuarioPublico } from '@/types/auth';

export type Resultado<T = undefined> = { ok: true; dados: T } | { ok: false; erro: string };

const DOMINIOS = ['fatec.edu.br', 'fatec.sp.gov.br'];

export const emailInstitucional = (email: string) =>
  DOMINIOS.some((d) => email.trim().toLowerCase().endsWith(`@${d}`));

export const semSenha = ({ senha, ...resto }: Usuario): UsuarioPublico => {
  void senha;
  return resto;
};

export function listarUsuarios(): Usuario[] {
  return buscar<Usuario[]>(KEYS.usuarios, []);
}

export function obterSessao(): UsuarioPublico | null {
  const id = lerSessao();
  if (!id) return null;
  const u = listarUsuarios().find((x) => x.id === id);
  return u ? semSenha(u) : null;
}

export function autenticar(email: string, senha: string, lembrar: boolean): Resultado<UsuarioPublico> {
  const u = listarUsuarios().find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
  if (!u || u.senha !== senha) return { ok: false, erro: 'Email ou senha incorretos. Confira os dados e tente novamente.' };
  salvarSessao(u.id, lembrar);
  return { ok: true, dados: semSenha(u) };
}

export interface DadosCadastro {
  nome: string; email: string; matricula: string; curso: string; senha: string;
}

export function registrar(d: DadosCadastro): Resultado<UsuarioPublico> {
  if (listarUsuarios().some((u) => u.email.toLowerCase() === d.email.trim().toLowerCase())) {
    return { ok: false, erro: 'Já existe uma conta com este email.' };
  }
  const novo: Usuario = {
    id: gerarId('u'), nome: d.nome.trim(), email: d.email.trim().toLowerCase(), matricula: d.matricula.trim(),
    curso: d.curso, senha: d.senha, perfil: 'aluno', // cadastro livre só cria alunos
    criadoEm: new Date().toISOString(),
  };
  atualizar<Usuario[]>(KEYS.usuarios, [], (l) => [...l, novo]);
  return { ok: true, dados: semSenha(novo) };
}

export function encerrarSessao(): void {
  limparSessao();
}

export function atualizarPerfil(id: string, campos: { nome: string; curso: string }): Resultado<UsuarioPublico> {
  let atualizado: Usuario | undefined;
  atualizar<Usuario[]>(KEYS.usuarios, [], (l) =>
    l.map((u) => (u.id === id ? (atualizado = { ...u, nome: campos.nome.trim(), curso: campos.curso }) : u)),
  );
  return atualizado ? { ok: true, dados: semSenha(atualizado) } : { ok: false, erro: 'Usuário não encontrado.' };
}

export function alterarSenha(id: string, atual: string, nova: string): Resultado {
  const u = listarUsuarios().find((x) => x.id === id);
  if (!u) return { ok: false, erro: 'Usuário não encontrado.' };
  if (u.senha !== atual) return { ok: false, erro: 'A senha atual está incorreta.' };
  atualizar<Usuario[]>(KEYS.usuarios, [], (l) => l.map((x) => (x.id === id ? { ...x, senha: nova } : x)));
  return { ok: true, dados: undefined };
}
