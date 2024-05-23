import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { EthjsAddress, bytesToHex, hexToBigInt, hexToBytes } from '@tevm/utils'

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
 * @param {import('@tevm/base-client').BaseClient} baseClient
 * @returns {import('@tevm/actions-types').EthGetBalanceHandler}
 */
export const getBalanceHandler =
	(baseClient) =>
	async ({ address, blockTag = 'latest' }) => {
		const vm = await baseClient.getVm()

		if (blockTag === 'latest') {
			const account = await vm.stateManager.getAccount(EthjsAddress.fromString(address))
			return account?.balance ?? 0n
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
			throw new Error(jsonRpcResponse.error.message)
		}
		if (jsonRpcResponse.result === null) {
			return 0n
		}
		// TODO we should do a typeguard here instead of casting
		return hexToBigInt(/** @type {any}*/ (jsonRpcResponse.result))
	}
