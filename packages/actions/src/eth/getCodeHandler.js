import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { EthjsAddress } from '@tevm/utils'
import { bytesToHex } from '@tevm/utils'
import { NoForkUrlSetError } from './getBalanceHandler.js'

/**
 * @param {object} options
 * @param {import('@tevm/base-client').BaseClient['getVm']} options.getVm
 * @param {{request: import('viem').EIP1193RequestFn}}  [options.forkClient]
 * @returns {import('@tevm/actions-types').EthGetCodeHandler}
 */
export const getCodeHandler =
	({ getVm, forkClient }) =>
	async (params) => {
		const vm = await getVm()
		const tag = params.blockTag ?? 'pending'
		if (tag === 'latest') {
			return bytesToHex(await vm.stateManager.getContractCode(EthjsAddress.fromString(params.address)))
		}
		if (!forkClient) {
			throw new NoForkUrlSetError(
				'getCode is not supported for any block tags other than latest atm. This will be fixed in the next few releases',
			)
		}
		const fetcher = createJsonRpcFetcher(forkClient)
		return fetcher
			.request({
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getCode',
				params: [params.address, tag],
			})
			.then((res) => {
				if (res.error) {
					/**
					 * @type any
					 */
					const err = new Error(res.error.message)
					err._tag = res.error.code
					err.name = res.error.code
					throw err
				}
				return /** @type {import('@tevm/utils').Hex}*/ (res.result)
			})
			.catch((err) => {
				// TODO handle this in a strongly typed way
				if (err.name === 'MethodNotFound') {
					throw new Error(`Method eth_getCode not supported by fork url ${forkClient}`)
				}
				throw err
			})
	}
