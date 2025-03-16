import { createAddress } from '@tevm/address'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { bytesToHex, hexToBigInt, hexToBytes } from '@tevm/utils'
import { getPendingClient } from '../internal/getPendingClient.js'

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
			if ('errors' in mineResult) {
				throw mineResult.errors[0]
			}
			return getBalanceHandler(mineResult.pendingClient)({ address, blockTag: 'latest' })
		}
		const block =
			vm.blockchain.blocks.get(
				/** @type any*/ (
					typeof blockTag === 'string' && blockTag.startsWith('0x')
						? hexToBytes(/** @type {import('@tevm/utils').Hex}*/ (blockTag))
						: blockTag
				),
			) ??
			vm.blockchain.blocksByTag.get(/** @type any*/ (blockTag)) ??
			vm.blockchain.blocksByNumber.get(/** @type any*/ (blockTag))
		const hasStateRoot = block && (await vm.stateManager.hasStateRoot(block.header.stateRoot))
		if (hasStateRoot) {
			const root = vm.stateManager._baseState.stateRoots.get(bytesToHex(block.header.stateRoot))
			return root?.[address]?.balance ?? 0n
		}
		// at this point the block doesn't exist so we must be in forked mode
		if (!baseClient.forkTransport) {
			throw new NoForkUrlSetError()
		}
		const fetcher = createJsonRpcFetcher(baseClient.forkTransport)
		const jsonRpcResponse = await fetcher.request({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_getBalance',
			params: [address, blockTag],
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
