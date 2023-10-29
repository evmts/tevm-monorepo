import type { Account } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { BlockTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import type { Hex } from '../../types/misc.js'
import type { UnionOmit } from '../../types/utils.js'
import { type FormattedTransactionRequest } from '../../utils/formatters/transactionRequest.js'
import type { Address } from 'abitype'
export type FormattedCall<
	TChain extends Chain | undefined = Chain | undefined,
> = FormattedTransactionRequest<TChain>
export type CallParameters<
	TChain extends Chain | undefined = Chain | undefined,
> = UnionOmit<FormattedCall<TChain>, 'from'> & {
	account?: Account | Address
	batch?: boolean
} & (
		| {
				/** The balance of the account at a block number. */
				blockNumber?: bigint
				blockTag?: never
		  }
		| {
				blockNumber?: never
				/**
				 * The balance of the account at a block tag.
				 * @default 'latest'
				 */
				blockTag?: BlockTag
		  }
	)
export type CallReturnType = {
	data: Hex | undefined
}
/**
 * Executes a new message call immediately without submitting a transaction to the network.
 *
 * - Docs: https://viem.sh/docs/actions/public/call.html
 * - JSON-RPC Methods: [`eth_call`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_call)
 *
 * @param client - Client to use
 * @param parameters - {@link CallParameters}
 * @returns The call data. {@link CallReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { call } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const data = await call(client, {
 *   account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
 *   data: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 * })
 */
export declare function call<TChain extends Chain | undefined>(
	client: Client<Transport, TChain>,
	args: CallParameters<TChain>,
): Promise<CallReturnType>
export declare function getRevertErrorData(
	err: unknown,
): `0x${string}` | undefined
//# sourceMappingURL=call.d.ts.map
