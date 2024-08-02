import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Text } from 'ink';
import { PREFUNDED_ACCOUNTS, PREFUNDED_PRIVATE_KEYS } from '@tevm/utils';
import type { StartServerProps } from './StartServerProps.js';
import { startTevm } from './startTevm.js';

export const StartServer: React.FC<StartServerProps> = ({ options }) => {
const { data, error, isLoading } = useQuery({
queryKey: ['tevm', options.preset, options.preset, options.host, options.loggingLevel, options.block, options.forkUrl, options.port],
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
