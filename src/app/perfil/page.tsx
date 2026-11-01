'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { CalendarDays, FileSearch, FileText, GraduationCap, IdCard, KeyRound, LogOut, Mail, Save, User } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import ComunicadoDetalhes from '@/components/comunicados/ComunicadoDetalhes';
import PrazoTag from '@/components/comunicados/PrazoTag';
import CategoriaIcone from '@/components/comunicados/CategoriaIcone';
import Alert from '@/components/ui/Alert';
import { StatusBadge, TipoBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { Input, Select, SenhaInput } from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import Pagination from '@/components/ui/Pagination';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { useWizard } from '@/contexts/WizardContext';
import { useHash } from '@/hooks/useHash';
import { usePaginacao } from '@/hooks/usePaginacao';
import { formatarData, formatarDataHora, iniciais } from '@/lib/format';
import { CURSOS } from '@/types/auth';
import { STATUS_LABEL, type Comunicado, type StatusComunicado } from '@/types/comunicado';

function Dados() {
  const { usuario, editarPerfil, trocarSenha, logout } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(usuario?.nome ?? '');
  const [curso, setCurso] = useState(usuario?.curso ?? '');
  const [erroNome, setErroNome] = useState('');
  const [senhaAberta, setSenhaAberta] = useState(false);
  const [s, setS] = useState({ atual: '', nova: '', conf: '' });
  const [erroSenha, setErroSenha] = useState('');
  if (!usuario) return null;

  function salvar(e: FormEvent) {
    e.preventDefault();
    if (nome.trim().split(/\s+/).length < 2) { setErroNome('Informe nome e sobrenome.'); return; }
    const r = editarPerfil({ nome, curso });
    if (r.ok) { toast('sucesso', 'Perfil atualizado com sucesso.'); setEditando(false); setErroNome(''); }
    else toast('erro', r.erro);
  }
  function alterarSenha() {
    if (s.nova.length < 6) return setErroSenha('A nova senha deve ter no mínimo 6 caracteres.');
    if (s.nova !== s.conf) return setErroSenha('A confirmação não coincide com a nova senha.');
    const r = trocarSenha(s.atual, s.nova);
    if (!r.ok) return setErroSenha(r.erro);
    toast('sucesso', 'Senha alterada (simulação de demonstração).');
    setSenhaAberta(false); setS({ atual: '', nova: '', conf: '' }); setErroSenha('');
  }

  const info = (Icon: typeof Mail, rotulo: string, valor: string) => (
    <div className="flex items-start gap-3"><span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-navy"><Icon className="h-4 w-4" aria-hidden /></span>
      <div className="min-w-0"><dt className="text-xs font-semibold text-suave">{rotulo}</dt><dd className="break-words text-sm font-medium text-ink">{valor}</dd></div></div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <section className="card flex flex-col items-center p-6 text-center">
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand to-navy text-3xl font-extrabold text-white" aria-hidden>{iniciais(usuario.nome)}</span>
        <h2 className="mt-4 text-xl font-bold">{usuario.nome}</h2>
        <p className="text-sm text-suave">{usuario.curso}</p>
        <div className="mt-6 flex w-full flex-col gap-2">
          <Button variante="secundario" icone={<KeyRound className="h-4 w-4" />} onClick={() => setSenhaAberta(true)}>Alterar senha</Button>
          <Button variante="secundario" icone={<LogOut className="h-4 w-4" />} onClick={() => { logout(); router.push('/'); }}>Sair da conta</Button>
        </div>
      </section>

      <section className="card p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Dados pessoais</h2>
          {!editando && <Button variante="fantasma" tamanho="sm" onClick={() => { setNome(usuario.nome); setCurso(usuario.curso); setEditando(true); }}>Editar</Button>}
        </div>
        {editando ? (
          <form onSubmit={salvar} className="mt-5 space-y-4" noValidate>
            <Input label="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} erro={erroNome} />
            <Select label="Curso" value={curso} onChange={(e) => setCurso(e.target.value)}>{CURSOS.map((c) => <option key={c}>{c}</option>)}</Select>
            <p className="text-xs text-suave">Email institucional e matrícula não podem ser alterados.</p>
            <div className="flex gap-2"><Button type="submit" icone={<Save className="h-4 w-4" />}>Salvar alterações</Button><Button variante="secundario" onClick={() => setEditando(false)}>Cancelar</Button></div>
          </form>
        ) : (
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            {info(User, 'Nome', usuario.nome)}{info(Mail, 'Email institucional', usuario.email)}
            {info(IdCard, 'Matrícula', usuario.matricula)}{info(GraduationCap, 'Curso', usuario.curso)}
            {info(CalendarDays, 'Cadastrado em', formatarData(usuario.criadoEm))}
          </dl>
        )}
      </section>

      <Modal aberto={senhaAberta} onClose={() => setSenhaAberta(false)} titulo="Alterar senha" descricao="Simulação para demonstração: use apenas senhas fictícias."
        rodape={<><Button variante="secundario" onClick={() => setSenhaAberta(false)}>Cancelar</Button><Button onClick={alterarSenha}>Salvar nova senha</Button></>}>
        <div className="space-y-4">
          {erroSenha && <Alert tipo="erro">{erroSenha}</Alert>}
          <SenhaInput label="Senha atual" value={s.atual} onChange={(e) => setS({ ...s, atual: e.target.value })} />
          <SenhaInput label="Nova senha" value={s.nova} onChange={(e) => setS({ ...s, nova: e.target.value })} />
          <SenhaInput label="Confirmar nova senha" value={s.conf} onChange={(e) => setS({ ...s, conf: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}

function Meus() {
  const { usuario } = useAuth();
  const { comunicados } = useData();
  const { abrir } = useWizard();
  const [status, setStatus] = useState('');
  const [tipo, setTipo] = useState('');
  const [aberto, setAberto] = useState<Comunicado | null>(null);
  const meus = useMemo(() => comunicados.filter((c) => c.autorId === usuario?.id && (!status || c.status === status) && (!tipo || c.tipo === tipo)).sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)), [comunicados, usuario, status, tipo]);
  const { pagina, setPagina, total, visiveis } = usePaginacao(meus, 5);

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <select aria-label="Filtrar por status" className="input w-full sm:w-auto" value={status} onChange={(e) => { setStatus(e.target.value); setPagina(1); }}>
          <option value="">Todos os status</option>{(Object.keys(STATUS_LABEL) as StatusComunicado[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
        <select aria-label="Filtrar por tipo" className="input w-full sm:w-auto" value={tipo} onChange={(e) => { setTipo(e.target.value); setPagina(1); }}>
          <option value="">Perdidos e encontrados</option><option value="PERDIDO">Perdidos</option><option value="ENCONTRADO">Encontrados</option>
        </select>
      </div>
      <div className="mt-4">
        {meus.length === 0 ? (
          <EmptyState icone={FileSearch} titulo="Nenhum comunicado por aqui" texto="Registre um objeto perdido ou encontrado para acompanhá-lo nesta lista." acao={<Button onClick={() => abrir()}>Cadastrar comunicado</Button>} />
        ) : (
          <ul className="space-y-3">
            {visiveis.map((c) => (
              <li key={c.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <CategoriaIcone categoria={c.categoria} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-navy">{c.titulo} <span className="font-normal text-suave">— {c.tipo === 'ENCONTRADO' ? 'encontrado' : 'perdido'}</span></h3>
                  <p className="mt-0.5 text-xs text-suave">Publicado em {formatarDataHora(c.criadoEm)}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2"><TipoBadge tipo={c.tipo} /><StatusBadge status={c.status} /><PrazoTag comunicado={c} /></div>
                </div>
                <Button variante="secundario" tamanho="sm" onClick={() => setAberto(c)}>Ver detalhes</Button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Pagination pagina={pagina} total={total} onChange={setPagina} />
      <ComunicadoDetalhes comunicado={aberto} onClose={() => setAberto(null)} modo="autor" />
    </div>
  );
}

function Conteudo() {
  const hash = useHash();
  const [aba, setAba] = useState<'dados' | 'comunicados'>('dados');
  useEffect(() => { setAba(hash === 'comunicados' ? 'comunicados' : 'dados'); }, [hash]);
  const trocar = (a: 'dados' | 'comunicados') => { setAba(a); window.history.replaceState(null, '', a === 'dados' ? '/perfil' : '/perfil#comunicados'); window.dispatchEvent(new HashChangeEvent('hashchange')); };
  const tab = (id: 'dados' | 'comunicados', rotulo: string, Icon: typeof User) => (
    <button role="tab" aria-selected={aba === id} onClick={() => trocar(id)} className={`flex min-h-[44px] items-center gap-2 border-b-2 px-4 text-sm font-semibold transition ${aba === id ? 'border-brand text-brand' : 'border-transparent text-suave hover:text-ink'}`}><Icon className="h-4 w-4" aria-hidden />{rotulo}</button>
  );
  return (
    <div>
      <h1 className="text-3xl font-extrabold">Perfil</h1>
      <p className="mt-1 text-suave">Consulte seus dados e acompanhe seus comunicados.</p>
      <div role="tablist" className="mt-6 flex border-b border-slate-200">{tab('dados', 'Meus dados', User)}{tab('comunicados', 'Meus comunicados', FileText)}</div>
      <div className="mt-6">{aba === 'dados' ? <Dados /> : <Meus />}</div>
    </div>
  );
}

export default function PerfilPage() {
  return <AppShell><Conteudo /></AppShell>;
}
