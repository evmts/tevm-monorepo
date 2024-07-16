import { InternalError } from '@tevm/errors'

/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {import('../Chain.js').Chain['getCanonicalHeadBlock']}
 */
export const getCanonicalHeadBlock = (baseChain) => async () => {
	await baseChain.ready()
	const block = baseChain.blocksByTag.get('latest')
	if (!block) {
		return Promise.reject(new InternalError('No cannonical head exists on blockchain'))
	}
	return Promise.resolve(block)
}
