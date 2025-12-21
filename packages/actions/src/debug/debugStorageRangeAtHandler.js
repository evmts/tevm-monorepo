import { createAddress } from '@tevm/address'
import { bytesToHex, hexToBigInt } from '@tevm/utils'

/**
 * Returns a range of storage slots for an account at a specific block
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugHandler.js').DebugStorageRangeAtHandler}
 * @example
 * ```typescript
 * import { createTevmNode } from 'tevm/node'
 * import { debugStorageRangeAtHandler } from 'tevm/actions'
 *
 * const client = createTevmNode()
 *
 * const storageRange = debugStorageRangeAtHandler(client)
 *
 * const result = await storageRange({
 *   blockTag: 'latest',
 *   txIndex: 0,
 *   address: '0x1234...',
 *   startKey: '0x0',
 *   maxResult: 100
 * })
 * console.log(result.storage) // Storage entries
 * console.log(result.nextKey) // Next key for pagination
 * ```
 */
export const debugStorageRangeAtHandler = (client) => async (params) => {
	const { logger, getVm } = client
	logger.debug(params, 'debugStorageRangeAtHandler: executing storage range at with params')

	const vm = await getVm()
	const { blockTag, txIndex, address, startKey, maxResult } = params

	// Normalize blockTag to bigint or tag string
	let normalizedBlockTag
	if (typeof blockTag === 'string') {
		if (
			blockTag === 'latest' ||
			blockTag === 'pending' ||
			blockTag === 'earliest' ||
			blockTag === 'safe' ||
			blockTag === 'finalized'
		) {
			normalizedBlockTag = blockTag
		} else {
			// It's a hex string
			normalizedBlockTag = hexToBigInt(/** @type {import('@tevm/utils').Hex} */ (blockTag))
		}
	} else if (blockTag instanceof Uint8Array) {
		normalizedBlockTag = hexToBigInt(bytesToHex(blockTag))
	} else if (typeof blockTag === 'bigint' || typeof blockTag === 'number') {
		normalizedBlockTag = typeof blockTag === 'number' ? BigInt(blockTag) : blockTag
	} else {
		normalizedBlockTag = 'latest'
	}

	logger.debug({ normalizedBlockTag, txIndex, address }, 'debugStorageRangeAtHandler: normalized parameters')

	// Get the block
	const block = await vm.blockchain.getBlockByTag(normalizedBlockTag)
	logger.debug(
		{ blockNumber: block.header.number, blockHash: bytesToHex(block.hash()) },
		'debugStorageRangeAtHandler: got block',
	)

	// Convert address to Address type
	const addressObj = createAddress(address)

	// Use the state manager's dumpStorageRange method
	if ('dumpStorageRange' in vm.stateManager) {
		const startKeyBigInt = hexToBigInt(startKey)
		const result = await vm.stateManager.dumpStorageRange(addressObj, startKeyBigInt, maxResult)

		logger.debug(
			{ storageCount: Object.keys(result.storage).length, hasNextKey: result.nextKey !== null },
			'debugStorageRangeAtHandler: dumped storage range',
		)

		return result
	}

	throw new Error('Unsupported state manager. Must use a TEVM state manager from @tevm/state package.')
}
