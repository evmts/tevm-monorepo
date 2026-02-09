import { createAddress } from '@tevm/address'
import { ForkError, InternalError } from '@tevm/errors'
import { bytesToHex, hexToBytes } from '@tevm/utils'
import { cloneVmWithBlockTag } from '../Call/cloneVmWithBlock.js'
import { getPendingClient } from '../internal/getPendingClient.js'

/**
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthHandler.js').EthGetStorageAtHandler}
 */
export const getStorageAtHandler = (client) => async (params) => {
	const vm = await client.getVm()
	const tag = params.blockTag ?? 'latest'
	if (tag === 'pending') {
		const mineResult = await getPendingClient(client)
		if (mineResult.errors) {
			throw mineResult.errors[0]
		}
		return getStorageAtHandler(mineResult.pendingClient)({ ...params, blockTag: 'latest' })
	}
	if (tag === 'latest') {
		const rawStorage = await vm.stateManager.getStorage(
			createAddress(params.address),
			hexToBytes(params.position, { size: 32 }),
		)
		// Left-pad storage value to 32 bytes (Ethereum storage values are big-endian)
		const padded = new Uint8Array(32)
		padded.set(rawStorage, 32 - rawStorage.length)
		return bytesToHex(padded, { size: 32 })
	}
	const block = await vm.blockchain.getBlockByTag(tag)
	const clonedVm = await cloneVmWithBlockTag(client, block)

	if (clonedVm instanceof ForkError || clonedVm instanceof InternalError) {
		throw clonedVm
	}

	return getStorageAtHandler({ ...client, getVm: () => Promise.resolve(clonedVm) })({ ...params, blockTag: 'latest' })
}
