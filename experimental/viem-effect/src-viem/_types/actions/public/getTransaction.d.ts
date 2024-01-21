import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { BlockTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import type { Hash } from '../../types/misc.js'
import { type FormattedTransaction } from '../../utils/formatters/transaction.js'
export type GetTransactionParameters<TBlockTag extends BlockTag = 'latest'> =
	| {
			/** The block hash */
			blockHash: Hash
			blockNumber?: never
			blockTag?: never
			hash?: never
			/** The index of the transaction on the block. */
			index: number
	  }
	| {
			blockHash?: never
			/** The block number */
			blockNumber: bigint
			blockTag?: never
			hash?: never
			/** The index of the transaction on the block. */
			index: number
	  }
	| {
			blockHash?: never
			blockNumber?: never
			/** The block tag. */
			blockTag: TBlockTag | BlockTag
			hash?: never
			/** The index of the transaction on the block. */
			index: number
	  }
	| {
			blockHash?: never
			blockNumber?: never
			blockTag?: never
			/** The hash of the transaction. */
			hash: Hash
			index?: number
	  }
export type GetTransactionReturnType<
	TChain extends Chain | undefined = Chain,
	TBlockTag extends BlockTag = 'latest',
> = FormattedTransaction<TChain, TBlockTag>
/**
 * Returns information about a [Transaction](https://viem.sh/docs/glossary/terms.html#transaction) given a hash or block identifier.
 *
 * - Docs: https://viem.sh/docs/actions/public/getTransaction.html
 * - Example: https://stackblitz.com/github/wagmi-dev/viem/tree/main/examples/transactions/fetching-transactions
 * - JSON-RPC Methods: [`eth_getTransactionByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionByHash)
 *
 * @param client - Client to use
 * @param parameters - {@link GetTransactionParameters}
 * @returns The transaction information. {@link GetTransactionReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getTransaction } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const transaction = await getTransaction(client, {
 *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
 * })
 */
export declare function getTransaction<
	TChain extends Chain | undefined,
	TBlockTag extends BlockTag = 'latest',
>(
	client: Client<Transport, TChain>,
	{
		blockHash,
		blockNumber,
		blockTag: blockTag_,
		hash,
		index,
	}: GetTransactionParameters<TBlockTag>,
): Promise<GetTransactionReturnType<TChain, TBlockTag>>
//# sourceMappingURL=getTransaction.d.ts.map
