// This file is adapted from ethereumjs and thus carries the same license
import type { Common } from '@tevm/common'
import type { BigIntLike } from '@tevm/utils'
import type { BlockHeader } from './header.js'
import type { VerkleExecutionWitness } from './VerkleExecutionWitness.js'

/**
 * An object to set to which blockchain the blocks and their headers belong. This could be specified
 * using a {@link Common} object, or `chain` and `hardfork`. Defaults to mainnet without specifying a
 * hardfork.
 */
export interface BlockOptions {
	/**
	 * A {@link Common} object defining the chain and the hardfork a block/block header belongs to.
	 *
	 * Object will be internally copied so that tx behavior don't incidentally
	 * change on future HF changes.
	 *
	 * Default: {@link Common} object set to `mainnet` and the HF currently defined as the default
	 * hardfork in the {@link Common} class.
	 *
	 * Current default hardfork: `merge`
	 */
	common: Common
	/**
	 * Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
	 * for older Hfs.
	 *
	 * Additionally it is possible to pass in a specific TD value to support live-Merge-HF
	 * transitions. Note that this should only be needed in very rare and specific scenarios.
	 *
	 * Default: `false` (HF is set to whatever default HF is set by the {@link Common} instance)
	 */
	setHardfork?: boolean | BigIntLike
	/**
	 * If a preceding {@link BlockHeader} (usually the parent header) is given the preceding
	 * header will be used to calculate the difficulty for this block and the calculated
	 * difficulty takes precedence over a provided static `difficulty` value.
	 *
	 * Note that this option has no effect on networks other than PoW/Ethash networks
	 * (respectively also deactivates on the Merge HF switching to PoS/Casper).
	 */
	calcDifficultyFromHeader?: BlockHeader
	/**
	 * A block object by default gets frozen along initialization. This gives you
	 * strong additional security guarantees on the consistency of the block parameters.
	 * It also enables block hash caching when the `hash()` method is called multiple times.
	 *
	 * If you need to deactivate the block freeze - e.g. because you want to subclass block and
	 * add additional properties - it is strongly encouraged that you do the freeze yourself
	 * within your code instead.
	 *
	 * Default: true
	 */
	freeze?: boolean
	/**
	 * Provide a clique signer's privateKey to seal this block.
	 * Will throw if provided on a non-PoA chain.
	 */
	cliqueSigner?: Uint8Array
	/**
	 *  Skip consensus format validation checks on header if set. Defaults to false.
	 */
	skipConsensusFormatValidation?: boolean

	executionWitness?: VerkleExecutionWitness
}
