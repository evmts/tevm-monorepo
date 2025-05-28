import { createAddress } from '@tevm/address'
import { hexToBytes } from '@tevm/utils'

/**
 * Handles warning for pending transactions in the transaction pool.
 *
 * @param {import('@tevm/node').TevmNode} client - The TEVM base client instance.
 * @param {import('./CallParams.js').CallParams} params - The call parameters.
 * @param {string | undefined} code - The code to execute.
 * @param {string | undefined} deployedBytecode - The deployed bytecode to use.
 * @returns {Promise<void>} A promise that resolves when the check is complete.
 * @throws {never} This function does not throw errors.
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
