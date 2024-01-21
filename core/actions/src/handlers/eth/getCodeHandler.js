import { NoForkUrlSetError } from './getBalanceHandler.js'
import { Address } from '@ethereumjs/util'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { bytesToHex } from 'viem'

/**
 * @param {object} options
 * @param {import('@ethereumjs/evm').EVM['stateManager']} options.stateManager
 * @param {string}  [options.forkUrl]
 * @returns {import('@tevm/actions-spec').EthGetCodeHandler}
 */
export const getCodeHandler =
	({ stateManager, forkUrl }) =>
		async (params) => {
			const tag = params.tag || 'pending'
			if (tag === 'pending') {
				return bytesToHex(
					await stateManager.getContractCode(Address.fromString(params.address)),
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
					return /** @type {import('viem').Hex}*/(res.result)
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
