import type { Client } from '../../clients/createClient.js';
import type { Transport } from '../../clients/transports/createTransport.js';
import type { BlockTag } from '../../types/block.js';
import type { Chain } from '../../types/chain.js';
import type { GetTransportConfig } from '../../types/transport.js';
import { type GetBlockReturnType } from './getBlock.js';
export type OnBlockParameter<TChain extends Chain | undefined = Chain, TIncludeTransactions extends boolean = false, TBlockTag extends BlockTag = 'latest'> = GetBlockReturnType<TChain, TIncludeTransactions, TBlockTag>;
export type OnBlock<TChain extends Chain | undefined = Chain, TIncludeTransactions extends boolean = false, TBlockTag extends BlockTag = 'latest'> = (block: OnBlockParameter<TChain, TIncludeTransactions, TBlockTag>, prevBlock: OnBlockParameter<TChain, TIncludeTransactions, TBlockTag> | undefined) => void;
type PollOptions<TIncludeTransactions extends boolean = false, TBlockTag extends BlockTag = 'latest'> = {
    /** The block tag. Defaults to "latest". */
    blockTag?: TBlockTag | BlockTag;
    /** Whether or not to emit the missed blocks to the callback. */
    emitMissed?: boolean;
    /** Whether or not to emit the block to the callback when the subscription opens. */
    emitOnBegin?: boolean;
    /** Whether or not to include transaction data in the response. */
    includeTransactions?: TIncludeTransactions;
    /** Polling frequency (in ms). Defaults to the client's pollingInterval config. */
    pollingInterval?: number;
};
export type WatchBlocksParameters<TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain, TIncludeTransactions extends boolean = false, TBlockTag extends BlockTag = 'latest'> = {
    /** The callback to call when a new block is received. */
    onBlock: OnBlock<TChain, TIncludeTransactions, TBlockTag>;
    /** The callback to call when an error occurred when trying to get for a new block. */
    onError?: (error: Error) => void;
} & (GetTransportConfig<TTransport>['type'] extends 'webSocket' ? {
    blockTag?: never;
    emitMissed?: never;
    emitOnBegin?: never;
    includeTransactions?: never;
    /** Whether or not the WebSocket Transport should poll the JSON-RPC, rather than using `eth_subscribe`. */
    poll?: false;
    pollingInterval?: never;
} | (PollOptions<TIncludeTransactions, TBlockTag> & {
    poll?: true;
}) : PollOptions<TIncludeTransactions, TBlockTag> & {
    poll?: true;
});
export type WatchBlocksReturnType = () => void;
/**
 * Watches and returns information for incoming blocks.
 *
 * - Docs: https://viem.sh/docs/actions/public/watchBlocks.html
 * - Examples: https://stackblitz.com/github/wagmi-dev/viem/tree/main/examples/blocks/watching-blocks
 * - JSON-RPC Methods:
 *   - When `poll: true`, calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getBlockByNumber) on a polling interval.
 *   - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.
 *
 * @param client - Client to use
 * @param parameters - {@link WatchBlocksParameters}
 * @returns A function that can be invoked to stop watching for new block numbers. {@link WatchBlocksReturnType}
 *
 * @example
 * import { createPublicClient, watchBlocks, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const unwatch = watchBlocks(client, {
 *   onBlock: (block) => console.log(block),
 * })
 */
export declare function watchBlocks<TTransport extends Transport, TChain extends Chain | undefined, TIncludeTransactions extends boolean = false, TBlockTag extends BlockTag = 'latest'>(client: Client<TTransport, TChain>, { blockTag, emitMissed, emitOnBegin, onBlock, onError, includeTransactions: includeTransactions_, poll: poll_, pollingInterval, }: WatchBlocksParameters<TTransport, TChain, TIncludeTransactions, TBlockTag>): WatchBlocksReturnType;
export {};
//# sourceMappingURL=watchBlocks.d.ts.map