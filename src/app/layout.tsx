import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@fontsource-variable/inter';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'ACHEI — Achados e Perdidos da FATEC',
  description: 'Perdeu ou encontrou algo na FATEC? Registre, acompanhe e recupere seus objetos com o Achei.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
