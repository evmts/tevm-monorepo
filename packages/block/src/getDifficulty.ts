import { TypeOutput, toType } from '@tevm/utils'
import type { HeaderData } from './HeaderData.js'

export function getDifficulty(headerData: HeaderData): bigint | null {
	const { difficulty } = headerData
	if (difficulty !== undefined) {
		return toType(difficulty, TypeOutput.BigInt)
	}
	return null
}
