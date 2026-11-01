import { useEffect, useState } from 'react';

/** Lê o hash da URL somente no navegador (evita erros de hidratação). */
export function useHash(): string {
  const [hash, setHash] = useState('');
  useEffect(() => {
    const ler = () => setHash(window.location.hash.replace('#', ''));
    ler();
    window.addEventListener('hashchange', ler);
    return () => window.removeEventListener('hashchange', ler);
  }, []);
  return hash;
}
