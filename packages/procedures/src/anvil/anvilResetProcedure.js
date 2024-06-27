/**
 * Request handler for anvil_reset JSON-RPC requests.
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('./AnvilProcedure.js').AnvilResetProcedure}
 */
export const anvilResetJsonRpcProcedure = (client) => {
	return async (request) => {
		const vm = await client.getVm()
		vm.blockchain.blocksByTag.set(
			'latest',
			vm.blockchain.blocksByTag.get('forked') ?? vm.blockchain.blocksByTag.get('latest'),
		)
		Array.from(vm.blockchain.blocks.values()).forEach((block) => {
			if (!block) return
			vm.blockchain.delBlock(block.hash())
		})
		const stateManager = vm.stateManager.shallowCopy()
		vm.stateManager = /** @type any*/ (stateManager)
		vm.evm.stateManager = /** @type any*/ (stateManager)
		return {
			result: null,
			method: request.method,
			jsonrpc: '2.0',
			...(request.id ? { id: request.id } : {}),
		}
	}
}
