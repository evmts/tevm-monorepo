import React, { useEffect } from 'react';
import { Text, Box, useInput } from 'ink';
import zod from 'zod';
import { option } from 'pastel';
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
import { http } from '@tevm/jsonrpc';
import { createMemoryClient } from '@tevm/memory-client';
import { PREFUNDED_ACCOUNTS, PREFUNDED_PRIVATE_KEYS } from '@tevm/utils';
import { createServer } from '@tevm/server';
import { useQuery } from '@tanstack/react-query';
import Spinner from 'ink-spinner';
import { create } from 'zustand';

// Define log entry types
type LogEntry = {
  id: number;
  timestamp: string;
  type: 'request' | 'response' | 'error';
  content: string;
};

// Create a Zustand store for logs
interface LogStore {
  logs: LogEntry[];
  showLogs: boolean;
  nextId: number;
  addLog: (type: 'request' | 'response' | 'error', content: any) => void;
  toggleLogs: () => void;
  clearLogs: () => void;
}

// Create a store for server state management
interface ServerStore {
  server: any | null;
  setServer: (server: any) => void;
  shutdownServer: () => Promise<void>;
  isShuttingDown: boolean;
  setIsShuttingDown: (isShuttingDown: boolean) => void;
}

const useServerStore = create<ServerStore>((set, get) => ({
  server: null,
  isShuttingDown: false,
  setServer: (server) => set({ server }),
  setIsShuttingDown: (isShuttingDown) => set({ isShuttingDown }),
  shutdownServer: async () => {
    const { server, isShuttingDown } = get();

    if (!server || isShuttingDown) return;

    set({ isShuttingDown: true });

    return new Promise<void>((resolve) => {
      console.log('\nGracefully shutting down server...');
      server.close(() => {
        console.log('Server shutdown complete.');
        resolve();
      });

      // Force close after 3 seconds if it doesn't close gracefully
      setTimeout(() => {
        console.log('Forcing server shutdown after timeout.');
        resolve();
      }, 3000);
    });
  }
}));

const useLogStore = create<LogStore>((set) => ({
  logs: [],
  showLogs: false,
  nextId: 1,
  addLog: (type, content) => set((state) => {
    // Format timestamp
    const now = new Date();
    const timestamp = now.toLocaleTimeString();

    // Format content
    let contentStr;
    try {
      contentStr = typeof content === 'string'
        ? content
        : JSON.stringify(content, null, 2);
    } catch (err) {
      contentStr = String(content);
    }

    // Add new log entry
    return {
      logs: [...state.logs.slice(-50), {
        id: state.nextId,
        timestamp,
        type,
        content: contentStr
      }],
      nextId: state.nextId + 1
    };
  }),
  toggleLogs: () => set((state) => ({ showLogs: !state.showLogs })),
  clearLogs: () => set({ logs: [] }),
}));

export const options = zod.object({
  port: zod.number().default(8545).describe(
    option({
      description: 'Port to listen on',
      defaultValueDescription: '8545',
    })
  ),
  host: zod.string().default('localhost').describe(
    option({
      description: 'Host to bind to',
      defaultValueDescription: 'localhost',
    })
  ),
  fork: zod.string().optional().describe(
    option({
      description: 'URL of network to fork',
    })
  ),
  chainId: zod.string().default('900').describe(
    option({
      description: 'Use known chain ID',
      defaultValueDescription: '900 (tevm)',
    })
  ),
  forkBlockNumber: zod.string().default('latest').describe(
    option({
      description: 'Set fork block number',
      defaultValueDescription: 'latest',
    })
  ),
  loggingLevel: zod.string().default('info').describe(
    option({
      description: 'Set logging level',
      defaultValueDescription: 'info',
    })
  ),
  verbose: zod.boolean().default(false).describe(
    option({
      description: 'Enable verbose logging of JSON-RPC requests',
    })
  )
});

type Props = {
  options: zod.infer<typeof options>;
};

/**
 * Component to render JSON-RPC logs
 */
function LogViewer() {
  const { logs, showLogs, toggleLogs, clearLogs } = useLogStore();

  // Handle keyboard input for toggling logs view
  useInput((input, key) => {
    if (input === 'l') {
      toggleLogs();
    } else if (input === 'c' && showLogs) {
      clearLogs();
    }
  });

  if (!showLogs) {
    return <Text>Press 'l' to show/hide logs</Text>;
  }

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="gray" padding={1}>
      <Box justifyContent="space-between" marginBottom={1}>
        <Text bold>JSON-RPC Logs</Text>
        <Text>Press 'l' to hide or 'c' to clear</Text>
      </Box>

      {logs.length === 0 ? (
        <Text>No logs yet...</Text>
      ) : (
        logs.map((log) => (
          <Box key={log.id} flexDirection="column" marginBottom={1}>
            <Box>
              <Text color="gray">[{log.timestamp}] </Text>
              <Text color={log.type === 'request' ? 'blue' : log.type === 'response' ? 'green' : 'red'}>
                {log.type === 'request' ? '→ Request' : log.type === 'response' ? '← Response' : '✖ Error'}
              </Text>
            </Box>
            <Box paddingLeft={2}>
              <Text wrap="wrap">{log.content}</Text>
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
}

/**
 * Create a proxy around the request function that logs to Zustand store
 */
function createLoggingRequestProxy(originalRequest: any, verbose: boolean) {
  const { addLog } = useLogStore.getState();

  return async function proxiedRequest(...args: any[]) {
    if (verbose) {
      addLog('request', args);
    }

    try {
      // Call original function and await result
      const result = await originalRequest(...args);

      if (verbose) {
        addLog('response', result);
      }

      return result;
    } catch (error) {
      if (verbose) {
        addLog('error', error);
      }
      throw error;
    }
  };
}

export default function Serve({ options }: Props) {
  const { setServer, shutdownServer } = useServerStore();

  // Set up signal handlers for graceful shutdown
  useEffect(() => {
    // Handle program exit signals
    const handleExit = async () => {
      await shutdownServer();
      process.exit(0);
    };

    // Register signal handlers for graceful shutdown
    process.on('SIGINT', handleExit);  // Ctrl+C
    process.on('SIGTERM', handleExit); // Kill signal
    process.on('SIGHUP', handleExit);  // Terminal closed

    // Clean up signal handlers on component unmount
    return () => {
      process.off('SIGINT', handleExit);
      process.off('SIGTERM', handleExit);
      process.off('SIGHUP', handleExit);
    };
  }, [shutdownServer]);

  // Use React Query to start the server and manage its state
  const { isLoading, isError, error } = useQuery({
    queryKey: ['server', options],
    queryFn: async () => {
      const chains = {
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

      const chain = chains[parseInt(options.chainId)];

      if (!chain) {
        throw new Error(
          `Unknown chain id: ${options.chainId}. Valid chain ids are ${Object.entries(chains)
            .map(([id, chain]) => `${id} (${chain.name})`)
            .join(', ')}`
        );
      }

      const client = createMemoryClient({
        common: chain,
        fork: options.fork ? {
          blockTag: options.forkBlockNumber as any,
          transport: http(options.fork)({}),
        } : undefined,
        loggingLevel: options.loggingLevel as any,
      });

      // Add request logging if verbose mode is enabled
      if (options.verbose) {
        // Create a proxy around the request function
        const originalRequest = client.request;
        client.request = createLoggingRequestProxy(originalRequest, options.verbose);
      }

      const server = createServer(client);

      // Wait for server to start
      await new Promise<void>((resolve) => {
        server.listen(options.port, options.host, () => {
          resolve();
        });
      });

      // Store server reference for graceful shutdown
      setServer(server);

      // Return true to indicate success
      return true;
    },
    retry: false,
    // Prevent refetching on window focus or reconnect
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Ensure the query runs immediately
    enabled: true,
    staleTime: Infinity,
    // Prevent caching since this is a long-running server operation
    gcTime: 0,
  });

  // Clean up server on component unmount
  useEffect(() => {
    return () => {
      shutdownServer();
    };
  }, [shutdownServer]);

  // Set up log viewer help text if verbose is enabled
  useEffect(() => {
    if (options.verbose) {
      useLogStore.setState({ showLogs: false });
    }
  }, [options.verbose]);

  // Display loading state while server is starting
  if (isLoading) {
    return (
      <Box>
        <Text>
          <Text color="green">
            <Spinner type="dots" />
          </Text>
          {' Starting server...'}
        </Text>
      </Box>
    );
  }

  // Display error state if server failed to start
  if (isError) {
    return (
      <Box flexDirection="column">
        <Text color="red">Error starting server: {error instanceof Error ? error.message : String(error)}</Text>
      </Box>
    );
  }

  // Server is started successfully
  return (
    <Box flexDirection="column">
      <Text>
        {" ___                 "}{"\n"}
        {"|_ _|___  _ _ ._ _ _ "}{"\n"}
        {" | |/ ._>| | || ' ' |"}{"\n"}
        {" |_|\\___.|__/ |_|_|_|"}{"\n"}
        {"                     "}{"\n"}
        {"https://tevm.sh"}{"\n"}
        {"\n"}
        {"Available Accounts"}{"\n"}
        {"=================="}
      </Text>
      {PREFUNDED_ACCOUNTS.map((acc: any, index: number) => (
        <Text key={index}>({index}) {acc.address} (1000 ETH)</Text>
      ))}
      <Text>{"\n"}{"Private Keys"}{"\n"}{"=================="}
      </Text>
      {PREFUNDED_PRIVATE_KEYS.map((key: string, index: number) => (
        <Text key={index}>({index}) {key}</Text>
      ))}
      <Text>
        {"\n"}{"Wallet"}{"\n"}{"=================="}{"\n"}
        {"Mnemonic:          test test test test test test test test test test test junk"}{"\n"}
        {"Derivation path:   m/44'/60'/0'/0/"}{"\n"}
        {"\n"}
        {"Chain ID"}{"\n"}
        {"=================="}{"\n"}
        {options.chainId}{"\n"}
        {"\n"}
        {"Listening on "}{options.host}{":"}{options.port}
        {options.fork ? ` (forking ${options.fork})` : ''}
        {"\n\nPress Ctrl+C to stop the server"}
      </Text>

      {options.verbose && (
        <Box marginTop={1}>
          <LogViewer />
        </Box>
      )}
    </Box>
  );
}