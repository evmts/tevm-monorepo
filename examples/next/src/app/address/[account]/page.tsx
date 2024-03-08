'use client';

import dynamic from 'next/dynamic';

import { Separator } from '@/components/ui/separator';
import AccountState from '@/components/core/account-state';

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
  return (
    <div className="flex grow flex-col gap-4">
      <Header initialAddress={params.account} />
      <AccountState />
      <Interact />

      <Separator className="my-4" />
      <div className="-my-2 h-0 grow" />
      <TxHistory />
    </div>
  );
}
