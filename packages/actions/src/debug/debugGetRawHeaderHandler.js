import { bytesToHex, hexToBigInt } from '@tevm/utils'

/**
 * Returns the RLP-encoded block header by block number or tag
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugHandler.js').DebugGetRawHeaderHandler}
 * @example
 * ```javascript
 * import { createMemoryClient } from '@tevm/memory-client'
 * import { debugGetRawHeaderHandler } from '@tevm/actions'
 *
 * const client = createMemoryClient()
 * const handler = debugGetRawHeaderHandler(client)
 *
 * const rawHeader = await handler({ blockTag: 'latest' })
 * console.log(rawHeader) // '0x...' (hex-encoded RLP)
 * ```
 */
export const debugGetRawHeaderHandler =
	(client) =>
	/**
	 * @param {import('./DebugParams.js').DebugGetRawHeaderParams} params
	 * @returns {Promise<import('./DebugResult.js').DebugGetRawHeaderResult>}
	 */
	async (params) => {
		const { logger, getVm } = client
		logger.debug(params, 'debugGetRawHeaderHandler: executing debug_getRawHeader with params')

		const vm = await getVm()

		// Get the block by number or tag
		const block = await (async () => {
			if (params.blockNumber !== undefined) {
				const blockNum = typeof params.blockNumber === 'bigint' ? params.blockNumber : hexToBigInt(params.blockNumber)
				logger.debug({ blockNum }, 'debugGetRawHeaderHandler: fetching block by number')
				return vm.blockchain.getBlock(blockNum)
			}
			if (params.blockTag !== undefined) {
				logger.debug({ blockTag: params.blockTag }, 'debugGetRawHeaderHandler: fetching block by tag')
				return vm.blockchain.blocksByTag.get(params.blockTag)
			}
			// Default to latest
			logger.debug('debugGetRawHeaderHandler: fetching latest block')
			return vm.blockchain.blocksByTag.get('latest')
		})()

		if (!block) {
			const msg = `Block not found: ${params.blockNumber ?? params.blockTag ?? 'latest'}`
			logger.warn(msg)
			throw new Error(msg)
		}

		logger.debug({ blockNumber: block.header.number }, 'debugGetRawHeaderHandler: serializing header to RLP')

		// Serialize the block header to RLP
		const serialized = block.header.serialize()

		// Convert to hex
		const result = bytesToHex(serialized)

		logger.debug({ result }, 'debugGetRawHeaderHandler: successfully serialized header')

		return result
	}
