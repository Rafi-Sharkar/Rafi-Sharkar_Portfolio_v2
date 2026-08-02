'use client';

import { AdminAuthProvider } from '@/context/AdminAuthProvider';
import { PortfolioDataProvider } from '@/context/PortfolioDataProvider';

// Wraps the app in the two client-side context providers.
export default function Providers({ children }) {
  return (
    <AdminAuthProvider>
      <PortfolioDataProvider>{children}</PortfolioDataProvider>
    </AdminAuthProvider>
  );
}