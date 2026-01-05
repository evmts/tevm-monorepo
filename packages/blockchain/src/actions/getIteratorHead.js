import { InvalidBlockError } from '@tevm/errors'

/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {import('../Chain.js').Chain['getIteratorHead']}
 */
export const getIteratorHead =
	(baseChain) =>
	(name = 'vm') => {
		const head = baseChain.blocksByTag.get(/** @type {import('@tevm/utils').BlockTag}*/ (name))
		if (!head) {
			return Promise.reject(
				new InvalidBlockError(
					`No block with tag ${name} exists. Current tags include ${[...baseChain.blocksByTag.keys()].join(',')}`,
				),
			)
		}
		return Promise.resolve(head)
	}
