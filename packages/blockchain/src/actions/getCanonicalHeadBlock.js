/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {import('@ethereumjs/blockchain').Blockchain['getCanonicalHeadBlock']}
 */
export const getCanonicalHeadBlock = (baseChain) => () => {
	const block = baseChain.blocksByTag.get('latest')
	if (!block) {
		throw new Error('No cannonical head exists on blockchain')
	}
	return Promise.resolve(block)
}
