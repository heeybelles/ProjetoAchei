import { useEffect, useMemo, useState } from 'react';

export function usePaginacao<T>(itens: T[], porPagina: number) {
  const [pagina, setPagina] = useState(1);
  const total = Math.max(1, Math.ceil(itens.length / porPagina));
  useEffect(() => { if (pagina > total) setPagina(total); }, [pagina, total]);
  const visiveis = useMemo(() => itens.slice((pagina - 1) * porPagina, pagina * porPagina), [itens, pagina, porPagina]);
  return { pagina, setPagina, total, visiveis };
}
