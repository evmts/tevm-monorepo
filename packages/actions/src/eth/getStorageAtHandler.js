import { NoForkUrlSetError } from './getBalanceHandler.js'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { EthjsAddress } from '@tevm/utils'
import { bytesToHex, hexToBytes } from '@tevm/utils'

/**
 * @param {object} options
 * @param {import('@tevm/vm').TevmVm} options.vm
 * @param {string} [options.forkUrl]
 * @returns {import('@tevm/actions-types').EthGetStorageAtHandler}
 */
export const getStorageAtHandler =
	({ forkUrl, vm }) =>
	async (params) => {
		const tag = params.blockTag ?? 'pending'
		if (tag === 'pending' || tag === 'latest') {
			return bytesToHex(
				await vm.stateManager.getContractStorage(
					EthjsAddress.fromString(params.address),
					hexToBytes(params.position),
				),
			)
		}
		if (!forkUrl) {
			throw new NoForkUrlSetError(
				'Fork URL is required if tag is not "latest" or "pending"',
			)
		}
		const fetcher = createJsonRpcFetcher(forkUrl)
		return fetcher
			.request({
				jsonrpc: '2.0',
				method: 'eth_getStorageAt',
				params: [params.address, params.position, tag],
				id: 1,
			})
			.then((res) => {
				if (res.error) {
					/** @type {any} */
					const err = new Error(res.error.message)
					err.name = res.error.code
					err['_tag'] = res.error.code
					throw err
				}
				return /**@type {import('@tevm/utils').Address}*/ (res.result)
			})
	}
