import { getForkClient } from './getForkClient.js'

/**
 * Pins moving fork tags before caching remote state.
 * @param {import('../BaseState.js').BaseState} baseState
 * @returns {Promise<void>}
 */
export const resolveForkBlockTag = async (baseState) => {
	const fork = baseState.options.fork
	if (!fork?.transport || (fork.blockTag !== undefined && fork.blockTag !== 'latest')) {
		return
	}
	const client = getForkClient(baseState)
	fork.blockTag = await client.getBlockNumber()
}
