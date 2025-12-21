import { bytesToHex, hexToBigInt } from '@tevm/utils'

/**
 * Returns the RLP-encoded block by block number or tag
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugHandler.js').DebugGetRawBlockHandler}
 * @example
 * ```javascript
 * import { createMemoryClient } from '@tevm/memory-client'
 * import { debugGetRawBlockHandler } from '@tevm/actions'
 *
 * const client = createMemoryClient()
 * const handler = debugGetRawBlockHandler(client)
 *
 * const rawBlock = await handler({ blockTag: 'latest' })
 * console.log(rawBlock) // '0x...' (hex-encoded RLP)
 * ```
 */
export const debugGetRawBlockHandler =
	(client) =>
	/**
	 * @param {import('./DebugParams.js').DebugGetRawBlockParams} params
	 * @returns {Promise<import('./DebugResult.js').DebugGetRawBlockResult>}
	 */
	async (params) => {
		const { logger, getVm } = client
		logger.debug(params, 'debugGetRawBlockHandler: executing debug_getRawBlock with params')

		const vm = await getVm()

		// Get the block by number or tag
		const block = await (async () => {
			if (params.blockNumber !== undefined) {
				const blockNum =
					typeof params.blockNumber === 'bigint'
						? params.blockNumber
						: hexToBigInt(/** @type {import('@tevm/utils').Hex} */ (params.blockNumber))
				logger.debug({ blockNum }, 'debugGetRawBlockHandler: fetching block by number')
				return vm.blockchain.getBlock(blockNum)
			}
			if (params.blockTag !== undefined) {
				logger.debug({ blockTag: params.blockTag }, 'debugGetRawBlockHandler: fetching block by tag')
				return vm.blockchain.blocksByTag.get(params.blockTag)
			}
			// Default to latest
			logger.debug('debugGetRawBlockHandler: fetching latest block')
			return vm.blockchain.blocksByTag.get('latest')
		})()

		if (!block) {
			const msg = `Block not found: ${params.blockNumber ?? params.blockTag ?? 'latest'}`
			logger.warn(msg)
			throw new Error(msg)
		}

		logger.debug({ blockNumber: block.header.number }, 'debugGetRawBlockHandler: serializing block to RLP')

		// Serialize the block to RLP
		const serialized = block.serialize()

		// Convert to hex
		const result = bytesToHex(serialized)

		logger.debug({ result }, 'debugGetRawBlockHandler: successfully serialized block')

		return result
	}
