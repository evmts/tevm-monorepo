import type { Account } from '../../accounts/types.js';
import type { Client } from '../../clients/createClient.js';
import type { Transport } from '../../clients/transports/createTransport.js';
import type { BlockTag } from '../../types/block.js';
import type { Chain } from '../../types/chain.js';
import type { Hash } from '../../types/misc.js';
import { type FormattedBlock } from '../../utils/formatters/block.js';
export type GetBlockParameters<TIncludeTransactions extends boolean = false, TBlockTag extends BlockTag = 'latest'> = {
    /** Whether or not to include transaction data in the response. */
    includeTransactions?: TIncludeTransactions;
} & ({
    /** Hash of the block. */
    blockHash?: Hash;
    blockNumber?: never;
    blockTag?: never;
} | {
    blockHash?: never;
    /** The block number. */
    blockNumber?: bigint;
    blockTag?: never;
} | {
    blockHash?: never;
    blockNumber?: never;
    /**
     * The block tag.
     * @default 'latest'
     */
    blockTag?: TBlockTag | BlockTag;
});
export type GetBlockReturnType<TChain extends Chain | undefined = Chain | undefined, TIncludeTransactions extends boolean = false, TBlockTag extends BlockTag = 'latest'> = FormattedBlock<TChain, TIncludeTransactions, TBlockTag>;
/**
 * Returns information about a block at a block number, hash, or tag.
 *
 * - Docs: https://viem.sh/docs/actions/public/getBlock.html
 * - Examples: https://stackblitz.com/github/wagmi-dev/viem/tree/main/examples/blocks/fetching-blocks
 * - JSON-RPC Methods:
 *   - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) for `blockNumber` & `blockTag`.
 *   - Calls [`eth_getBlockByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbyhash) for `blockHash`.
 *
 * @param client - Client to use
 * @param parameters - {@link GetBlockParameters}
 * @returns Information about the block. {@link GetBlockReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getBlock } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const block = await getBlock(client)
 */
export declare function getBlock<TChain extends Chain | undefined, TAccount extends Account | undefined, TIncludeTransactions extends boolean = false, TBlockTag extends BlockTag = 'latest'>(client: Client<Transport, TChain, TAccount>, { blockHash, blockNumber, blockTag: blockTag_, includeTransactions: includeTransactions_, }?: GetBlockParameters<TIncludeTransactions, TBlockTag>): Promise<GetBlockReturnType<TChain, TIncludeTransactions, TBlockTag>>;
//# sourceMappingURL=getBlock.d.ts.map