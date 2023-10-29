import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Chain } from '../../types/chain.js'
import type { Filter } from '../../types/filter.js'
export type CreatePendingTransactionFilterReturnType = Filter<'transaction'>
/**
 * Creates a Filter to listen for new pending transaction hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges.html).
 *
 * - Docs: https://viem.sh/docs/actions/public/createPendingTransactionFilter.html
 * - JSON-RPC Methods: [`eth_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter)
 *
 * @param client - Client to use
 * @returns [`Filter`](https://viem.sh/docs/glossary/types.html#filter). {@link CreateBlockFilterReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createPendingTransactionFilter } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const filter = await createPendingTransactionFilter(client)
 * // { id: "0x345a6572337856574a76364e457a4366", type: 'transaction' }
 */
export declare function createPendingTransactionFilter<
	TTransport extends Transport,
	TChain extends Chain | undefined,
>(
	client: Client<TTransport, TChain>,
): Promise<CreatePendingTransactionFilterReturnType>
//# sourceMappingURL=createPendingTransactionFilter.d.ts.map
