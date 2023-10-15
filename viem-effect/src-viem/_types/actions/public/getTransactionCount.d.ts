import type { Address } from 'abitype';
import type { Account } from '../../accounts/types.js';
import type { Client } from '../../clients/createClient.js';
import type { Transport } from '../../clients/transports/createTransport.js';
import type { BlockTag } from '../../types/block.js';
import type { Chain } from '../../types/chain.js';
export type GetTransactionCountParameters = {
    /** The account address. */
    address: Address;
} & ({
    /** The block number. */
    blockNumber?: bigint;
    blockTag?: never;
} | {
    blockNumber?: never;
    /** The block tag. Defaults to 'latest'. */
    blockTag?: BlockTag;
});
export type GetTransactionCountReturnType = number;
/**
 * Returns the number of [Transactions](https://viem.sh/docs/glossary/terms.html#transaction) an Account has broadcast / sent.
 *
 * - Docs: https://viem.sh/docs/actions/public/getTransactionCount.html
 * - JSON-RPC Methods: [`eth_getTransactionCount`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactioncount)
 *
 * @param client - Client to use
 * @param parameters - {@link GetTransactionCountParameters}
 * @returns The number of transactions an account has sent. {@link GetTransactionCountReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getTransactionCount } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const transactionCount = await getTransactionCount(client, {
 *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 * })
 */
export declare function getTransactionCount<TChain extends Chain | undefined, TAccount extends Account | undefined>(client: Client<Transport, TChain, TAccount>, { address, blockTag, blockNumber }: GetTransactionCountParameters): Promise<GetTransactionCountReturnType>;
//# sourceMappingURL=getTransactionCount.d.ts.map