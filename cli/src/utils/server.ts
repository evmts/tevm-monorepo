import {
  base,
  mainnet,
  optimism,
  tevmDefault,
  optimismSepolia,
  optimismGoerli,
  sepolia,
  arbitrum,
  arbitrumSepolia,
  avalanche,
  bsc,
  polygon,
  gnosis,
  moonbeam,
  anvil,
  blast,
  scroll,
  zksync
} from '@tevm/common';
import { createServer } from '@tevm/server';
import { createLoggingRequestProxy } from '../stores/logStore.js';

export async function initializeServer({
  port,
  host,
  chainId,
  verbose
}: {
  port: number;
  host: string;
  chainId: string;
  fork?: string;
  forkBlockNumber: string;
  loggingLevel: string;
  verbose: boolean;
}) {
  const chains: Record<number, any> = {
    [base.id]: base,
    [mainnet.id]: mainnet,
    [optimism.id]: optimism,
    [tevmDefault.id]: tevmDefault,
    [optimismSepolia.id]: optimismSepolia,
    [optimismGoerli.id]: optimismGoerli,
    [sepolia.id]: sepolia,
    [arbitrum.id]: arbitrum,
    [arbitrumSepolia.id]: arbitrumSepolia,
    [avalanche.id]: avalanche,
    [bsc.id]: bsc,
    [polygon.id]: polygon,
    [zksync.id]: zksync,
    [gnosis.id]: gnosis,
    [moonbeam.id]: moonbeam,
    [anvil.id]: anvil,
    [blast.id]: blast,
    [scroll.id]: scroll,
  };

  const chain = chains[parseInt(chainId)];

  if (!chain) {
    throw new Error(
      `Unknown chain id: ${chainId}. Valid chain ids are ${Object.entries(chains)
        .map(([id, chain]) => `${id} (${chain.name})`)
        .join(', ')}`
    );
  }

  const client = {
    // Add minimum required methods/properties
  } as any;

  // Add request logging if verbose mode is enabled
  if (verbose) {
    // Create a proxy around the request function
    const originalRequest = client.request;
    client.request = createLoggingRequestProxy(originalRequest, verbose);
  }

  // Create and start the server
  const server = createServer(client);

  // Handle graceful shutdown
  const handleShutdown = () => {
    server.close();
    process.exit(0);
  };

  process.on('SIGINT', handleShutdown);
  process.on('SIGTERM', handleShutdown);

  await new Promise<void>((resolve) => {
    server.listen(port, host, () => {
      resolve();
    });
  });

  // Return the client and server for use by action components
  return { client, server };
}