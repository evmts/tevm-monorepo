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
import type { StartServerProps } from './StartServerProps.js';
import { chains } from './chains.js';

export const startTevm = async (options: z.infer<typeof optionsSchema>) => {
const chain = chains[options.preset ?? tevmDefault.id];

const transport = createTevmTransport({
common: chain ?? tevmDefault,
fork: {
// TODO transform it into parsing block tag right with tevm/zod
blockTag: options.block ?? 'latest',
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
