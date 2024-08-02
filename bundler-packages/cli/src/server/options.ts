import { z } from 'zod';

// Define options using zod
export const options = z.strictObject({
forkUrl: z.string().optional().describe('set fork URL'),
chainId: z.string().default('900').transform(id => {
return parseInt(id)
}).describe('use known chain id'),
forkBlockNumber: z.string().default('latest').describe('set fork block number'),
host: z.string().default('localhost').describe('set host'),
port: z.string().default('8545').describe('set port'),
loggingLevel: z.string().default('info').describe('set logging level'),
});
