'use client';

import { Lock, User } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { StatusBadge, TipoBadge } from '@/components/ui/Badge';
import CategoriaIcone from '@/components/comunicados/CategoriaIcone';
import { formatarData, formatarDataHora } from '@/lib/format';
import type { Comunicado } from '@/types/comunicado';

/** Visão completa (privada) do comunicado, exclusiva do painel da biblioteca. */
export default function DetalhesPrivados({ comunicado: c, onClose }: { comunicado: Comunicado | null; onClose: () => void }) {
  if (!c) return null;
  return (
    <Modal aberto onClose={onClose} titulo={c.titulo} largura="lg" rodape={<Button variante="secundario" onClick={onClose}>Fechar</Button>}>
      <div className="flex flex-wrap items-center gap-2"><TipoBadge tipo={c.tipo} /><StatusBadge status={c.status} /><span className="font-mono text-xs text-suave">{c.id}</span></div>
      <div className="mt-4 grid gap-5 md:grid-cols-[220px_1fr]">
        <div>
          {c.imagem ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.imagem} alt={`Fotografia privada: ${c.titulo}`} className="h-52 w-full rounded-xl border border-slate-200 object-cover" />
          ) : (
            <div className="flex h-52 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center text-xs text-suave">
              <CategoriaIcone categoria={c.categoria} className="h-14 w-14" />Sem fotografia enviada
            </div>
          )}
          <p className="mt-2 flex items-center gap-1.5 text-xs text-suave"><Lock className="h-3.5 w-3.5" aria-hidden />Imagem visível somente aqui</p>
        </div>
        <dl className="space-y-3 text-sm">
          <div><dt className="text-xs font-semibold text-suave">Resumo público</dt><dd>{c.resumoPublico}</dd></div>
          <div><dt className="text-xs font-semibold text-suave">Descrição completa (privada)</dt><dd>{c.descricaoPrivada}</dd></div>
          <div><dt className="text-xs font-semibold text-suave">Características específicas (privadas)</dt><dd>{c.caracteristicasPrivadas || 'Não informadas'}</dd></div>
          <div className="grid grid-cols-2 gap-3">
            <div><dt className="text-xs font-semibold text-suave">Categoria</dt><dd>{c.categoria}</dd></div>
            <div><dt className="text-xs font-semibold text-suave">Local</dt><dd>{c.local}</dd></div>
            <div><dt className="text-xs font-semibold text-suave">Data do ocorrido</dt><dd>{formatarData(c.dataOcorrido)}</dd></div>
            <div><dt className="text-xs font-semibold text-suave">Publicado em</dt><dd>{formatarDataHora(c.criadoEm)}</dd></div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3"><dt className="flex items-center gap-1.5 text-xs font-semibold text-suave"><User className="h-3.5 w-3.5" aria-hidden />Aluno responsável</dt><dd className="mt-0.5 font-medium">{c.autorNome} · matrícula {c.autorMatricula}</dd></div>
          {c.prazoEntrega && <div><dt className="text-xs font-semibold text-suave">Prazo de entrega</dt><dd>{formatarDataHora(c.prazoEntrega)}</dd></div>}
          {c.recebimento && <div><dt className="text-xs font-semibold text-suave">Recebimento</dt><dd>{formatarDataHora(c.recebimento.em)} por {c.recebimento.funcionarioNome}{c.recebimento.observacoes ? ` — ${c.recebimento.observacoes}` : ''}</dd></div>}
          {c.destinacao && <div><dt className="text-xs font-semibold text-suave">Destinação</dt><dd>{c.destinacao.tipo}. {c.destinacao.analise} ({c.destinacao.funcionarioNome}, {formatarDataHora(c.destinacao.em)})</dd></div>}
        </dl>
      </div>
      <section className="mt-5" aria-label="Histórico"><h3 className="text-sm font-bold text-navy">Histórico</h3>
        <ol className="mt-2 space-y-2 border-l-2 border-slate-200 pl-4">{c.historico.map((h, i) => <li key={i} className="text-sm"><span className="text-xs text-suave">{formatarDataHora(h.em)}</span><br />{h.texto} <span className="text-suave">— {h.por}</span></li>)}</ol>
      </section>
    </Modal>
  );
}
