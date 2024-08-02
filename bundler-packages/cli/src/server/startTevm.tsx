import { createTevmTransport } from '@tevm/memory-client';
import { http } from '@tevm/jsonrpc';
import { createServer } from '@tevm/server';
import { options as optionsSchema } from './options.js';
import { z } from 'zod';
import { chains } from './chains.js';

export const startTevm = async (options: z.infer<typeof optionsSchema>) => {
const chain = options.preset !== undefined ? chains[options.preset] : undefined;

const transport = createTevmTransport({
...(chain !== undefined ? { common: chain } : {}),
fork: {
// TODO transform it into parsing block tag right with tevm/zod
blockTag: options.block as any ?? 'latest',
transport: http(options.forkUrl ?? chain?.rpcUrls.default.http[0])({}),
},
loggingLevel: options.loggingLevel,
})({ chain, retryCount: 2 });

const server = createServer(transport);

await new Promise<void>((resolve) => {
server.listen(parseInt(options.port), options.host, resolve);
});

return {
transport,
server,
};
};
