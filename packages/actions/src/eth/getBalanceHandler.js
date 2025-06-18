import { createAddress } from '@tevm/address'
import { NoForkUrlSetError } from '@tevm/errors'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { bytesToHex, hexToBigInt, numberToHex } from '@tevm/utils'
import { getPendingClient } from '../internal/getPendingClient.js'

/**
 * @param {import('@tevm/node').TevmNode} baseClient
 * @returns {import('./EthHandler.js').EthGetBalanceHandler}
 */
export const getBalanceHandler =
	(baseClient) =>
	async ({ address, blockTag = 'latest' }) => {
		const vm = await baseClient.getVm()

		if (blockTag === 'latest') {
			const account = await vm.stateManager.getAccount(createAddress(address))
			return account?.balance ?? 0n
		}
		if (blockTag === 'pending') {
			const mineResult = await getPendingClient(baseClient)
			if (mineResult.errors) {
				throw mineResult.errors[0]
			}
			return getBalanceHandler(mineResult.pendingClient)({ address, blockTag: 'latest' })
		}
		const block =
			vm.blockchain.blocks.get(/** @type any*/ (blockTag)) ??
			vm.blockchain.blocksByTag.get(/** @type any*/ (blockTag)) ??
			vm.blockchain.blocksByNumber.get(/** @type any*/ (blockTag))
		const hasStateRoot = block && (await vm.stateManager.hasStateRoot(block.header.stateRoot))
		if (hasStateRoot) {
			const root = vm.stateManager._baseState.stateRoots.get(bytesToHex(block.header.stateRoot))
			if (root?.[address]) return root[address].balance
		}
		// at this point the block doesn't exist or doesn't have state so we must be in forked mode
		if (!baseClient.forkTransport) {
			throw new NoForkUrlSetError('No fork url set')
		}
		const fetcher = createJsonRpcFetcher(baseClient.forkTransport)
		const jsonRpcResponse = await fetcher.request({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_getBalance',
			params: [address, typeof blockTag === 'bigint' ? numberToHex(blockTag) : blockTag],
		})
		if (jsonRpcResponse.error) {
			// TODO we should parse this into the correct error type
			throw jsonRpcResponse.error
		}
		if (jsonRpcResponse.result === null) {
			return 0n
		}
		// TODO we should do a typeguard here instead of casting
		return hexToBigInt(/** @type {any}*/ (jsonRpcResponse.result))
	}
