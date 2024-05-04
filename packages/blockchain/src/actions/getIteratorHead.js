/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {import('../Chain.js').Chain['getIteratorHead']}
 */
export const getIteratorHead =
	(baseChain) =>
	(name = 'vm') => {
		const head = baseChain.blocksByTag.get(/** @type {import('viem').BlockTag}*/ (name))
		if (!head) {
			throw new Error(
				`No block with tag ${name} exists. Current tags include ${[...baseChain.blocksByTag.keys()].join(',')}`,
			)
		}
		return Promise.resolve(head)
	}
