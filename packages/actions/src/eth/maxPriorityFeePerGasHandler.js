import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { hexToBigInt, parseGwei } from '@tevm/utils'
import { blockNumberHandler } from './blockNumberHandler.js'

/**
 * Handler for the `eth_maxPriorityFeePerGas` RPC method.
 * Returns the current maximum priority fee per gas (tip).
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthHandler.js').EthMaxPriorityFeePerGasHandler}
 * @example
 * ```javascript
 * import { createTevmNode } from '@tevm/node'
 * import { maxPriorityFeePerGasHandler } from '@tevm/actions'
 *
 * const node = createTevmNode()
 * const handler = maxPriorityFeePerGasHandler(node)
 * const maxPriorityFeePerGas = await handler()
 * console.log(maxPriorityFeePerGas) // e.g., 1000000000n (1 gwei)
 * ```
 */
export const maxPriorityFeePerGasHandler = ({ forkTransport, getVm, ...client }) => {
	/**
	 * @type {bigint}
	 */
	let maxPriorityFee
	/**
	 * @type {bigint}
	 */
	let blockNumber
	return async () => {
		if (!forkTransport) {
			// Default to 1 gwei for local devnet (same as anvil/hardhat)
			return parseGwei('1')
		}
		const fetcher = createJsonRpcFetcher(forkTransport)
		const newBlockNumber = await blockNumberHandler({ ...client, getVm })({})
		if (!maxPriorityFee || blockNumber !== newBlockNumber) {
			blockNumber = newBlockNumber
			maxPriorityFee = await fetcher
				.request({
					method: 'eth_maxPriorityFeePerGas',
					params: [],
					jsonrpc: '2.0',
					id: 1,
				})
				.then(({ result }) => {
					return hexToBigInt(/** @type {import('@tevm/utils').Hex} */ (result))
				})
		}
		return maxPriorityFee
	}
}
