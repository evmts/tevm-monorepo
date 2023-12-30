import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Block } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import type { GetChain } from '../../types/chain.js'
import type {
	FeeValuesEIP1559,
	FeeValuesLegacy,
	FeeValuesType,
} from '../../types/fee.js'
import type { PrepareTransactionRequestParameters } from '../wallet/prepareTransactionRequest.js'
export type EstimateFeesPerGasParameters<
	chain extends Chain | undefined = Chain | undefined,
	chainOverride extends Chain | undefined = Chain | undefined,
	type extends FeeValuesType = FeeValuesType,
> = {
	/**
	 * The type of fee values to return.
	 *
	 * - `legacy`: Returns the legacy gas price.
	 * - `eip1559`: Returns the max fee per gas and max priority fee per gas.
	 *
	 * @default 'eip1559'
	 */
	type?: type | FeeValuesType
} & GetChain<chain, chainOverride>
export type EstimateFeesPerGasReturnType<
	type extends FeeValuesType = FeeValuesType,
> =
	| (type extends 'legacy' ? FeeValuesLegacy : never)
	| (type extends 'eip1559' ? FeeValuesEIP1559 : never)
/**
 * Returns an estimate for the fees per gas (in wei) for a
 * transaction to be likely included in the next block.
 * Defaults to [`chain.fees.estimateFeesPerGas`](/docs/clients/chains.html#fees-estimatefeespergas) if set.
 *
 * - Docs: https://viem.sh/docs/actions/public/estimateFeesPerGas.html
 *
 * @param client - Client to use
 * @param parameters - {@link EstimateFeesPerGasParameters}
 * @returns An estimate (in wei) for the fees per gas. {@link EstimateFeesPerGasReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { estimateFeesPerGas } from 'viem/actions'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const maxPriorityFeePerGas = await estimateFeesPerGas(client)
 * // { maxFeePerGas: ..., maxPriorityFeePerGas: ... }
 */
export declare function estimateFeesPerGas<
	chain extends Chain | undefined,
	chainOverride extends Chain | undefined,
	type extends FeeValuesType = 'eip1559',
>(
	client: Client<Transport, chain>,
	args?: EstimateFeesPerGasParameters<chain, chainOverride, type>,
): Promise<EstimateFeesPerGasReturnType<type>>
export declare function internal_estimateFeesPerGas<
	chain extends Chain | undefined,
	chainOverride extends Chain | undefined,
	type extends FeeValuesType = 'eip1559',
>(
	client: Client<Transport, chain>,
	args: EstimateFeesPerGasParameters<chain, chainOverride, type> & {
		block?: Block
		request?: PrepareTransactionRequestParameters
	},
): Promise<EstimateFeesPerGasReturnType<type>>
//# sourceMappingURL=estimateFeesPerGas.d.ts.map
