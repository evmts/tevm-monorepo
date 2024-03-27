'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Hex, isHex } from 'tevm/utils';

import { ExpectedType } from '@/lib/types/tx';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { formatTx as formatTxForLocalStorage } from '@/lib/local-storage';
import { useConfigStore } from '@/lib/store/use-config';
import { useProviderStore } from '@/lib/store/use-provider';
import { useTxStore } from '@/lib/store/use-tx';
import { callWithArbitraryData } from '@/lib/tevm';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/common/icons';
import TooltipResponsive from '@/components/common/tooltip-responsive';

/**
 * @notice Make an arbitrary call with specified parameters
 * @dev This allows the user to impersonate an account and make any arbitrary call with the
 * encoded data and parameters they specify; basically the caller, target, calldata, and value.
 * @see CallerSelection for selection of the account to impersonate
 */
const ArbitraryCall = () => {
  /* ---------------------------------- STATE --------------------------------- */
  // The current inputs: "data", and "value"
  const [dataInput, setDataInput] = useState<string>('');
  const [valueInput, setValueInput] = useState<string>('');
  // Whether the call is being processed
  const [calling, setCalling] = useState<boolean>(false);

  // Expand from tablet breakpoint
  const isTablet = useMediaQuery('(min-width: 640px)'); // sm

  // The current chain and client (Tevm), and their initialization status
  const { chain, client, initializing } = useProviderStore((state) => ({
    chain: state.chain,
    client: state.client,
    initializing: state.initializing,
  }));

  const { account, caller, skipBalance, updateAccount } = useConfigStore(
    (state) => ({
      // Get the current account that is targeted by the call
      account: state.account,
      // Get the current address to impersonate as the caller
      caller: state.caller,
      // Whether to skip the native balance check when making a call
      skipBalance: state.skipBalance,
      // Update the account after a call
      updateAccount: state.updateAccount,
    }),
  );

  // Save a tx in the history and set the current processing state
  const { saveTx, setProcessing } = useTxStore((state) => ({
    saveTx: state.saveTx,
    setProcessing: state.setProcessing,
  }));

  // Whether each argument is valid
  const isValid = useMemo(() => {
    return {
      data: isHex(dataInput) || dataInput === '',
      value: !isNaN(Number(valueInput)),
    };
  }, [dataInput, valueInput]);

  /* -------------------------------- HANDLERS -------------------------------- */
  // Perform the arbitrary call with the specified parameters
  // This will use the Tevm client to attempt to execute the call
  // The user will be notified of any errors or the result of the call
  const handleArbitraryCall = async () => {
    if (!client || !account) {
      toast.info(
        'There was an issue retrieving provider data. Please refresh the page.',
      );
      return;
    }
    // Check if the inputs are valid, although this should not be possible
    if (!isValid.data || !isValid.value) return;

    // Display loading state
    setCalling(true);
    setProcessing('arbitrary-call');
    const loading = toast.loading('Processing the call...', {
      description: `Calling ${account.address} with the provided data and value`,
    });

    // Process the transaction
    const tx = await callWithArbitraryData(
      client,
      caller,
      // We can safely cast the following as the call could not be made if the types
      // were invalid
      account.address,
      (dataInput || '0x') as Hex,
      valueInput === '' ? '0' : valueInput,
      skipBalance,
    );

    // Report the result of the transaction to the user
    if (tx.errors?.length) {
      toast.error(tx.errors[0].title, {
        id: loading,
        description: tx.errors[0].message,
      });
    } else {
      // The result provided by the call
      const result = tx.result;
      // Prefer the data if it was decoded and not an array (too long), otherwise the raw data
      const data =
        'data' in result &&
        result.data !== undefined &&
        !Array.isArray(result.data)
          ? (result.data as ExpectedType)
          : result.rawData;
      const adaptedData =
        // Show the first 100 characters of the data if it's too long
        data.toString().length > 100
          ? `${data.toString().slice(0, 100)}...`
          : // or the entire data if it's less than 100 characters
            data;

      toast.success('Transaction successful!', {
        id: loading,
        description:
          // Don't try to display if there was no return value/transaction reverted/failed to retrieve it
          data === '0x'
            ? 'See below for more details.'
            : `Returned: ${adaptedData}. See below for more details.`,
      });
    }

    setCalling(false);
    setProcessing('');

    // Update the account state after the call
    updateAccount(account.address, { updateAbi: false, chain, client }); // no need to wait for completion

    // Save the transaction to the local storage regardless of the result
    saveTx(
      chain.id,
      formatTxForLocalStorage(tx, {
        chainId: chain.id,
        target: account,
        caller,
        functionName: undefined,
        // Convert bigints to strings for local storage
        inputValues: [
          { name: 'data', type: 'bytes', value: dataInput || '0x' },
        ],
        value: tx.value,
      }),
    );
  };

  /* --------------------------------- RENDER --------------------------------- */
  if (!account) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Label htmlFor="caller" className="text-base font-medium">
          Low-level call
        </Label>
        <TooltipResponsive
          content="Call the current account with arbitrary encoded data and/or value"
          trigger="info"
        />
      </div>
      <div className="flex w-full flex-wrap items-end justify-between gap-2 sm:gap-4">
        <div className="grid w-full grid-cols-[1fr_min-content] flex-col gap-1 sm:flex sm:w-auto">
          <Label
            htmlFor="value"
            className="col-span-2 flex items-center gap-2 text-sm text-secondary-foreground"
          >
            Value
          </Label>
          <Input
            id="value"
            type="text"
            className={cn(
              'font-mono text-xs sm:min-w-[300px] sm:text-sm',
              !isValid.value && 'border-red-500',
            )}
            placeholder="The amount of native currency"
            disabled={calling}
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
          />
          {isTablet ? null : (
            <Button
              size="sm"
              variant="ghost"
              className="flex items-center gap-2 text-secondary-foreground"
              onClick={() => navigator.clipboard.readText().then(setValueInput)}
            >
              <Icons.paste className="size-4" /> Paste
            </Button>
          )}
        </div>
        <div className="grid grow grid-cols-[1fr_min-content] flex-col gap-1 sm:flex">
          <Label
            htmlFor="data"
            className="col-span-2 flex items-center gap-2 text-sm text-secondary-foreground"
          >
            Data
          </Label>
          <Input
            id="data"
            type="text"
            className={cn(
              'font-mono text-xs sm:min-w-[300px] sm:text-sm',
              !isValid.data && 'border-red-500',
            )}
            placeholder="The encoded hex data"
            disabled={calling}
            value={dataInput}
            onChange={(e) => setDataInput(e.target.value)}
          />
          {isTablet ? null : (
            <Button
              size="sm"
              variant="ghost"
              className="flex items-center gap-2 text-secondary-foreground"
              onClick={() => navigator.clipboard.readText().then(setDataInput)}
            >
              <Icons.paste className="size-4" /> Paste
            </Button>
          )}
        </div>
        {initializing ? (
          <Skeleton className="h-[36px] w-[57px]" />
        ) : (
          <Button
            className="w-full sm:w-auto"
            disabled={calling || Object.values(isValid).some((v) => !v)}
            onClick={handleArbitraryCall}
          >
            Call
          </Button>
        )}
      </div>
    </div>
  );
};

export default ArbitraryCall;
