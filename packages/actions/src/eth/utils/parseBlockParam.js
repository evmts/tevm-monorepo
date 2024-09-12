import { InvalidBlockError } from '@tevm/errors'
import { hexToBigInt, hexToBytes } from '@tevm/utils'

/**
 * @param {import('@tevm/blockchain').Chain} blockchain
 * @param {import('../../common/BlockParam.js').BlockParam} blockParam
 * @returns {Promise<bigint >}
 */
export const parseBlockParam = async (blockchain, blockParam) => {
	if (typeof blockParam === 'number') {
		return BigInt(blockParam)
	}
	if (typeof blockParam === 'bigint') {
		return blockParam
	}
	if (typeof blockParam === 'string' && blockParam.startsWith('0x')) {
		if (blockParam.length === 66) {
			const block = await blockchain.getBlock(hexToBytes(/** @type {import('@tevm/utils').Hex}*/ (blockParam)))
			return BigInt(block.header.number)
		}
		return hexToBigInt(/** @type {import('@tevm/utils').Hex}*/ (blockParam))
	}
	if (blockParam === 'safe') {
		const safeBlock = blockchain.blocksByTag.get('safe')
		// let's handle it here in case we forget to update it later
		if (safeBlock) {
			return safeBlock.header.number
		}
		throw new InvalidBlockError('safe not currently supported as block tag')
	}
	if (blockParam === 'latest' || blockParam === undefined) {
		const safeBlock = blockchain.blocksByTag.get('latest')
		// let's handle it here in case we forget to update it later
		if (safeBlock) {
			return safeBlock.header.number
		}
		throw new InvalidBlockError('latest block does not exist on chain')
	}
	if (blockParam === 'pending') {
		// for pending we need to mine a new block and then handle it
		// let's skip this functionality for now
		throw new InvalidBlockError(
			'Pending not yet supported but will be in future. Consider opening an issue or reaching out on telegram if you need this feature to expediate its release',
		)
	}
	if (blockParam === 'earliest') {
		return BigInt(1)
	}
	if (blockParam === 'finalized') {
		throw new InvalidBlockError('finalized noet yet supported for this feature')
	}
	blockchain.logger.error({ blockParam }, 'Unknown block param pased to blockNumberHandler')
	throw new InvalidBlockError(`Unknown block param ${blockParam} pased to blockNumberHandler`)
}
