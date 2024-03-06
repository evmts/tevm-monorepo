'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

import { useConfigStore } from '@/lib/store/use-config';
import About from '@/components/core/about';

// Import dynamically to avoid SSR issues due to persisted state (see zustand stores)
const Header = dynamic(() => import('@/components/core/header'));
const TxHistory = dynamic(() => import('@/components/core/tx-history'));

export default function Home() {
  const setAccount = useConfigStore((state) => state.setAccount);

  // The account should be null on the home page
  useEffect(() => {
    setAccount(null);
  }, [setAccount]);

  return (
    <div className="flex grow flex-col gap-4">
      <Header />
      <About />
      <TxHistory />
    </div>
  );
}
