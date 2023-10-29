import { Eip1559FeesNotSupportedError } from '../../errors/fee.js'
import { hexToBigInt } from '../../utils/encoding/fromHex.js'
import { getBlock } from './getBlock.js'
import { getGasPrice } from './getGasPrice.js'
/**
 * Returns an estimate for the max priority fee per gas (in wei) for a
 * transaction to be likely included in the next block.
 * Defaults to [`chain.fees.defaultPriorityFee`](/docs/clients/chains.html#fees-defaultpriorityfee) if set.
 *
 * - Docs: https://viem.sh/docs/actions/public/estimateMaxPriorityFeePerGas.html
 *
 * @param client - Client to use
 * @returns An estimate (in wei) for the max priority fee per gas. {@link EstimateMaxPriorityFeePerGasReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { estimateMaxPriorityFeePerGas } from 'viem/actions'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const maxPriorityFeePerGas = await estimateMaxPriorityFeePerGas(client)
 * // 10000000n
 */
export async function estimateMaxPriorityFeePerGas(client, args) {
	return internal_estimateMaxPriorityFeePerGas(client, args)
}
export async function internal_estimateMaxPriorityFeePerGas(client, args) {
	const { block: block_, chain = client.chain, request } = args || {}
	if (typeof chain?.fees?.defaultPriorityFee === 'function') {
		const block = block_ || (await getBlock(client))
		return chain.fees.defaultPriorityFee({
			block,
			client,
			request,
		})
	} else if (chain?.fees?.defaultPriorityFee)
		return chain?.fees?.defaultPriorityFee
	try {
		const maxPriorityFeePerGasHex = await client.request({
			method: 'eth_maxPriorityFeePerGas',
		})
		return hexToBigInt(maxPriorityFeePerGasHex)
	} catch {
		// If the RPC Provider does not support `eth_maxPriorityFeePerGas`
		// fall back to calculating it manually via `gasPrice - baseFeePerGas`.
		// See: https://github.com/ethereum/pm/issues/328#:~:text=eth_maxPriorityFeePerGas%20after%20London%20will%20effectively%20return%20eth_gasPrice%20%2D%20baseFee
		const [block, gasPrice] = await Promise.all([
			block_ ? Promise.resolve(block_) : getBlock(client),
			getGasPrice(client),
		])
		if (typeof block.baseFeePerGas !== 'bigint')
			throw new Eip1559FeesNotSupportedError()
		const maxPriorityFeePerGas = gasPrice - block.baseFeePerGas
		if (maxPriorityFeePerGas < 0n) return 0n
		return maxPriorityFeePerGas
	}
}
//# sourceMappingURL=estimateMaxPriorityFeePerGas.js.map
