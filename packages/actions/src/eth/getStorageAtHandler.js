import { createAddress } from '@tevm/address'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { bytesToHex, hexToBytes } from '@tevm/utils'
import { NoForkUrlSetError } from './getBalanceHandler.js'

/**
 * @param {object} options
 * @param {import('@tevm/base-client').BaseClient['getVm']} options.getVm
 * @param {{request: import('viem').EIP1193RequestFn}} [options.forkClient]
 * @returns {import('./EthHandler.js').EthGetStorageAtHandler}
 */
export const getStorageAtHandler =
	({ forkClient, getVm }) =>
	async (params) => {
		const vm = await getVm()
		const tag = params.blockTag ?? 'pending'
		if (tag === 'latest') {
			return bytesToHex(
				await vm.stateManager.getContractStorage(
					createAddress(params.address),
					hexToBytes(params.position, { size: 32 }),
				),
			)
		}
		if (!forkClient) {
			throw new NoForkUrlSetError(
				'No forkurl set. Block tags other than latest for getStorageAt has not yet been implemented',
			)
		}
		const fetcher = createJsonRpcFetcher(forkClient)
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
					err._tag = res.error.code
					throw err
				}
				return /**@type {import('@tevm/utils').Address}*/ (res.result)
			})
	}
