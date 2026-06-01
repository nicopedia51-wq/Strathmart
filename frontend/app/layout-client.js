'use client';

import { AuthProvider } from '@/context/AuthContext';
import Navigation from '@/components/Navigation';

export function RootLayoutClient({ children }) {
  return (
    <AuthProvider>
      <Navigation />
      {children}
    </AuthProvider>
  );
}
