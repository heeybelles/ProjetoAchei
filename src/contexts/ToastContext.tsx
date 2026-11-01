'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

type TipoToast = 'sucesso' | 'erro' | 'info';
interface Toast { id: number; tipo: TipoToast; mensagem: string }
const Ctx = createContext<(tipo: TipoToast, mensagem: string) => void>(() => undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const fechar = (id: number) => setToasts((l) => l.filter((t) => t.id !== id));
  const mostrar = useCallback((tipo: TipoToast, mensagem: string) => {
    const id = Date.now() + Math.random();
    setToasts((l) => [...l, { id, tipo, mensagem }]);
    setTimeout(() => setToasts((l) => l.filter((t) => t.id !== id)), 4500);
  }, []);

  const estilo: Record<TipoToast, string> = {
    sucesso: 'border-agua/40 bg-white text-ink',
    erro: 'border-red-300 bg-white text-ink',
    info: 'border-brand/30 bg-white text-ink',
  };
  const icone = { sucesso: <CheckCircle2 className="h-5 w-5 text-agua-dark" />, erro: <AlertCircle className="h-5 w-5 text-red-600" />, info: <Info className="h-5 w-5 text-brand" /> };

  return (
    <Ctx.Provider value={mostrar}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border p-3.5 text-sm shadow-lg ${estilo[t.tipo]}`}>
            <span className="mt-0.5">{icone[t.tipo]}</span>
            <p className="flex-1">{t.mensagem}</p>
            <button onClick={() => fechar(t.id)} aria-label="Fechar aviso" className="rounded p-0.5 text-suave hover:text-ink"><X className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
