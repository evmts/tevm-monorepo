import type { Account } from '../../accounts/types.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { GetAccountParameter } from '../../types/account.js'
import type { BlockTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import type { UnionOmit } from '../../types/utils.js'
import { type FormattedTransactionRequest } from '../../utils/formatters/transactionRequest.js'
export type FormattedEstimateGas<
	TChain extends Chain | undefined = Chain | undefined,
> = FormattedTransactionRequest<TChain>
export type EstimateGasParameters<
	TChain extends Chain | undefined = Chain | undefined,
	TAccount extends Account | undefined = undefined,
> = UnionOmit<FormattedEstimateGas<TChain>, 'from'> &
	GetAccountParameter<TAccount> &
	(
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
export type EstimateGasReturnType = bigint
/**
 * Estimates the gas necessary to complete a transaction without submitting it to the network.
 *
 * - Docs: https://viem.sh/docs/actions/public/estimateGas.html
 * - JSON-RPC Methods: [`eth_estimateGas`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_estimategas)
 *
 * @param client - Client to use
 * @param parameters - {@link EstimateGasParameters}
 * @returns The gas estimate (in wei). {@link EstimateGasReturnType}
 *
 * @example
 * import { createPublicClient, http, parseEther } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { estimateGas } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const gasEstimate = await estimateGas(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: parseEther('1'),
 * })
 */
export declare function estimateGas<
	TChain extends Chain | undefined,
	TAccount extends Account | undefined = undefined,
>(
	client: Client<Transport, TChain, TAccount>,
	args: EstimateGasParameters<TChain, TAccount>,
): Promise<EstimateGasReturnType>
//# sourceMappingURL=estimateGas.d.ts.map
