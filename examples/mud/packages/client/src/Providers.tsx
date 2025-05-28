import { useClient, WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { stash } from "./mud/stash";
import { defineConfig, useSessionClient, EntryKitProvider } from "@latticexyz/entrykit/internal";
import { wagmiConfig } from "./wagmiConfig";
import { chainId, getWorldAddress, startBlock } from "./common";
import { Toaster } from "sonner";
import { OptimisticWrapperProvider } from "@tevm/mud/react";
import { SessionClient } from "@tevm/mud";

const queryClient = new QueryClient();

export type Props = {
  children: ReactNode;
};

function OptimisticEntryKitProvider({ children }: { children: ReactNode }) {
  const worldAddress = getWorldAddress();
  const publicClient = useClient()
  const { data: sessionClient } = useSessionClient();

  return <OptimisticWrapperProvider
    stash={stash}
    storeAddress={worldAddress}
    client={sessionClient as unknown as SessionClient | undefined ?? publicClient}
    sync={{ chainId, startBlock }}
    loggingLevel="debug"
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
            <OptimisticEntryKitProvider>
              <Toaster />
              {children}
            </OptimisticEntryKitProvider>
        </EntryKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
