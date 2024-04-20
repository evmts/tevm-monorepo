'use client';

import { useConfigStore } from '@/lib/store/use-config';
import InterfaceTable from '@/components/core/interface/table';

/**
 * @notice The interface of the contract after it's been retrieved
 */
const Interface = () => {
  const { abi, fetchingAccount } = useConfigStore((state) => ({
    // Get the abi of the current contract (null if not fetched yet)
    abi: state.abi,
    // Get the loading (fetching) status
    fetchingAccount: state.fetchingAccount,
  }));

  if (!abi && !fetchingAccount) return null;
  return <InterfaceTable data={abi} loading={fetchingAccount} />;
};

export default Interface;
