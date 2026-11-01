import { Backpack, CupSoda, PencilRuler, Package, Smartphone, Wallet, type LucideIcon } from 'lucide-react';
import type { Categoria } from '@/types/comunicado';

const mapa: Record<Categoria, LucideIcon> = {
  'Eletrônicos': Smartphone,
  'Material escolar': PencilRuler,
  'Acessórios': Backpack,
  'Documentos': Wallet,
  'Garrafas e utensílios': CupSoda,
  'Outros': Package,
};

/** Placeholder ilustrativo: nunca exibe fotografia real na área pública. */
export default function CategoriaIcone({ categoria, className = 'h-12 w-12' }: { categoria: Categoria; className?: string }) {
  const Icon = mapa[categoria] ?? Package;
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand ${className}`} aria-hidden>
      <Icon className="h-1/2 w-1/2" />
    </span>
  );
}
