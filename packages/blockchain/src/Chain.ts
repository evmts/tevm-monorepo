import { type BlockchainEvent, type Consensus, type OnBlock } from '@ethereumjs/blockchain'
import type { Block, BlockHeader } from '@tevm/block'
import type { AsyncEventEmitter, BlockTag, Hex } from '@tevm/utils'
import type { BaseChain } from './BaseChain.js'

/**
VM:
putBlock
validateHeader (not needed if you use VMs runBlock with skipHeaderValidation = true)
shallowCopy
*/

/**
 * Blockchain
 */
export type Chain = {} & BaseChain & {
		// for type compatability we must also implement some unused methods
		/**
		 * Returns a shallow copy of the blockchain that may share state with the original
		 */
		shallowCopy: () => Chain
		deepCopy: () => Promise<Chain>
		consensus: Consensus
		/**
		 * Adds a block to the blockchain.
		 *
		 * @param block - The block to be added to the blockchain.
		 */
		putBlock(block: Block): Promise<void>

		/**
		 * Deletes a block from the blockchain. All child blocks in the chain are
		 * deleted and any encountered heads are set to the parent block.
		 *
		 * @param blockHash - The hash of the block to be deleted
		 */
		delBlock(blockHash: Uint8Array): Promise<void>

		/**
		 * Returns a block by its hash or number.
		 */
		getBlock(blockId: Uint8Array | number | bigint): Promise<Block>

		/**
		 * Gets block given one of the following inputs:
		 * - Hex block hash
		 * - Hex block number (if length is 32 bytes, it is treated as a hash)
		 * - Uint8Array block hash
		 * - Number block number
		 * - BigInt block number
		 * - BlockTag block tag
		 * - Named block tag (e.g. 'latest', 'earliest', 'pending')
		 * @throws {UnknownBlockError} - If the block is not found
		 * @throw {InvalidBlockTagError} - If the block tag is invalid}
		 */
		getBlockByTag(blockTag: Hex | Uint8Array | number | bigint | BlockTag): Promise<Block>

		/**
		 * Iterates through blocks starting at the specified iterator head and calls
		 * the onBlock function on each block.
		 *
		 * @param name - Name of the state root head
		 * @param onBlock - Function called on each block with params (block: Block,
		 * @param maxBlocks - optional maximum number of blocks to iterate through
		 * reorg: boolean)
		 */
		iterator(name: string, onBlock: OnBlock, maxBlocks?: number, releaseLockOnCallback?: boolean): Promise<number>

		/**
		 * Validates a block header, throwing if invalid. It is being validated against the reported `parentHash`.
		 * @param header - header to be validated
		 * @param height - If this is an uncle header, this is the height of the block that is including it
		 */
		validateHeader(header: BlockHeader, height?: bigint): Promise<void>

		/**
		 * Returns the specified iterator head.
		 *
		 * @param name - Optional name of the iterator head (default: 'vm')
		 */
		getIteratorHead(name?: string): Promise<Block>

		/**
		 * Set header hash of a certain `tag`.
		 * When calling the iterator, the iterator will start running the first child block after the header hash currently stored.
		 * @param tag - The tag to save the headHash to
		 * @param headHash - The head hash to save
		 */
		setIteratorHead(tag: string, headHash: Uint8Array): Promise<void>

		/**
		 * Gets total difficulty for a block specified by hash and number
		 */
		getTotalDifficulty?(hash: Uint8Array, number?: bigint): Promise<bigint>

		/**
		 * Returns the latest full block in the canonical chain.
		 */
		getCanonicalHeadBlock(): Promise<Block>

		/**
		 * Optional events emitter
		 */
		events?: AsyncEventEmitter<BlockchainEvent>
	}
