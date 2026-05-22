import { createAddress } from '@tevm/address'
import { hexToBytes } from '@tevm/utils'

/**
 * Handles warning for pending transactions in the transaction pool.
 *
 * @param {import('@tevm/node').TevmNode} client
 * @param {import('./CallParams.js').CallParams} params
 * @param {string | undefined} code
 * @param {string | undefined} deployedBytecode
 * @returns {Promise<void>}
 * @throws {never}
 */
export const handlePendingTransactionsWarning = async (client, params, code, deployedBytecode) => {
	if (
		code === undefined &&
		deployedBytecode === undefined &&
		params.to !== undefined &&
		params.data !== undefined &&
		hexToBytes(params.data).length > 0
	) {
		const vm = await client.getVm()
		const isCode = await vm.stateManager
			.getCode(createAddress(params.to))
			.then((code) => code.length > 0)
			.catch(() => false)
		const txPool = await client.getTxPool()
		if (!isCode && txPool.txsInPool > 0) {
			client.logger.warn(
				`No code found for contract address ${params.to}. But there ${
					txPool.txsInPool === 1 ? 'is' : 'are'
				} ${txPool.txsInPool} pending tx in tx pool. Did you forget to mine a block?`,
			)
		}
	}
}
