/**
 * Request handler for anvil_setBlockGasLimit JSON-RPC requests.
 * Sets the gas limit for all subsequent blocks (persists across blocks).
 *
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilSetBlockGasLimitProcedure}
 * @example
 * ```typescript
 * import { createTevmNode } from '@tevm/node'
 * import { anvilSetBlockGasLimitJsonRpcProcedure } from '@tevm/actions'
 *
 * const client = createTevmNode()
 * const procedure = anvilSetBlockGasLimitJsonRpcProcedure(client)
 *
 * const result = await procedure({
 *   jsonrpc: '2.0',
 *   method: 'anvil_setBlockGasLimit',
 *   params: ['0xE4E1C0'], // 15,000,000 in hex
 *   id: 1,
 * })
 * // result: { jsonrpc: '2.0', method: 'anvil_setBlockGasLimit', result: null, id: 1 }
 *
 * // All subsequent blocks will have this gas limit
 * await client.tevmMine()
 * const block = await client.getVm().then(vm => vm.blockchain.getCanonicalHeadBlock())
 * console.log(block.header.gasLimit) // 15000000n
 * ```
 */
export const anvilSetBlockGasLimitJsonRpcProcedure = (client) => {
	return async (request) => {
		const gasLimit = BigInt(request.params[0])
		client.setNextBlockGasLimit(gasLimit)
		return {
			method: request.method,
			result: null,
			jsonrpc: '2.0',
			...(request.id !== undefined ? { id: request.id } : {}),
		}
	}
}
