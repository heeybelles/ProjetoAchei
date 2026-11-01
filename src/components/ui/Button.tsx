import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

export type Variante = 'primario' | 'secundario' | 'fantasma' | 'perigo' | 'sucesso';
type Tamanho = 'sm' | 'md' | 'lg';

const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 select-none';
const variantes: Record<Variante, string> = {
  primario: 'bg-brand text-white shadow-sm hover:bg-brand-dark active:scale-[.99]',
  secundario: 'border border-slate-300 bg-white text-ink hover:bg-slate-50',
  fantasma: 'text-brand hover:bg-brand-soft',
  perigo: 'bg-red-600 text-white hover:bg-red-700',
  sucesso: 'bg-agua-dark text-white hover:bg-teal-800',
};
const tamanhos: Record<Tamanho, string> = {
  sm: 'min-h-[36px] px-3 text-sm',
  md: 'min-h-[44px] px-4 text-sm',
  lg: 'min-h-[52px] px-6 text-base',
};

export function classesBotao(variante: Variante = 'primario', tamanho: Tamanho = 'md', cheio = false) {
  return `${base} ${variantes[variante]} ${tamanhos[tamanho]} ${cheio ? 'w-full' : ''}`;
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante; tamanho?: Tamanho; carregando?: boolean; cheio?: boolean; icone?: ReactNode;
}

export function Button({ variante, tamanho, carregando, cheio, icone, children, className = '', disabled, ...rest }: Props) {
  return (
    <button type="button" {...rest} disabled={disabled || carregando} className={`${classesBotao(variante, tamanho, cheio)} ${className}`}>
      {carregando ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icone}
      {children}
    </button>
  );
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string; variante?: Variante; tamanho?: Tamanho; cheio?: boolean; icone?: ReactNode;
}
export function LinkButton({ href, variante, tamanho, cheio, icone, children, className = '', ...rest }: LinkProps) {
  return (
    <Link href={href} {...rest} className={`${classesBotao(variante, tamanho, cheio)} ${className}`}>
      {icone}{children}
    </Link>
  );
}
