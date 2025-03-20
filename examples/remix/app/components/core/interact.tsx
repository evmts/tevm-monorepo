import { useState } from 'react';

import { useConfigStore } from '../../lib/store/use-config';
import { useProviderStore } from '../../lib/store/use-provider';
import CallerSelection from './selection/caller';
import SkipBalanceSelection from './selection/skip-balance';
import ContractInterface from './interface';
import { Heading } from '../common/typography';

/**
 * @notice Interactions with a contract, including the caller selection, arbitrary calls, and the interface
 * @dev This will use the current account's state to display the interface
 */
const Interact = () => {
  /* ---------------------------------- STATE --------------------------------- */
  // Get the chain and client from the provider store 
  const { chain, client } = useProviderStore((state) => ({
    chain: state.chain,
    client: state.client,
  }));

  // Get the selected contract's data from the config store
  const { account, abi, caller, skipBalance } = useConfigStore((state) => ({
    account: state.account,
    abi: state.abi,
    caller: state.caller,
    skipBalance: state.skipBalance,
  }));

  // Whether the account is a contract
  const isContract = account?.isContract ?? false;

  /* --------------------------------- RENDER --------------------------------- */
  if (!account) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4 sm:flex-nowrap">
        <CallerSelection account={account} />
        <SkipBalanceSelection />
      </div>

      {isContract && abi && abi.length > 0 ? (
        <div className="mt-8">
          <ContractInterface 
            account={account}
            abi={abi}
            caller={caller}
            skipBalance={skipBalance}
          />
        </div>
      ) : isContract ? (
        <div className="text-center py-8">
          <Heading level={3} className="mb-4">Contract Interface</Heading>
          <p className="text-muted-foreground">
            No ABI found for this contract. Try refreshing the page or verifying that the contract is deployed on the selected chain.
          </p>
        </div>
      ) : (
        <div className="text-center py-8">
          <Heading level={3} className="mb-4">Account Details</Heading>
          <p className="text-muted-foreground">
            This is an Externally Owned Account (EOA), not a smart contract.
          </p>
        </div>
      )}
    </div>
  );
};

export default Interact;