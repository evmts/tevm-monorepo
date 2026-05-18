'use client';

import type { FC } from 'react';
import { useMedia } from 'react-use';
import { toast } from 'sonner';
import { extractChain } from 'viem';

import { CHAINS } from '@/lib/constants/providers';
import { useConfigStore } from '@/lib/store/use-config';
import { useProviderStore } from '@/lib/store/use-provider';
import { useTxStore } from '@/lib/store/use-tx';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ElapsedTime from '@/components/common/elapsed-time';
import TooltipResponsive from '@/components/common/tooltip-responsive';
import ComboBoxResponsive from '@/components/templates/combobox-responsive';

type ChainSelectionProps = {
  hydrating?: boolean;
};

/**
 * @notice Select a chain from the list of supported chains
 * @dev This will create or retrieve a Tevm client in local storage
 * @dev The state of various chains can be saved/retrieved from local storage, each
 * on their own key
 * @param hydrating Whether the app is still hydrating or not
 */
const ChainSelection: FC<ChainSelectionProps> = ({ hydrating = false }) => {
  /* ---------------------------------- STATE --------------------------------- */
  // Expand from tablet breakpoint
  const isTablet = useMedia('(min-width: 640px)'); // sm
  // Get the account and loading (fetching) status of the account & abi (+ method to fetch & update)
  const { account, fetchingAccount, updateAccount } = useConfigStore(
    (state) => ({
      account: state.account,
      fetchingAccount: state.fetchingAccount,
      updateAccount: state.updateAccount,
    }),
  );

  const { chain, client, forkTime, initializing, setProvider, setForkTime } =
    useProviderStore((state) => ({
      // Get the current chain (selected from the combobox)
      chain: state.chain,
      // Get the current Tevm client
      client: state.client,
      // The fork time for the current chain
      forkTime: state.forkTime,
      // The initialization status of the current chain & client
      initializing: state.initializing,
      // Set the current provider from the combobox (chain + Tevm client)
      setProvider: state.setProvider,
      // Set the fork time for the current chain
      setForkTime: state.setForkTime,
    }));

  // Reset the transaction history for a chain
  const resetTxs = useTxStore((state) => state.resetTxs);

  /* -------------------------------- HANDLERS -------------------------------- */
  // Reset the cache of the Tevm clients for this chain in local storage
  const resetCurrentClient = async () => {
    if (!client) return; // this should never happen since the button would not be rendered yet

    const loading = toast.loading('Forking chain...', {
      description: `Forking ${chain.name} to the latest block and resetting local transaction history...`,
    });
    // This will set forkTime to 0 (loading) and then to the current time (update)
    setForkTime(chain.id, 'loading');
    // TODO implement me
    (client as any).reset = async () => ({
      success: false,
      error: 'not implemented',
    });
    const { success, error } = await (client as any).reset();
    setForkTime(chain.id, 'update');

    if (success) {
      // Reset the transaction history for the current chain
      resetTxs(chain.id);

      // Update the state of the account if there is one set
      if (account) {
        updateAccount(account.address, {
          updateAbi: true,
          chain,
          client,
        });
      }

      toast.success('Chain reset', {
        id: loading,
        description: `The client for ${chain.name} has been reset and the fork created at the latest block`,
      });
    } else {
      toast.error('Error', {
        id: loading,
        description: `The client for ${chain.name} could not be reset: ${error}`,
      });
    }
  };

  /* --------------------------------- RENDER --------------------------------- */
  return (
    <div className="relative grid grid-cols-[1fr_min-content] justify-between gap-1 sm:flex sm:items-start">
      {initializing || hydrating ? (
        <Skeleton className="h-[36px] w-[200px] sm:w-[250px]" />
      ) : (
        <ComboBoxResponsive
          items={CHAINS.map((chain) => ({
            value: chain.id.toString(),
            label: chain.name,
          }))}
          label="Chain"
          disabled={fetchingAccount}
          selected={{
            value: chain.id.toString(),
            label: chain.name,
          }}
          setSelected={async (chainOption) => {
            const selectedChain = extractChain({
              chains: CHAINS,
              id: Number(chainOption.value),
            });
            // Change the chain (and update the account)
            const client = await setProvider(selectedChain, account?.address);
            // Catch any issue if the client could not be set
            if (!client) {
              toast.error('Failed to set provider', {
                description: `The provider for ${selectedChain.name} could not be retrieved`,
              });
            }
          }}
          header="Select a chain"
          className="w-[200px] sm:w-[250px]"
        />
      )}
      {isTablet ? <div className="grow" /> : null}
      <div className="flex items-center gap-2">
        {initializing || hydrating ? (
          <Skeleton className="h-[32px] w-[85px]" />
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={resetCurrentClient}
            disabled={fetchingAccount}
          >
            Fork chain
          </Button>
        )}
        <TooltipResponsive
          trigger="info"
          content="Fork the chain to the current block (you will lose the local state of the chain)"
        />
      </div>
      <div className="right-0 -bottom-5 col-span-2 justify-self-end text-xs font-semibold text-gray-500 sm:absolute">
        {!initializing && forkTime[chain.id] !== 0 ? (
          <TooltipResponsive
            trigger={
              <span>
                <ElapsedTime
                  start={forkTime[chain.id] as number}
                  prefix="Forked"
                  suffix="ago"
                />
              </span>
            }
            content={new Date(forkTime[chain.id] as number).toLocaleString()}
          />
        ) : (
          <Skeleton className="h-4 w-full" />
        )}
      </div>
    </div>
  );
};

export default ChainSelection;
