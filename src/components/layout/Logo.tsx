import Link from 'next/link';
import { SearchCheck } from 'lucide-react';

export default function Logo({ claro = false, href = '/', mostrarSubtitulo = true }: { claro?: boolean; href?: string; mostrarSubtitulo?: boolean }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5" aria-label="ACHEI — Achados e Perdidos da FATEC">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-sm"><SearchCheck className="h-5 w-5" aria-hidden /></span>
      <span className="leading-tight">
        <span className={`block text-xl font-extrabold tracking-tight ${claro ? 'text-white' : 'text-navy'}`}>ACHEI</span>
        {mostrarSubtitulo && <span className={`block text-[11px] font-medium ${claro ? 'text-slate-300' : 'text-suave'}`}>Achados e Perdidos — FATEC</span>}
      </span>
    </Link>
  );
}
