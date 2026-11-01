'use client';

import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface Comum { label: string; erro?: string; dica?: string; obrigatorio?: boolean }

function Rotulo({ id, label, obrigatorio, children, erro, dica }: Comum & { id: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}{obrigatorio && <span className="text-red-600" aria-hidden> *</span>}
      </label>
      {children}
      {dica && !erro && <p id={`${id}-dica`} className="mt-1.5 text-xs text-suave">{dica}</p>}
      {erro && <p id={`${id}-erro`} role="alert" className="mt-1.5 text-xs font-medium text-red-600">{erro}</p>}
    </div>
  );
}
const aria = (id: string, erro?: string, dica?: string) => ({
  'aria-invalid': erro ? true : undefined,
  'aria-describedby': erro ? `${id}-erro` : dica ? `${id}-dica` : undefined,
});

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & Comum>(function Input(
  { label, erro, dica, obrigatorio, className = '', ...rest }, ref,
) {
  const id = useId();
  return (
    <Rotulo id={id} label={label} erro={erro} dica={dica} obrigatorio={obrigatorio}>
      <input ref={ref} id={id} {...aria(id, erro, dica)} {...rest} className={`input ${erro ? 'input-error' : ''} ${className}`} />
    </Rotulo>
  );
});

export function SenhaInput({ label, erro, dica, obrigatorio, ...rest }: InputHTMLAttributes<HTMLInputElement> & Comum) {
  const id = useId();
  const [ver, setVer] = useState(false);
  return (
    <Rotulo id={id} label={label} erro={erro} dica={dica} obrigatorio={obrigatorio}>
      <div className="relative">
        <input id={id} {...aria(id, erro, dica)} {...rest} type={ver ? 'text' : 'password'} className={`input pr-12 ${erro ? 'input-error' : ''}`} />
        <button type="button" onClick={() => setVer((v) => !v)} aria-label={ver ? 'Ocultar senha' : 'Mostrar senha'}
          className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-suave hover:bg-slate-100 hover:text-ink">
          {ver ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </Rotulo>
  );
}

export function Select({ label, erro, dica, obrigatorio, children, className = '', ...rest }: SelectHTMLAttributes<HTMLSelectElement> & Comum) {
  const id = useId();
  return (
    <Rotulo id={id} label={label} erro={erro} dica={dica} obrigatorio={obrigatorio}>
      <select id={id} {...aria(id, erro, dica)} {...rest} className={`input ${erro ? 'input-error' : ''} ${className}`}>{children}</select>
    </Rotulo>
  );
}

export function Textarea({ label, erro, dica, obrigatorio, className = '', ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & Comum) {
  const id = useId();
  return (
    <Rotulo id={id} label={label} erro={erro} dica={dica} obrigatorio={obrigatorio}>
      <textarea id={id} rows={3} {...aria(id, erro, dica)} {...rest} className={`input resize-y ${erro ? 'input-error' : ''} ${className}`} />
    </Rotulo>
  );
}
