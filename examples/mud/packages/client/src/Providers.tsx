import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { SyncProvider } from "@latticexyz/store-sync/react";
import { stash, syncAdapter } from "./mud/stash";
import { AccountButton, defineConfig, EntryKitProvider, useSessionClient } from "@latticexyz/entrykit/internal";
import { wagmiConfig } from "./wagmiConfig";
import { chainId, getWorldAddress, startBlock } from "./common";
import { Toaster } from "sonner";
import { OptimisticWrapperProvider } from "@tevm/mud/react";

const queryClient = new QueryClient();

export type Props = {
  children: ReactNode;
};

function OptimisticEntryKitProvider({ children }: { children: ReactNode }) {
  const worldAddress = getWorldAddress();
  const { data: sessionClient } = useSessionClient();

  return <OptimisticWrapperProvider
    stash={stash}
    storeAddress={worldAddress}
    // @ts-expect-error - viem versions mismatch
    client={sessionClient}
  >
    {/* @ts-expect-error - react versions mismatch */}
    {children}
  </OptimisticWrapperProvider>
}

export function Providers({ children }: Props) {
  const worldAddress = getWorldAddress();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <EntryKitProvider config={defineConfig({ chainId, worldAddress })}>
          <SyncProvider
            chainId={chainId}
            address={worldAddress}
            startBlock={startBlock}
            adapter={syncAdapter}
          >
            <OptimisticEntryKitProvider>
              <Toaster />
              {children}
            </OptimisticEntryKitProvider>
          </SyncProvider>
        </EntryKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
