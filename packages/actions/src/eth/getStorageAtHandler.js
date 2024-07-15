import { createAddress } from '@tevm/address'
import { bytesToHex, hexToBytes } from '@tevm/utils'
import { getPendingClient } from '../internal/getPendingClient.js'
import { ForkError, InternalError } from '@tevm/errors'
import { cloneVmWithBlockTag } from '../Call/cloneVmWithBlock.js'

/**
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('./EthHandler.js').EthGetStorageAtHandler}
 */
export const getStorageAtHandler = (client) => async (params) => {
	const vm = await client.getVm()
	const tag = params.blockTag ?? 'latest'
	if (tag === 'pending') {
		return getStorageAtHandler(await getPendingClient(client))({ ...params, blockTag: 'latest' })
	}
	if (tag === 'latest') {
		return bytesToHex(
			await vm.stateManager.getContractStorage(
				createAddress(params.address),
				hexToBytes(params.position, { size: 32 }),
			),
		)
	}
	const block = await vm.blockchain.getBlockByTag(tag)
	const clonedVm = await cloneVmWithBlockTag(client, block)

	if (clonedVm instanceof ForkError || clonedVm instanceof InternalError) {
		throw clonedVm
	}

	return getStorageAtHandler({ ...client, getVm: () => Promise.resolve(clonedVm) })({ ...params, blockTag: 'latest' })
}
