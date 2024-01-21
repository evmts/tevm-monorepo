import { NoForkUrlSetError } from './getBalanceHandler.js'
import { Address } from '@ethereumjs/util'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { bytesToHex, hexToBytes } from 'viem'

/**
 * @param {object} options
 * @param {import('@ethereumjs/evm').EVM['stateManager']} options.stateManager
 * @param {string} [options.forkUrl]
 * @returns {import('@tevm/actions-spec').EthGetStorageAtHandler}
 */
export const getStorageAtHandler =
	({ forkUrl, stateManager }) =>
	async (params) => {
		const tag = params.tag ?? 'pending'
		if (tag === 'pending' || tag === 'latest') {
			return bytesToHex(
				await stateManager.getContractStorage(
					Address.fromString(params.address),
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
				params: [params.address, params.position, params.tag],
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
				return res.result
			})
	}
