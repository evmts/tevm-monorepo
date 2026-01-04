import { ConsensusAlgorithm } from '@tevm/common'
import { InternalError } from '@tevm/errors'

/**
 * Native Casper (Proof-of-Stake) consensus implementation.
 * Replaces @ethereumjs/blockchain CasperConsensus.
 *
 * This class encapsulates Casper-related consensus functionality when used with the Blockchain class.
 * Since consensus validation moved to the Ethereum consensus layer with Proof-of-Stake,
 * this implementation primarily validates that PoS blocks have difficulty 0.
 *
 * @example
 * ```typescript
 * import { CasperConsensus, createChain } from '@tevm/blockchain'
 *
 * const consensus = new CasperConsensus()
 * const chain = await createChain({
 *   consensus,
 *   // ... other options
 * })
 * ```
 */
export class CasperConsensus {
	/**
	 * The consensus algorithm identifier
	 * @type {import('@tevm/common').ConsensusAlgorithm}
	 */
	algorithm = ConsensusAlgorithm.Casper

	/**
	 * Initialize genesis for consensus mechanism.
	 * No-op for Casper as genesis initialization is handled by the consensus layer.
	 * @param {import('@tevm/block').Block} [_genesisBlock] - genesis block (unused)
	 * @returns {Promise<void>}
	 */
	async genesisInit(_genesisBlock) {}

	/**
	 * Set up consensus mechanism.
	 * No-op for Casper as setup is handled by the consensus layer.
	 * @param {import('./Consensus.js').ConsensusOptions} [_options] - consensus options (unused)
	 * @returns {Promise<void>}
	 */
	async setup(_options) {}

	/**
	 * Validate block consensus parameters.
	 * No-op for Casper as consensus validation is handled by the consensus layer.
	 * @param {import('@tevm/block').Block} [_block] - block to validate (unused)
	 * @returns {Promise<void>}
	 */
	async validateConsensus(_block) {}

	/**
	 * Validate block difficulty.
	 * For Proof-of-Stake blocks, difficulty must be 0.
	 * @param {import('@tevm/block').BlockHeader} header - block header to validate
	 * @returns {Promise<void>}
	 * @throws {InternalError} if difficulty is not 0 for a PoS block
	 */
	async validateDifficulty(header) {
		if (header.difficulty !== 0n) {
			const msg = 'invalid difficulty. PoS blocks must have difficulty 0'
			const errorStr =
				typeof header.errorStr === 'function'
					? header.errorStr()
					: `block number=${header.number} hash=${header.hash?.() ?? 'unknown'}`
			throw new InternalError(`${msg} ${errorStr}`)
		}
	}

	/**
	 * Update consensus on new block.
	 * No-op for Casper as block updates are handled by the consensus layer.
	 * @param {import('@tevm/block').Block} [_block] - new block (unused)
	 * @param {import('@tevm/block').BlockHeader} [_commonAncestor] - common ancestor (unused)
	 * @param {import('@tevm/block').BlockHeader[]} [_ancientHeaders] - ancient headers (unused)
	 * @returns {Promise<void>}
	 */
	async newBlock(_block, _commonAncestor, _ancientHeaders) {}
}
