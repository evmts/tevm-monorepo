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
 * @param {import('@tevm/base-client').BaseClient['getVm']} options.getVm
 * @param {string} [options.forkUrl]
 * @returns {import('@tevm/actions-types').EthGetBalanceHandler}
 */
export const getBalanceHandler =
	({ getVm, forkUrl }) =>
		async ({ address, blockTag = 'pending' }) => {
			const vm = await getVm()
			createJsonRpcFetcher(forkUrl)
				.request({
					jsonrpc: '2.0',
					id: 1,
					method: 'eth_getBalance',
					params: [address, typeof blockTag === 'bigint' ? numberToHex(blockTag) : blockTag],
				})
				.then((balance) => hexToBigInt(/** @type {import('@tevm/utils').Hex}*/(balance.result)))
		}
