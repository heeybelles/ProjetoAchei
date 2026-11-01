import type { LucideIcon } from 'lucide-react';

const tons = {
  azul: 'bg-brand-soft text-brand',
  agua: 'bg-agua-soft text-agua-dark',
  sol: 'bg-sol-soft text-sol-dark',
  navy: 'bg-slate-100 text-navy',
  vermelho: 'bg-red-50 text-red-700',
};

export default function StatCard({ icone: Icon, rotulo, valor, tom = 'azul', onClick }: { icone: LucideIcon; rotulo: string; valor: number; tom?: keyof typeof tons; onClick?: () => void }) {
  const corpo = (
    <>
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tons[tom]}`}><Icon className="h-5 w-5" aria-hidden /></span>
      <div className="text-left">
        <p className="text-2xl font-extrabold leading-none text-navy">{valor}</p>
        <p className="mt-1 text-sm text-suave">{rotulo}</p>
      </div>
    </>
  );
  const cls = 'card flex items-center gap-4 p-4';
  return onClick ? <button onClick={onClick} className={`${cls} w-full transition hover:border-brand/40`}>{corpo}</button> : <div className={cls}>{corpo}</div>;
}
