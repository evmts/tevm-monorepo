import { Block } from '@tevm/block'
import { bytesToHex, numberToHex } from '@tevm/utils'
import { http, createClient } from 'viem'
import { putBlock } from './putBlock.js'

/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {import('@ethereumjs/blockchain').Blockchain['getBlock']}
 */
export const getBlock = (baseChain) => async (blockId) => {
	const block = (() => {
		if (typeof blockId === 'bigint' || typeof blockId === 'number') {
			return baseChain.blocksByNumber.get(BigInt(blockId))
		}
		if (blockId instanceof Uint8Array) {
			return baseChain.blocks.get(blockId)
		}
		/**
		 * @type {never}
		 */
		const typesafeBlockId = blockId
		throw new Error(`Unknown blockid ${typesafeBlockId}`)
	})()

	if (block !== undefined) {
		return block
	}

	if (!baseChain.options.fork?.url) {
		throw new Error(
			blockId instanceof Uint8Array
				? `Block with hash ${bytesToHex(blockId)} does not exist`
				: `Block number ${blockId} does not exist`,
		)
	}

	const request = (() => {
		if (typeof blockId === 'bigint' || typeof blockId === 'number') {
			return {
				method: 'eth_getBlockByNumber',
				params: [numberToHex(blockId), true],
			}
		}
		if (blockId instanceof Uint8Array) {
			return {
				method: 'eth_getBlockByHash',
				params: [bytesToHex(blockId), true],
			}
		}
		/**
		 * @type {never}
		 */
		const typesafeBlockId = blockId
		throw new Error(`Unknown blockid ${typesafeBlockId}`)
	})()

	// TODO this is broken
	const fetchedBlock = Block.fromRPC(
		/** @type any*/ (
			await createClient({
				transport: http(baseChain.options.fork.url),
			}).request(/** @type {any}*/ (request))
		),
	)

	await putBlock(baseChain)(fetchedBlock)

	return getBlock(baseChain)(blockId)
}
