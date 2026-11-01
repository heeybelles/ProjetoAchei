'use client';

import { useId, useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { comprimirImagem } from '@/lib/image';

export default function ImageUpload({ valor, onChange }: { valor?: string; onChange: (v?: string) => void }) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [erro, setErro] = useState('');
  const [processando, setProcessando] = useState(false);

  async function aoSelecionar(f?: File) {
    if (!f) return;
    setErro(''); setProcessando(true);
    try { onChange(await comprimirImagem(f)); }
    catch (e) { setErro(e instanceof Error ? e.message : 'Não foi possível enviar a imagem.'); }
    finally { setProcessando(false); if (input.current) input.current.value = ''; }
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">Fotografia do objeto <span className="font-normal text-suave">(privada, opcional)</span></label>
      {valor ? (
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={valor} alt="Pré-visualização da fotografia enviada" className="h-24 w-24 rounded-lg object-cover" />
          <div className="flex-1 text-sm text-suave">Imagem pronta. Ela ficará visível somente para a biblioteca.</div>
          <button type="button" onClick={() => onChange(undefined)} className="flex min-h-[40px] items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" />Remover</button>
        </div>
      ) : (
        <label htmlFor={id} className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-suave transition hover:border-brand hover:bg-brand-soft focus-within:ring-2 focus-within:ring-brand">
          {processando ? <Loader2 className="h-6 w-6 animate-spin text-brand" /> : <ImagePlus className="h-6 w-6 text-brand" />}
          <span className="font-semibold text-ink">{processando ? 'Processando imagem…' : 'Clique para escolher uma imagem'}</span>
          <span>JPG, PNG ou WebP, até 8 MB</span>
        </label>
      )}
      <input ref={input} id={id} type="file" accept="image/*" className="sr-only" onChange={(e) => aoSelecionar(e.target.files?.[0])} />
      {erro && <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">{erro}</p>}
    </div>
  );
}
