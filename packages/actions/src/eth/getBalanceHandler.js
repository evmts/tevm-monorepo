import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { EthjsAddress } from '@tevm/utils'
import { hexToBigInt, numberToHex } from '@tevm/utils'

export class NoForkUrlSetError extends Error {
	/**
	 * @type {'NoForkUrlSetError'}
	 */
	_tag = 'NoForkUrlSetError'
	/**
	 * @type {'NoForkUrlSetError'}
	 * @override
	 */
	name = 'NoForkUrlSetError'
}

/**
 * @param {object} options
 * @param {import('@tevm/vm').TevmVm} options.vm
 * @param {string} [options.forkUrl]
 * @returns {import('@tevm/actions-types').EthGetBalanceHandler}
 */
export const getBalanceHandler =
	({ vm, forkUrl }) =>
	async ({ address, blockTag = 'pending' }) => {
		if (blockTag === 'pending') {
			return vm.stateManager
				.getAccount(EthjsAddress.fromString(address))
				.then((account) => account?.balance ?? 0n)
		}
		if (!forkUrl) {
			throw new NoForkUrlSetError(
				'eth_getBalance with blockTag !== "pending" is only supported when forking',
			)
		}
		return createJsonRpcFetcher(forkUrl)
			.request({
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getBalance',
				params: [
					address,
					typeof blockTag === 'bigint' ? numberToHex(blockTag) : blockTag,
				],
			})
			.then((balance) =>
				hexToBigInt(/** @type {import('@tevm/utils').Hex}*/ (balance.result)),
			)
	}
