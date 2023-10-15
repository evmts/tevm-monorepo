import type { Client } from '../../clients/createClient.js';
import type { Transport } from '../../clients/transports/createTransport.js';
import type { Chain } from '../../types/chain.js';
import type { GetTransportConfig } from '../../types/transport.js';
import { type GetBlockNumberReturnType } from './getBlockNumber.js';
export type OnBlockNumberParameter = GetBlockNumberReturnType;
export type OnBlockNumberFn = (blockNumber: OnBlockNumberParameter, prevBlockNumber: OnBlockNumberParameter | undefined) => void;
export type PollOptions = {
    /** Whether or not to emit the missed block numbers to the callback. */
    emitMissed?: boolean;
    /** Whether or not to emit the latest block number to the callback when the subscription opens. */
    emitOnBegin?: boolean;
    /** Polling frequency (in ms). Defaults to Client's pollingInterval config. */
    pollingInterval?: number;
};
export type WatchBlockNumberParameters<TTransport extends Transport = Transport> = {
    /** The callback to call when a new block number is received. */
    onBlockNumber: OnBlockNumberFn;
    /** The callback to call when an error occurred when trying to get for a new block. */
    onError?: (error: Error) => void;
} & (GetTransportConfig<TTransport>['type'] extends 'webSocket' ? {
    emitMissed?: never;
    emitOnBegin?: never;
    /** Whether or not the WebSocket Transport should poll the JSON-RPC, rather than using `eth_subscribe`. */
    poll?: false;
    pollingInterval?: never;
} | (PollOptions & {
    poll: true;
}) : PollOptions & {
    poll?: true;
});
export type WatchBlockNumberReturnType = () => void;
/**
 * Watches and returns incoming block numbers.
 *
 * - Docs: https://viem.sh/docs/actions/public/watchBlockNumber.html
 * - Examples: https://stackblitz.com/github/wagmi-dev/viem/tree/main/examples/blocks/watching-blocks
 * - JSON-RPC Methods:
 *   - When `poll: true`, calls [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber) on a polling interval.
 *   - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.
 *
 * @param client - Client to use
 * @param parameters - {@link WatchBlockNumberParameters}
 * @returns A function that can be invoked to stop watching for new block numbers. {@link WatchBlockNumberReturnType}
 *
 * @example
 * import { createPublicClient, watchBlockNumber, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const unwatch = watchBlockNumber(client, {
 *   onBlockNumber: (blockNumber) => console.log(blockNumber),
 * })
 */
export declare function watchBlockNumber<TChain extends Chain | undefined, TTransport extends Transport>(client: Client<TTransport, TChain>, { emitOnBegin, emitMissed, onBlockNumber, onError, poll: poll_, pollingInterval, }: WatchBlockNumberParameters<TTransport>): WatchBlockNumberReturnType;
//# sourceMappingURL=watchBlockNumber.d.ts.map