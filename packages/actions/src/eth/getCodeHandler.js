import { NoForkUrlSetError } from './getBalanceHandler.js'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { EthjsAddress } from '@tevm/utils'
import { bytesToHex } from '@tevm/utils'

/**
 * @param {object} options
 * @param {import('@tevm/vm').TevmVm} options.vm
 * @param {string}  [options.forkUrl]
 * @returns {import('@tevm/actions-types').EthGetCodeHandler}
 */
export const getCodeHandler =
	({ vm, forkUrl }) =>
	async (params) => {
		const tag = params.blockTag ?? 'pending'
		if (tag === 'pending') {
			return bytesToHex(
				await vm.stateManager.getContractCode(
					EthjsAddress.fromString(params.address),
				),
			)
		}
		if (!forkUrl) {
			throw new NoForkUrlSetError(
				`Cannot eth_getCode for block tag ${tag} without a fork url set. Try passing in a forkUrl option to getCodeHandler.`,
			)
		}
		const fetcher = createJsonRpcFetcher(forkUrl)
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
					throw new Error(
						`Method eth_getCode not supported by fork url ${forkUrl}`,
					)
				}
				throw err
			})
	}
