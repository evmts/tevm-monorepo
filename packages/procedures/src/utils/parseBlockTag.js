import { hexToBigInt } from '@tevm/utils'

/**
 * @param {import('@tevm/utils').Hex | import('@tevm/utils').BlockTag} blockTag
 * @returns {bigint | import('@tevm/utils').Hex | import('@tevm/utils').BlockTag}
 */
export const parseBlockTag = (blockTag) => {
	const blockHashLength = 64 + '0x'.length
	const isBlockNumber = typeof blockTag === 'string' && blockTag.startsWith('0x') && blockTag.length !== blockHashLength
	if (isBlockNumber) {
		return hexToBigInt(/** @type {import('@tevm/utils').Hex}*/ (blockTag))
	}
	return blockTag
}
