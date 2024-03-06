'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { isAddress } from 'viem';

import { useConfigStore } from '@/lib/store/use-config';
import { useProviderStore } from '@/lib/store/use-provider';
import { Separator } from '@/components/ui/separator';

// Import dynamically to avoid SSR issues due to persisted state (see zustand stores)
const Header = dynamic(() => import('@/components/core/header'));
const Interact = dynamic(() => import('@/components/core/interact'));
const TxHistory = dynamic(() => import('@/components/core/tx-history'));

/**
 * @notice An account page, where the user can interact with the contract/EOA
 * @dev This should be displayed after searching for an account, or clicking on a link
 * (or obviously if directly writing the address in the URL)
 */
export default function AccountPage({
  params,
}: {
  params: { account: string };
}) {
  // Remember when the account has been fetched
  const [fetched, setFetched] = useState(false);

  // Chain & client
  const { chain, client } = useProviderStore((state) => ({
    chain: state.chain,
    client: state.client,
  }));

  // Update the account in the store
  const updateAccount = useConfigStore((state) => state.updateAccount);

  //Fetch the account's data on mount (after searching for this account)
  // We want to handle any other updates consequently to an action individually (chain change,
  // reset, call, etc) for better modularity and performance
  useEffect(() => {
    if (params.account && client && !fetched) {
      // If the address (slug) is invalid, let the user know
      // This should not happen in other cases because the search button is disabled
      if (!isAddress(params.account)) {
        toast.error('Invalid address', {
          description: `The address "${params.account}" did not pass the checksum.`,
        });
        return;
      }

      updateAccount(params.account, {
        updateAbi: true,
        chain,
        client,
      });
      setFetched(true);
    }
  }, [client, chain, fetched, params.account, updateAccount]);

  return (
    <div className="flex grow flex-col gap-4">
      <Header initialAddress={params.account} />
      <Interact />

      <Separator className="my-4" />
      <div className="-my-2 h-0 grow" />
      <TxHistory />
    </div>
  );
}
