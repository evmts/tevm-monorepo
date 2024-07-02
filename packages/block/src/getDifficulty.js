import { TypeOutput, toType } from '@tevm/utils'

/**
 * @param {import('./HeaderData.js').HeaderData} headerData
 * @returns {bigint | null}
 */
export function getDifficulty(headerData) {
	const { difficulty } = headerData
	if (difficulty !== undefined) {
		return toType(difficulty, TypeOutput.BigInt)
	}
	return null
}
