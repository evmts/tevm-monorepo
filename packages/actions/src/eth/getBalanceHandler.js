import { Address } from '@ethereumjs/util'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { hexToBigInt, numberToHex } from 'viem'

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
 * @param {import('@ethereumjs/vm').VM} options.vm
 * @param {string} [options.forkUrl]
 * @returns {import('@tevm/actions-types').EthGetBalanceHandler}
 */
export const getBalanceHandler =
	({ vm, forkUrl }) =>
	async ({ address, blockTag = 'pending' }) => {
		if (blockTag === 'pending') {
			return vm.stateManager
				.getAccount(Address.fromString(address))
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
				hexToBigInt(/** @type {import('viem').Hex}*/ (balance.result)),
			)
	}
