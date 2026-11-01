'use client';

import { useEffect, useState } from 'react';
import { Archive, ClipboardList, Gavel, HandHeart, LayoutDashboard, PackageCheck, Settings } from 'lucide-react';
import LibraryShell, { type AbaBiblioteca } from '@/components/layout/LibraryShell';
import LibraryDashboard from '@/components/dashboard/LibraryDashboard';
import SecaoComunicados from '@/components/dashboard/SecaoComunicados';
import SecaoRecebimentos from '@/components/dashboard/SecaoRecebimentos';
import SecaoSolicitacoes from '@/components/dashboard/SecaoSolicitacoes';
import SecaoInventario from '@/components/dashboard/SecaoInventario';
import SecaoDestinacao from '@/components/dashboard/SecaoDestinacao';
import SecaoConfiguracoes from '@/components/dashboard/SecaoConfiguracoes';
import { useData } from '@/contexts/DataContext';
import { useHash } from '@/hooks/useHash';
import { calcularIndicadores } from '@/services/biblioteca.service';

const IDS = ['resumo', 'comunicados', 'recebimentos', 'solicitacoes', 'inventario', 'destinacao', 'configuracoes'];

export default function BibliotecaPage() {
  const { comunicados, solicitacoes } = useData();
  const hash = useHash();
  const [aba, setAba] = useState('resumo');
  useEffect(() => { if (IDS.includes(hash)) setAba(hash); }, [hash]);

  const mudar = (id: string) => { setAba(id); window.history.replaceState(null, '', `#${id}`); window.scrollTo({ top: 0 }); };
  const ind = calcularIndicadores(comunicados, solicitacoes);
  const abas: AbaBiblioteca[] = [
    { id: 'resumo', rotulo: 'Resumo', Icon: LayoutDashboard },
    { id: 'comunicados', rotulo: 'Comunicados', Icon: ClipboardList, badge: ind.pendentes },
    { id: 'recebimentos', rotulo: 'Recebimentos', Icon: PackageCheck, badge: ind.aguardando },
    { id: 'solicitacoes', rotulo: 'Solicitações', Icon: HandHeart, badge: ind.solicitacoes },
    { id: 'inventario', rotulo: 'Inventário', Icon: Archive },
    { id: 'destinacao', rotulo: 'Destinação', Icon: Gavel },
    { id: 'configuracoes', rotulo: 'Configurações', Icon: Settings },
  ];

  return (
    <LibraryShell abas={abas} ativa={aba} onChange={mudar}>
      {aba === 'resumo' && <LibraryDashboard irPara={mudar} />}
      {aba === 'comunicados' && <SecaoComunicados />}
      {aba === 'recebimentos' && <SecaoRecebimentos />}
      {aba === 'solicitacoes' && <SecaoSolicitacoes />}
      {aba === 'inventario' && <SecaoInventario />}
      {aba === 'destinacao' && <SecaoDestinacao />}
      {aba === 'configuracoes' && <SecaoConfiguracoes />}
    </LibraryShell>
  );
}
