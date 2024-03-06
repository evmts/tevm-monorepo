'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAddress } from 'viem';

import { Address } from '@/lib/types/config';
import { Chain } from '@/lib/types/providers';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { useConfigStore } from '@/lib/store/use-config';
import { useProviderStore } from '@/lib/store/use-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/common/icons';
import ExampleButton from '@/components/core/example';

type SearchBarProps = {
  initialAddress?: string;
  hydrating?: boolean;
};

/**
 * @notice Search for a contract or an EOA by pasting its address and selecting a chain
 * @dev If it's a contract, this will fetch the abi and retrieve the contract's methods.
 * @dev In any case, this will retrieve and display information about the address.
 * @param initialAddress The researched address, if relevant (not on the home page)
 * @param hydrating Whether the app is still hydrating or not
 */
const SearchBar: FC<SearchBarProps> = ({
  initialAddress,
  hydrating = false,
}) => {
  /* ---------------------------------- STATE --------------------------------- */
  // The current input value
  const [inputValue, setInputValue] = useState<string>(initialAddress ?? '');
  // Whether the targets's address passes the checksum
  const [isValidAddress, setIsValidAddress] =
    useState<boolean>(!!initialAddress);

  // Expand from tablet breakpoint
  const isTablet = useMediaQuery('(min-width: 640px)'); // sm

  // Get the current chain & client from the store and the initialization status
  const { chain, client, initializing, setProvider } = useProviderStore(
    (state) => ({
      chain: state.chain,
      client: state.client,
      initializing: state.initializing,
      setProvider: state.setProvider,
    }),
  );

  // Get the method to update the account and the fetching status from the store
  const { fetchingAccount, updateAccount } = useConfigStore((state) => ({
    fetchingAccount: state.fetchingAccount,
    updateAccount: state.updateAccount,
  }));

  // Navigate to a specific address' page on search
  const { push } = useRouter();

  /* -------------------------------- HANDLERS -------------------------------- */
  // Update the current account after checking if it's a valid address
  // Let the user know if the address is invalid
  // This will avoid unnecessary requests to the blockchain as well
  const updateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isAddress(e.target.value)) {
      setIsValidAddress(true);
    } else {
      setIsValidAddress(false);
    }

    setInputValue(e.target.value);
  };

  // Retrieve the state of an account. If it's a contract, fetch its abi on the current chain
  // This will make a request through WhatsABI using the provided Alchemy API key
  // The abi will be set in the store upon successful retrieval, otherwise it will display an error
  // inside a toast
  const handleAccountSearch = async (address?: string, targetChain?: Chain) => {
    // If it's triggered from the example button, update the chain and client first
    const targetClient = targetChain ? await setProvider(targetChain) : client;
    // Don't push the prefix if we're already on the address page
    push(`${initialAddress ? '' : 'address/'}${address ?? inputValue}`);

    // Usually the page mount will handle updating the account (including fetching the abi if relevant)
    // The only exception being when the user clicks on the example button from the very page of the
    // example contract, but while being on another chain; this would obviously not trigger any state update
    if (
      // If the address is the same as the initial one (meaning already on the page of the example contract)
      address &&
      initialAddress &&
      address === initialAddress &&
      // If we're switching to another chain
      targetChain &&
      targetChain.id !== chain.id &&
      targetClient
    ) {
      // Update the account (and find the abi) with the new chain and client
      updateAccount(address as Address, {
        updateAbi: true,
        chain: targetChain,
        client: targetClient,
      });
    }
  };

  // go to account page (with wrong chain) => updateClient + doesn't find abi
  // update provider

  /* --------------------------------- RENDER --------------------------------- */
  return (
    <div className="flex w-full flex-col gap-1">
      <Label
        htmlFor="target"
        className="text-md text-secondary-foreground lg:text-lg"
      >
        Search
      </Label>
      <div className="grid grid-cols-[1fr_min-content] items-center gap-2 sm:flex sm:gap-4">
        <Input
          id="target"
          type="text"
          className={cn(
            inputValue !== '' && !isValidAddress && 'border-red-500',
            'grow font-mono text-xs sm:min-w-[250px] sm:text-sm',
          )}
          placeholder={
            isTablet
              ? 'Paste the address of an EOA or a contract'
              : 'Paste an address'
          }
          disabled={fetchingAccount}
          value={inputValue}
          onChange={updateInput}
        />
        {isTablet ? null : (
          <Button
            size="sm"
            variant="ghost"
            className="flex items-center gap-2 text-secondary-foreground"
            onClick={() => navigator.clipboard.readText().then(setInputValue)}
          >
            <Icons.paste className="size-4" /> Paste
          </Button>
        )}
        {initializing || hydrating ? (
          <>
            <Skeleton className="h-[36px] w-[238px]" />
            <Skeleton className="h-[36px] w-[110px]" />
          </>
        ) : (
          <>
            <ExampleButton handleAccountSearch={handleAccountSearch} />
            <Button
              size={isTablet ? 'default' : 'sm'}
              disabled={!isValidAddress || fetchingAccount}
              onClick={() => handleAccountSearch()}
            >
              {fetchingAccount ? (
                <Icons.loading className="mr-2 size-6" />
              ) : null}
              Search
            </Button>
          </>
        )}
      </div>
      {!isValidAddress && inputValue !== '' ? (
        <span className="text-sm font-medium text-secondary-foreground">
          Invalid address
        </span>
      ) : null}
    </div>
  );
};

export default SearchBar;
