'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HandHeart, Lock, MapPin } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { StatusBadge, TipoBadge } from '@/components/ui/Badge';
import CategoriaIcone from '@/components/comunicados/CategoriaIcone';
import PrazoTag from '@/components/comunicados/PrazoTag';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { formatarData, formatarDataHora } from '@/lib/format';
import { solicitarReivindicacao } from '@/services/comunicado.service';
import type { Comunicado } from '@/types/comunicado';

const ELEGIVEIS = ['AGUARDANDO_ENTREGA', 'ENTREGA_ATRASADA', 'RECEBIDO_BIBLIOTECA', 'DISPONIVEL_RETIRADA', 'EM_PROCESSO_DEVOLUCAO'];

interface Props { comunicado: Comunicado | null; onClose: () => void; modo?: 'publico' | 'autor' }

export default function ComunicadoDetalhes({ comunicado, onClose, modo = 'publico' }: Props) {
  const { usuario } = useAuth();
  const { atualizar, solicitacoes, comunicados } = useData();
  const toast = useToast();
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);

  if (!comunicado) return null;
  // Usa a versão mais recente do armazenamento para refletir mudanças de status.
  const c = comunicados.find((x) => x.id === comunicado.id) ?? comunicado;
  const ehAutor = usuario?.id === c.autorId;
  const jaSolicitou = solicitacoes.some((s) => s.comunicadoId === c.id && s.alunoId === usuario?.id && ['PENDENTE', 'APROVADA'].includes(s.status));
  const podeReivindicar = modo === 'publico' && c.tipo === 'ENCONTRADO' && ELEGIVEIS.includes(c.status) && !ehAutor;

  function reivindicar() {
    if (!usuario) { router.push('/login'); return; }
    if (usuario.perfil !== 'aluno') return;
    setEnviando(true);
    const r = solicitarReivindicacao(c.id, usuario);
    setEnviando(false);
    if (r.ok) { atualizar(); toast('sucesso', 'Solicitação enviada! A biblioteca vai validar a propriedade.'); onClose(); }
    else toast('erro', r.erro);
  }

  const campo = (rotulo: string, valor: string) => (
    <div><dt className="text-xs font-semibold text-suave">{rotulo}</dt><dd className="mt-0.5 text-sm font-medium text-ink">{valor}</dd></div>
  );

  return (
    <Modal aberto onClose={onClose} titulo={c.titulo} largura="lg"
      rodape={<>
        <Button variante="secundario" onClick={onClose}>Fechar</Button>
        {podeReivindicar && (
          <Button icone={<HandHeart className="h-4 w-4" />} onClick={reivindicar} carregando={enviando} disabled={jaSolicitou || usuario?.perfil === 'funcionario'}>
            {jaSolicitou ? 'Solicitação em andamento' : usuario ? 'Acredito que este objeto é meu' : 'Entrar para solicitar este objeto'}
          </Button>
        )}
      </>}>
      <div className="flex flex-wrap items-center gap-2"><TipoBadge tipo={c.tipo} /><StatusBadge status={c.status} /><PrazoTag comunicado={c} /></div>
      <div className="mt-4 flex items-start gap-4">
        <CategoriaIcone categoria={c.categoria} className="h-14 w-14" />
        <p className="text-sm leading-relaxed text-ink">{c.resumoPublico}</p>
      </div>
      <dl className="mt-5 grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-4">
        {campo('Categoria', c.categoria)}{campo('Local', c.local)}{campo('Data do ocorrido', formatarData(c.dataOcorrido))}{campo('Publicado em', formatarDataHora(c.criadoEm))}
      </dl>

      {modo === 'autor' && (
        <section className="mt-5 rounded-xl border border-brand/20 bg-brand-soft/60 p-4" aria-label="Informações privadas">
          <h3 className="flex items-center gap-2 text-sm font-bold text-navy"><Lock className="h-4 w-4" aria-hidden />Informações privadas (somente você e a biblioteca)</h3>
          <p className="mt-2 text-sm text-ink">{c.descricaoPrivada}</p>
          {c.caracteristicasPrivadas && <p className="mt-2 text-sm text-ink"><span className="font-semibold">Características:</span> {c.caracteristicasPrivadas}</p>}
          {c.imagem && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.imagem} alt={`Fotografia privada: ${c.titulo}`} className="mt-3 max-h-56 rounded-lg object-cover" />
          )}
          {c.recebimento && <p className="mt-3 text-xs text-suave">Recebido pela biblioteca em {formatarDataHora(c.recebimento.em)}.</p>}
        </section>
      )}

      <div className="mt-5">
        <Alert tipo="info" titulo="Como proceder">
          {c.tipo === 'ENCONTRADO' ? (
            <span>Procure a biblioteca (Bloco A, térreo, de segunda a sexta, das 8h às 21h) com um documento de identificação. Você precisará descrever características que só o dono conhece, pois detalhes e fotos do objeto não são divulgados.</span>
          ) : (
            <span>Se você encontrou algo parecido, registre um comunicado de objeto encontrado e entregue o item à biblioteca em até 3 dias úteis.</span>
          )}
        </Alert>
      </div>
      {modo === 'autor' && c.historico.length > 0 && (
        <section className="mt-5" aria-label="Histórico">
          <h3 className="text-sm font-bold text-navy">Histórico</h3>
          <ol className="mt-2 space-y-2 border-l-2 border-slate-200 pl-4">
            {c.historico.map((h, i) => (
              <li key={i} className="text-sm"><span className="text-xs text-suave">{formatarDataHora(h.em)}</span><br />{h.texto} <span className="text-suave">— {h.por}</span></li>
            ))}
          </ol>
        </section>
      )}
      <p className="mt-4 flex items-center gap-1.5 text-xs text-suave"><MapPin className="h-3.5 w-3.5" aria-hidden />Código do comunicado: {c.id}</p>
    </Modal>
  );
}
