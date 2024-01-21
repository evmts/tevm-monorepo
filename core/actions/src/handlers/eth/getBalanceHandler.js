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
 * @param {import('@ethereumjs/evm').EVM['stateManager']} options.stateManager
 * @param {string} [options.forkUrl]
 * @returns {import('@tevm/actions-spec').EthGetBalanceHandler}
 */
export const getBalanceHandler =
	({ stateManager, forkUrl }) =>
		async ({ address, blockTag, blockNumber }) => {
			/**
			 * @type {import('viem').BlockTag | bigint}
			 */
			const tag = blockNumber ?? blockTag ?? 'pending'

			if (tag === 'pending') {
				return stateManager
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
					params: [address, typeof tag === 'bigint' ? numberToHex(tag) : tag],
				})
				.then((balance) => hexToBigInt(/** @type {import('viem').Hex}*/(balance.result)))
		}
