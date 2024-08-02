import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { createTevmTransport } from '@tevm/memory-client';
import { http } from '@tevm/jsonrpc';
import { base, optimism, mainnet, tevmDefault } from '@tevm/common';
import { createServer } from './createServer.js';
import { Box, Text } from 'ink';
import { PREFUNDED_ACCOUNTS, PREFUNDED_PRIVATE_KEYS } from '@tevm/utils';
import { options as optionsSchema } from './options.js';
import { z } from 'zod';

type StartServerProps = {
options: z.infer<typeof optionsSchema>;
};

const chains = {
[base.id]: base,
[optimism.id]: optimism,
[mainnet.id]: mainnet,
[tevmDefault.id]: tevmDefault,
};

const startTevm = async (options: z.infer<typeof optionsSchema>) => {
const chain = chains[options.chainId];

if (!chain) {
throw new Error(
`Unknown chain id: ${options.chainId}. Valid chain ids are ${Object.values(chains)
.map((chain) => chain.id)
.join(', ')}`,
);
}

const transport = createTevmTransport({
common: chain,
fork: {
// TODO transform it into parsing block tag right with tevm/zod
blockTag: options.forkBlockNumber ?? 'latest',
transport: http(options.forkUrl ?? chain.rpcUrls.default.http[0])({}),
},
loggingLevel: options.loggingLevel,
});

const server = createServer(transport);

await new Promise<void>((resolve) => {
server.listen(parseInt(options.port), options.host, resolve);
});

return {
transport,
server,
};
};

export const StartServer: React.FC<StartServerProps> = ({ options }) => {
const { data, error, isLoading } = useQuery({
queryKey: ['tevm', options.chainId, options.host, options.port],
queryFn: () => startTevm(options),
staleTime: Infinity,
},

);

if (isLoading) {
return (
<Box>
<Text>Starting TEVM server...</Text>
</Box>
);
}

if (error) {
return (
<Box>
<Text color="red">Error starting TEVM server: {(error as Error).message}</Text>
</Box>
);
}

return (
<Box flexDirection="column">
<Text>TEVM server started successfully!</Text>
<Box flexDirection="column" marginY={1}>
<Text>Chain ID: {options.chainId}</Text>
<Text>Listening on {options.host}:{options.port}</Text>
<Text>Logging Level: {options.loggingLevel}</Text>
</Box>
<Text>Available Accounts</Text>
<Text>
{PREFUNDED_ACCOUNTS.map((acc, index) => `(${index}) ${acc.address} (1000 ETH)`).join('\n')}
</Text>
<Text>Private Keys</Text>
<Text>
{PREFUNDED_PRIVATE_KEYS.map((acc, index) => `(${index}) ${acc}`).join('\n')}
</Text>
<Text>Wallet</Text>
<Text>Mnemonic: test test test test test test test test test test test junk</Text>
<Text>Derivation path: m/44'/60'/0'/0/</Text>
</Box>
);
};
