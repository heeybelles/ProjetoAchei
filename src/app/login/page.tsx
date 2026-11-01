'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { KeyRound, RotateCcw } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';
import Alert from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input, SenhaInput } from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';

const DEMOS = [
  { rotulo: 'Aluno', email: 'aluno@fatec.edu.br', senha: 'aluno123' },
  { rotulo: 'Funcionário (biblioteca)', email: 'biblioteca@fatec.edu.br', senha: 'biblioteca123' },
];

export default function LoginPage() {
  const { usuario, login, recarregar } = useAuth();
  const { restaurar } = useData();
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(true);
  const [erros, setErros] = useState<{ email?: string; senha?: string; geral?: string }>({});
  const [carregando, setCarregando] = useState(false);
  const [esqueci, setEsqueci] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState('');
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    if (usuario) router.replace(usuario.perfil === 'funcionario' ? '/biblioteca' : '/home');
  }, [usuario, router]);

  function entrar(e: FormEvent) {
    e.preventDefault();
    const er: typeof erros = {};
    if (!email.trim()) er.email = 'Informe seu email institucional.';
    else if (!/^\S+@\S+\.\S+$/.test(email)) er.email = 'Digite um email válido.';
    if (!senha) er.senha = 'Informe sua senha.';
    setErros(er);
    if (Object.keys(er).length) return;
    setCarregando(true);
    const r = login(email, senha, lembrar);
    setCarregando(false);
    if (!r.ok) setErros({ geral: r.erro });
  }

  function restaurarDados() {
    restaurar(); recarregar();
    toast('sucesso', 'Dados de demonstração restaurados.');
  }

  return (
    <AuthLayout titulo="Que bom ter você por aqui!" subtitulo="Entre na sua conta para acompanhar seus comunicados e encontrar seus objetos.">
      <form onSubmit={entrar} className="space-y-5" noValidate>
        {erros.geral && <Alert tipo="erro">{erros.geral}</Alert>}
        <Input label="Email institucional" type="email" autoComplete="email" placeholder="nome@fatec.edu.br" value={email} onChange={(e) => setEmail(e.target.value)} erro={erros.email} />
        <SenhaInput label="Senha" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} erro={erros.senha} />
        <div className="flex items-center justify-between gap-3">
          <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={lembrar} onChange={(e) => setLembrar(e.target.checked)} className="h-4 w-4 rounded border-slate-300 accent-brand" />Lembrar acesso
          </label>
          <button type="button" onClick={() => { setEsqueci(true); setEnviado(false); }} className="text-sm font-semibold text-brand hover:underline">Esqueci minha senha</button>
        </div>
        <Button type="submit" cheio tamanho="lg" carregando={carregando}>Entrar</Button>
      </form>

      <p className="mt-6 text-center text-sm text-suave">Ainda não tem conta? <Link href="/cadastro" className="font-semibold text-brand hover:underline">Criar conta</Link></p>

      <section className="mt-8 rounded-2xl border border-sol/50 bg-sol-soft p-4" aria-label="Credenciais de demonstração">
        <h2 className="flex items-center gap-2 text-sm font-bold !text-sol-dark"><KeyRound className="h-4 w-4" aria-hidden />Credenciais de demonstração</h2>
        <ul className="mt-3 space-y-2">
          {DEMOS.map((d) => (
            <li key={d.email} className="flex items-center justify-between gap-3 rounded-xl bg-white p-3 text-sm">
              <div className="min-w-0"><p className="font-semibold text-ink">{d.rotulo}</p><p className="truncate text-xs text-suave">{d.email} · {d.senha}</p></div>
              <Button tamanho="sm" variante="secundario" onClick={() => { setEmail(d.email); setSenha(d.senha); setErros({}); }}>Preencher</Button>
            </li>
          ))}
        </ul>
        <button onClick={restaurarDados} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sol-dark hover:underline"><RotateCcw className="h-3.5 w-3.5" aria-hidden />Restaurar dados de demonstração</button>
      </section>

      <Modal aberto={esqueci} onClose={() => setEsqueci(false)} titulo="Recuperar senha" descricao="Funcionalidade simulada para demonstração."
        rodape={enviado ? <Button onClick={() => setEsqueci(false)}>Entendi</Button> : <><Button variante="secundario" onClick={() => setEsqueci(false)}>Cancelar</Button><Button disabled={!/^\S+@\S+\.\S+$/.test(emailRecuperacao)} onClick={() => setEnviado(true)}>Enviar instruções</Button></>}>
        {enviado ? <Alert tipo="sucesso" titulo="Instruções enviadas (simulação)">Se o email estiver cadastrado, você receberia um link para redefinir a senha. Nesta demonstração, nenhum email é enviado.</Alert>
          : <Input label="Email institucional" type="email" value={emailRecuperacao} onChange={(e) => setEmailRecuperacao(e.target.value)} placeholder="nome@fatec.edu.br" />}
      </Modal>
    </AuthLayout>
  );
}
