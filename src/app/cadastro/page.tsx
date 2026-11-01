'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';
import Alert from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input, Select, SenhaInput } from '@/components/ui/Field';
import { useAuth } from '@/contexts/AuthContext';
import { emailInstitucional } from '@/services/auth.service';
import { CURSOS } from '@/types/auth';

type Campos = 'nome' | 'email' | 'matricula' | 'curso' | 'senha' | 'confirmar';

export default function CadastroPage() {
  const { usuario, cadastrar, login } = useAuth();
  const router = useRouter();
  const [v, setV] = useState<Record<Campos, string>>({ nome: '', email: '', matricula: '', curso: '', senha: '', confirmar: '' });
  const [erros, setErros] = useState<Partial<Record<Campos | 'geral', string>>>({});
  const [concluido, setConcluido] = useState(false);

  useEffect(() => {
    if (usuario && !concluido) router.replace(usuario.perfil === 'funcionario' ? '/biblioteca' : '/home');
  }, [usuario, concluido, router]);

  const set = (k: Campos) => (e: { target: { value: string } }) => setV((x) => ({ ...x, [k]: e.target.value }));

  function enviar(e: FormEvent) {
    e.preventDefault();
    const er: typeof erros = {};
    if (v.nome.trim().split(/\s+/).length < 2) er.nome = 'Informe seu nome completo (nome e sobrenome).';
    if (!v.email.trim()) er.email = 'Informe seu email institucional.';
    else if (!/^\S+@\S+\.\S+$/.test(v.email)) er.email = 'Digite um email válido.';
    else if (!emailInstitucional(v.email)) er.email = 'Use seu email institucional (@fatec.edu.br ou @fatec.sp.gov.br).';
    if (!v.matricula.trim()) er.matricula = 'Informe sua matrícula.';
    else if (!/^\d{6,}$/.test(v.matricula.trim())) er.matricula = 'A matrícula deve ter ao menos 6 números.';
    if (!v.curso) er.curso = 'Selecione seu curso.';
    if (v.senha.length < 6) er.senha = 'A senha deve ter no mínimo 6 caracteres.';
    if (v.confirmar !== v.senha) er.confirmar = 'As senhas não coincidem.';
    setErros(er);
    if (Object.keys(er).length) return;
    const r = cadastrar({ nome: v.nome, email: v.email, matricula: v.matricula, curso: v.curso, senha: v.senha });
    if (!r.ok) { setErros({ geral: r.erro }); return; }
    setConcluido(true);
  }

  function entrarAgora() {
    const r = login(v.email, v.senha, true);
    if (r.ok) router.push('/home');
    else router.push('/login');
  }

  if (concluido) {
    return (
      <AuthLayout titulo="Conta criada!" subtitulo="Seu cadastro foi concluído e você já pode entrar.">
        <div className="flex flex-col items-start gap-5">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-agua-soft text-agua-dark"><CheckCircle2 className="h-8 w-8" aria-hidden /></span>
          <p className="text-sm text-ink">Bem-vindo(a), {v.nome.trim().split(' ')[0]}! Use o botão abaixo para acessar o painel.</p>
          <Button tamanho="lg" cheio onClick={entrarAgora}>Entrar agora</Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout titulo="Crie sua conta" subtitulo="Cadastre-se com seu email institucional para registrar e acompanhar objetos.">
      <form onSubmit={enviar} className="space-y-4" noValidate>
        {erros.geral && <Alert tipo="erro">{erros.geral}</Alert>}
        <Input label="Nome completo" autoComplete="name" value={v.nome} onChange={set('nome')} erro={erros.nome} />
        <Input label="Email institucional" type="email" autoComplete="email" placeholder="nome@fatec.edu.br" value={v.email} onChange={set('email')} erro={erros.email} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Matrícula" inputMode="numeric" value={v.matricula} onChange={set('matricula')} erro={erros.matricula} />
          <Select label="Curso" value={v.curso} onChange={set('curso')} erro={erros.curso}>
            <option value="">Selecione…</option>{CURSOS.map((c) => <option key={c}>{c}</option>)}
          </Select>
        </div>
        <SenhaInput label="Senha" autoComplete="new-password" dica="Mínimo de 6 caracteres. Use uma senha fictícia: esta é uma demonstração." value={v.senha} onChange={set('senha')} erro={erros.senha} />
        <SenhaInput label="Confirmar senha" autoComplete="new-password" value={v.confirmar} onChange={set('confirmar')} erro={erros.confirmar} />
        <Button type="submit" cheio tamanho="lg">Criar minha conta</Button>
      </form>
      <p className="mt-6 text-center text-sm text-suave">Já tem conta? <Link href="/login" className="font-semibold text-brand hover:underline">Entrar</Link></p>
    </AuthLayout>
  );
}
