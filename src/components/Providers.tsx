'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { WizardProvider } from '@/contexts/WizardContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DataProvider>
        <ToastProvider>
          <WizardProvider>{children}</WizardProvider>
        </ToastProvider>
      </DataProvider>
    </AuthProvider>
  );
}
