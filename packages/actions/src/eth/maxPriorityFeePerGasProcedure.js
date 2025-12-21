import { numberToHex } from '@tevm/utils'
import { maxPriorityFeePerGasHandler } from './maxPriorityFeePerGasHandler.js'

/**
 * JSON-RPC procedure for `eth_maxPriorityFeePerGas`.
 * @param {Parameters<typeof maxPriorityFeePerGasHandler>[0]} options
 * @returns {import('./EthProcedure.js').EthMaxPriorityFeePerGasJsonRpcProcedure}
 * @example
 * ```javascript
 * import { createTevmNode } from '@tevm/node'
 * import { maxPriorityFeePerGasProcedure } from '@tevm/actions'
 *
 * const node = createTevmNode()
 * const procedure = maxPriorityFeePerGasProcedure(node)
 * const response = await procedure({
 *   jsonrpc: '2.0',
 *   method: 'eth_maxPriorityFeePerGas',
 *   id: 1,
 *   params: [],
 * })
 * console.log(response.result) // e.g., '0x3b9aca00' (1 gwei in hex)
 * ```
 */
export const maxPriorityFeePerGasProcedure =
	({ getVm, forkTransport }) =>
	async (req) => ({
		...(req.id ? { id: req.id } : {}),
		jsonrpc: '2.0',
		method: req.method,
		result: await maxPriorityFeePerGasHandler(/** @type any*/ ({ getVm, forkTransport }))({}).then(numberToHex),
	})
