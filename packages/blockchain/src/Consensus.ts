import type { Block, BlockHeader } from '@tevm/block'
import type { ConsensusAlgorithm } from '@tevm/common'
import type { Chain } from './Chain.js'

/**
 * Options when initializing a consensus implementation.
 * @example
 * ```typescript
 * import type { ConsensusOptions } from '@tevm/blockchain'
 *
 * const options: ConsensusOptions = {
 *   blockchain: myChain
 * }
 * ```
 */
export interface ConsensusOptions {
	blockchain: Chain
}

/**
 * Interface that a consensus class needs to implement.
 * Native implementation replacing @ethereumjs/blockchain Consensus interface.
 * @example
 * ```typescript
 * import type { Consensus } from '@tevm/blockchain'
 * import { ConsensusAlgorithm } from '@tevm/common'
 *
 * class MyConsensus implements Consensus {
 *   algorithm = ConsensusAlgorithm.Casper
 *   async genesisInit() {}
 *   async setup() {}
 *   async validateConsensus() {}
 *   async validateDifficulty() {}
 *   async newBlock() {}
 * }
 * ```
 */
export interface Consensus {
	/**
	 * The consensus algorithm being used
	 */
	algorithm: ConsensusAlgorithm | string

	/**
	 * Initialize genesis for consensus mechanism
	 * @param genesisBlock - genesis block
	 */
	genesisInit(genesisBlock: Block): Promise<void>

	/**
	 * Set up consensus mechanism
	 */
	setup(options: ConsensusOptions): Promise<void>

	/**
	 * Validate block consensus parameters
	 * @param block - block to be validated
	 */
	validateConsensus(block: Block): Promise<void>

	/**
	 * Validate block difficulty
	 * @param header - block header to validate
	 */
	validateDifficulty(header: BlockHeader): Promise<void>

	/**
	 * Update consensus on new block
	 * @param block - new block
	 * @param commonAncestor - common ancestor block header (optional)
	 * @param ancientHeaders - array of ancestor block headers (optional)
	 */
	newBlock(block: Block, commonAncestor?: BlockHeader, ancientHeaders?: BlockHeader[]): Promise<void>
}
