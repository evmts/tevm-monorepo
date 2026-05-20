import { getForkClient } from './getForkClient.js'

/**
 * Pins moving fork tags before caching remote state.
 * @param {import('../BaseState.js').BaseState} baseState
 * @returns {Promise<void>}
 */
export const resolveForkBlockTag = async (baseState) => {
	const fork = baseState.options.fork
	if (!fork?.transport) {
		return
	}
	const client = getForkClient(baseState)
	if (fork.blockTag === 'pending') {
		throw new Error('Cannot use pending as a fork block tag')
	}
	if (typeof fork.blockTag === 'bigint' && fork.blockHash !== undefined) {
		const block = await client.getBlock({ blockNumber: fork.blockTag })
		if (block.hash !== fork.blockHash) {
			throw new Error(`Fork block ${fork.blockTag} changed from ${fork.blockHash} to ${block.hash}`)
		}
		return
	}
	const block =
		typeof fork.blockTag === 'bigint'
			? await client.getBlock({ blockNumber: fork.blockTag })
			: await client.getBlock({ blockTag: fork.blockTag ?? 'latest' })
	fork.blockTag = block.number
	fork.blockHash = /** @type {import('@tevm/utils').Hex} */ (block.hash)
}
