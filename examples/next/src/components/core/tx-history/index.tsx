'use client';

import { useEffect, useState } from 'react';

import { TxEntry } from '@/lib/types/tx';
import { useProviderStore } from '@/lib/store/use-provider';
import { useTxStore } from '@/lib/store/use-tx';
import TxHistoryTable from '@/components/core/tx-history/table';

/**
 * @notice The history of local transactions made on a chain (fork)
 */
const TxHistory = () => {
  // The tx history for the current chain
  const [txHistory, setTxHistory] = useState<TxEntry[]>([]);

  // The current chain
  const chain = useProviderStore((state) => state.chain);

  const { globalTxHistory, processing, isHydrated } = useTxStore((state) => ({
    // The global tx history for all chains
    globalTxHistory: state.txHistory,
    // The current transaction being processed
    processing: state.processing,
    // Whether the local storage is rehydrated
    isHydrated: state.isHydrated,
  }));

  // Set the tx history for the current chain
  useEffect(() => {
    setTxHistory(globalTxHistory[chain.id] ?? []);
  }, [chain.id, globalTxHistory]);

  return (
    <TxHistoryTable
      data={txHistory}
      loading={!isHydrated || processing !== ''}
    />
  );
};

export default TxHistory;
