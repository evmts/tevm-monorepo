import { UnknownBlockError } from '@tevm/errors'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { bytesToHex, getAddress, hexToBytes, isHex } from '@tevm/utils'
import { getPendingClient } from '../internal/getPendingClient.js'

/**
 * @param {import('@tevm/node').TevmNode} baseClient
 * @returns {import('./EthHandler.js').EthGetCodeHandler}
 */
export const getCodeHandler = (baseClient) => async (params) => {
	const vm = await baseClient.getVm()
	const tag = params.blockTag ?? 'latest'

	if (tag === 'pending') {
		const mineResult = await getPendingClient(baseClient)
		if ('errors' in mineResult) {
			throw mineResult.errors[0]
		}
		return getCodeHandler(mineResult.pendingClient)({ ...params, blockTag: 'latest' })
	}

	const block = await (async () => {
		if (tag === 'latest' || tag === 'earliest' || tag === 'safe' || tag === 'finalized') {
			return vm.blockchain.blocksByTag.get(tag)
		}
		if (isHex(tag)) {
			return vm.blockchain.getBlock(hexToBytes(tag))
		}
		return vm.blockchain.getBlock(tag)
	})()

	if (!block) {
		throw new UnknownBlockError(`Unable to find block ${tag}`)
	}
	/**
	 * @type {import('viem').Hex | undefined}
	 */
	let deployedBytecode = undefined
	// if we have the state cached already grab it from there
	if (await vm.stateManager.hasStateRoot(block.header.stateRoot)) {
		deployedBytecode = vm.stateManager._baseState.stateRoots.get(bytesToHex(block.header.stateRoot))?.[
			getAddress(params.address)
		]?.deployedBytecode
	}
	// if we don't have it cached and we got a fork client try to fetch it from fork
	if (!deployedBytecode && baseClient.forkTransport) {
		const fetcher = createJsonRpcFetcher(baseClient.forkTransport)
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
					throw new Error('Method eth_getCode not supported by fork url')
				}
				throw err
			})
	}
	return deployedBytecode ?? bytesToHex(new Uint8Array())
}
