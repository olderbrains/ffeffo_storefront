'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';

import { consumeGoogleRedirect } from '@/lib/api/auth';
import { getQueryClient } from '@/lib/query-client';

function GoogleRedirectHandler() {
  const router = useRouter();
  useEffect(() => {
    consumeGoogleRedirect().then((user) => {
      if (user) router.replace('/account');
    });
  // runs once on mount only
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" disableTransitionOnChange>
        <GoogleRedirectHandler />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
