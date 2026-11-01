'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Eye, EyeOff, PackageCheck, PackageSearch } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Field';
import ImageUpload from '@/components/ui/ImageUpload';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { formatarData, formatarDataHora, hojeISO } from '@/lib/format';
import { criarComunicado, type NovoComunicado } from '@/services/comunicado.service';
import { CATEGORIAS, LOCAIS, type Categoria, type Comunicado, type TipoComunicado } from '@/types/comunicado';

interface Form {
  titulo: string; categoria: Categoria | ''; resumoPublico: string; descricaoPrivada: string;
  caracteristicasPrivadas: string; local: string; dataOcorrido: string; imagem?: string;
}
const vazio: Form = { titulo: '', categoria: '', resumoPublico: '', descricaoPrivada: '', caracteristicasPrivadas: '', local: '', dataOcorrido: hojeISO() };
const ETAPAS = ['Tipo', 'Informações', 'Confirmação', 'Pronto'];

function validar(f: Form): Partial<Record<keyof Form, string>> {
  const e: Partial<Record<keyof Form, string>> = {};
  if (f.titulo.trim().length < 3) e.titulo = 'Informe o nome do objeto (mínimo de 3 letras).';
  if (!f.categoria) e.categoria = 'Escolha uma categoria.';
  if (f.resumoPublico.trim().length < 10) e.resumoPublico = 'Escreva um resumo público de pelo menos 10 caracteres.';
  if (f.descricaoPrivada.trim().length < 10) e.descricaoPrivada = 'Descreva o objeto com pelo menos 10 caracteres.';
  if (!f.local) e.local = 'Informe onde o objeto foi perdido ou encontrado.';
  if (!f.dataOcorrido) e.dataOcorrido = 'Informe a data aproximada.';
  else if (f.dataOcorrido > hojeISO()) e.dataOcorrido = 'A data não pode estar no futuro.';
  return e;
}

export default function NovoComunicadoWizard({ tipoInicial, onClose }: { tipoInicial?: TipoComunicado; onClose: () => void }) {
  const { usuario } = useAuth();
  const { atualizar } = useData();
  const [etapa, setEtapa] = useState(tipoInicial ? 2 : 1);
  const [tipo, setTipo] = useState<TipoComunicado | undefined>(tipoInicial);
  const [form, setForm] = useState<Form>(vazio);
  const [mostrarErros, setMostrarErros] = useState(false);
  const [erroEnvio, setErroEnvio] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [criado, setCriado] = useState<Comunicado | null>(null);

  const erros = useMemo(() => validar(form), [form]);
  const campo = <K extends keyof Form>(k: K) => ({
    value: (form[k] ?? '') as string,
    onChange: (ev: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: ev.target.value })),
    erro: mostrarErros ? erros[k] : undefined,
  });

  function avancar() {
    if (etapa === 1 && !tipo) return;
    if (etapa === 2) {
      setMostrarErros(true);
      if (Object.keys(erros).length > 0) return;
    }
    setEtapa((e) => e + 1);
  }

  function publicar() {
    if (!usuario || !tipo || !form.categoria) return;
    setSalvando(true); setErroEnvio('');
    const dados: NovoComunicado = {
      tipo, titulo: form.titulo.trim(), categoria: form.categoria, resumoPublico: form.resumoPublico.trim(),
      descricaoPrivada: form.descricaoPrivada.trim(), caracteristicasPrivadas: form.caracteristicasPrivadas.trim(),
      local: form.local, dataOcorrido: form.dataOcorrido, imagem: form.imagem,
    };
    const r = criarComunicado(dados, usuario);
    setSalvando(false);
    if (!r.ok) { setErroEnvio(r.erro); return; }
    atualizar();
    setCriado(r.comunicado);
    setEtapa(4);
  }

  function novoRegistro() { setForm({ ...vazio, dataOcorrido: hojeISO() }); setTipo(undefined); setCriado(null); setMostrarErros(false); setEtapa(1); }

  const opcao = (t: TipoComunicado, titulo: string, texto: string, Icon: typeof PackageSearch) => (
    <button type="button" onClick={() => setTipo(t)} aria-pressed={tipo === t}
      className={`flex flex-col items-start gap-2 rounded-2xl border-2 p-5 text-left transition ${tipo === t ? 'border-brand bg-brand-soft' : 'border-slate-200 bg-white hover:border-brand/50'}`}>
      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tipo === t ? 'bg-brand text-white' : 'bg-slate-100 text-navy'}`}><Icon className="h-5 w-5" aria-hidden /></span>
      <span className="text-base font-bold text-navy">{titulo}</span>
      <span className="text-sm text-suave">{texto}</span>
    </button>
  );

  const rodape = etapa === 4 ? (
    <>
      <Button variante="secundario" onClick={novoRegistro}>Registrar outro objeto</Button>
      <Link href="/perfil#comunicados" onClick={onClose} className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark">Ver meus comunicados</Link>
    </>
  ) : (
    <>
      {etapa > 1 && !(etapa === 2 && tipoInicial) && <Button variante="secundario" icone={<ArrowLeft className="h-4 w-4" />} onClick={() => setEtapa((e) => e - 1)}>Voltar</Button>}
      {etapa < 3 && <Button onClick={avancar} disabled={etapa === 1 && !tipo}>Continuar<ArrowRight className="h-4 w-4" /></Button>}
      {etapa === 3 && <Button variante="sucesso" carregando={salvando} onClick={publicar}>Publicar comunicado</Button>}
    </>
  );

  return (
    <Modal aberto onClose={onClose} titulo={etapa === 4 ? 'Tudo certo!' : 'Cadastrar comunicado'} descricao={etapa < 4 ? `Etapa ${etapa} de 3: ${ETAPAS[etapa - 1]}` : undefined} largura="lg" rodape={rodape}>
      {etapa < 4 && (
        <div className="mb-5 flex gap-1.5" aria-hidden>{[1, 2, 3].map((n) => <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= etapa ? 'bg-brand' : 'bg-slate-200'}`} />)}</div>
      )}

      {etapa === 1 && (
        <div>
          <p className="mb-4 text-sm text-suave">O que aconteceu? Escolha uma opção para começar.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {opcao('PERDIDO', 'Perdi um objeto', 'Publique um aviso para que a comunidade e a biblioteca ajudem a encontrar.', PackageSearch)}
            {opcao('ENCONTRADO', 'Encontrei um objeto', 'Registre o achado e entregue o item à biblioteca em até 3 dias úteis.', PackageCheck)}
          </div>
        </div>
      )}

      {etapa === 2 && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nome do objeto" obrigatorio placeholder="Ex.: Garrafa térmica" dica="Use um nome geral, sem detalhes que só o dono saberia." {...campo('titulo')} />
            <Select label="Categoria" obrigatorio {...campo('categoria')}>
              <option value="">Selecione…</option>{CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label={tipo === 'PERDIDO' ? 'Local onde foi perdido' : 'Local onde foi encontrado'} obrigatorio {...campo('local')}>
              <option value="">Selecione…</option>{LOCAIS.map((l) => <option key={l}>{l}</option>)}
            </Select>
            <Input type="date" label="Data aproximada" obrigatorio max={hojeISO()} {...campo('dataOcorrido')} />
          </div>
          <Textarea label="Descrição pública (resumo)" obrigatorio placeholder="Ex.: Garrafa encontrada próxima às mesas de estudo." dica="Aparece para todos. Não inclua cor exata, marcas ou detalhes identificadores." {...campo('resumoPublico')} />
          <fieldset className="space-y-4 rounded-xl border border-brand/25 bg-brand-soft/50 p-4">
            <legend className="px-2 text-sm font-bold text-navy">Informações privadas (somente biblioteca)</legend>
            <Textarea label="Descrição detalhada" obrigatorio placeholder="Cor, marca, estado de conservação, conteúdo…" {...campo('descricaoPrivada')} />
            <Textarea label="Características específicas" placeholder="Adesivos, riscos, marcas pessoais, iniciais…" dica="Ajudam a biblioteca a confirmar quem é o verdadeiro dono." {...campo('caracteristicasPrivadas')} />
            <ImageUpload valor={form.imagem} onChange={(v) => setForm((f) => ({ ...f, imagem: v }))} />
          </fieldset>
        </div>
      )}

      {etapa === 3 && (
        <div className="space-y-4">
          <p className="text-sm text-suave">Confira os dados antes de publicar. Você poderá acompanhar tudo em &quot;Meus comunicados&quot;.</p>
          <section className="rounded-xl border border-slate-200 p-4" aria-label="Informações públicas">
            <h3 className="flex items-center gap-2 text-sm font-bold text-navy"><Eye className="h-4 w-4 text-agua-dark" aria-hidden />Informações públicas (todos podem ver)</h3>
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-xs font-semibold text-suave">Tipo</dt><dd>{tipo === 'PERDIDO' ? 'Objeto perdido' : 'Objeto encontrado'}</dd></div>
              <div><dt className="text-xs font-semibold text-suave">Objeto</dt><dd>{form.titulo}</dd></div>
              <div><dt className="text-xs font-semibold text-suave">Categoria</dt><dd>{form.categoria}</dd></div>
              <div><dt className="text-xs font-semibold text-suave">Local e data</dt><dd>{form.local}, {formatarData(form.dataOcorrido)}</dd></div>
              <div className="sm:col-span-2"><dt className="text-xs font-semibold text-suave">Resumo</dt><dd>{form.resumoPublico}</dd></div>
            </dl>
          </section>
          <section className="rounded-xl border border-brand/25 bg-brand-soft/50 p-4" aria-label="Informações privadas">
            <h3 className="flex items-center gap-2 text-sm font-bold text-navy"><EyeOff className="h-4 w-4 text-brand" aria-hidden />Informações privadas (somente biblioteca)</h3>
            <dl className="mt-3 space-y-3 text-sm">
              <div><dt className="text-xs font-semibold text-suave">Descrição detalhada</dt><dd>{form.descricaoPrivada}</dd></div>
              <div><dt className="text-xs font-semibold text-suave">Características</dt><dd>{form.caracteristicasPrivadas || 'Não informadas'}</dd></div>
              {form.imagem && (
                <div><dt className="text-xs font-semibold text-suave">Fotografia</dt>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <dd><img src={form.imagem} alt="Fotografia privada do objeto" className="mt-1 h-24 w-24 rounded-lg object-cover" /></dd></div>
              )}
            </dl>
          </section>
          {tipo === 'ENCONTRADO' && (
            <Alert tipo="aviso" titulo="Prazo de entrega: 3 dias úteis">Ao publicar, você terá até 3 dias úteis (sem sábados, domingos e feriados) para levar o objeto à biblioteca.</Alert>
          )}
          {erroEnvio && <Alert tipo="erro">{erroEnvio}</Alert>}
        </div>
      )}

      {etapa === 4 && criado && (
        <div className="flex flex-col items-center py-4 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-agua-soft text-agua-dark"><CheckCircle2 className="h-9 w-9" aria-hidden /></span>
          <h3 className="mt-4 text-xl font-bold text-navy">Comunicado publicado com sucesso!</h3>
          <p className="mt-1 text-sm text-suave">Publicado em {formatarDataHora(criado.criadoEm)} · código {criado.id}</p>
          {criado.tipo === 'ENCONTRADO' && criado.prazoEntrega ? (
            <div className="mt-5 w-full max-w-md text-left">
              <Alert tipo="aviso" titulo="Entregue o objeto na biblioteca">
                <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" aria-hidden /> Prazo até {formatarDataHora(criado.prazoEntrega)}.</span>
              </Alert>
            </div>
          ) : (
            <p className="mt-4 max-w-md text-sm text-ink">Avisaremos você se aparecer um objeto parecido com o que você perdeu.</p>
          )}
        </div>
      )}
    </Modal>
  );
}
