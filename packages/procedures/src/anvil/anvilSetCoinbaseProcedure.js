import { Block, BlockHeader } from '@tevm/block'
import { getAddress } from '@tevm/utils'

/**
 * Request handler for anvil_SetCoinbase JSON-RPC requests.
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('./AnvilProcedure.js').AnvilSetCoinbaseProcedure}
 */
export const anvilSetCoinbaseJsonRpcProcedure = (client) => {
	return async (request) => {
		const vm = await client.getVm()
		const currentBlock = await vm.blockchain.getCanonicalHeadBlock()
		const coinbase = getAddress(request.params[0])
		const newHeader = BlockHeader.fromHeaderData(
			{
				...currentBlock.header.raw(),
				coinbase,
			},
			{
				common: vm.common,
				freeze: false,
				setHardfork: false,
			},
		)
		// TODO this as any is not necessary we shouldn't be doing this instead fix types please
		const newBlock = Block.fromBlockData(
			/** @type {any}*/ ({
				...currentBlock,
				withdrawals: currentBlock.withdrawals,
				header: newHeader,
			}),
			{
				common: vm.common,
				freeze: false,
				setHardfork: false,
			},
		)
		vm.blockchain.putBlock(newBlock)
		return {
			method: request.method,
			result: coinbase,
			jsonrpc: '2.0',
			...(request.id ? { id: request.id } : {}),
		}
	}
}
