import type { Block } from '@tevm/block'
import type { Common } from '@tevm/common'
import type { BigIntLike } from '@tevm/utils'

/**
 * Options for running a block.
 */
export interface RunBlockOpts {
	/**
	 * The {@link Block} to process
	 */
	block: Block
	/**
	 * Root of the state trie
	 */
	root?: Uint8Array
	/**
	 * Clearing the StateManager cache.
	 *
	 * If state root is not reset for whatever reason this can be set to `false` for better performance.
	 *
	 * Default: true
	 */
	clearCache?: boolean
	/**
	 * Whether to generate the stateRoot and other related fields.
	 * If `true`, `runBlock` will set the fields `stateRoot`, `receiptTrie`, `gasUsed`, and `bloom` (logs bloom) after running the block.
	 * If `false`, `runBlock` throws if any fields do not match.
	 * Defaults to `false`.
	 */
	generate?: boolean
	/**
	 * If true, will skip "Block validation":
	 * Block validation validates the header (with respect to the blockchain),
	 * the transactions, the transaction trie and the uncle hash.
	 */
	skipBlockValidation?: boolean
	/**
	 * If true, skips the hardfork validation of vm, block
	 * and tx
	 */
	skipHardForkValidation?: boolean
	/**
	 * if true, will skip "Header validation"
	 * If the block has been picked from the blockchain to be executed,
	 * header has already been validated, and can be skipped especially when
	 * consensus of the chain has moved ahead.
	 */
	skipHeaderValidation?: boolean
	/**
	 * If true, skips the nonce check
	 */
	skipNonce?: boolean
	/**
	 * If true, checks the balance of the `from` account for the transaction and sets its
	 * balance equal equal to the upfront cost (gas limit * gas price + transaction value)
	 */
	skipBalance?: boolean
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
	 * If true, adds a hashedKey -> preimages mapping of all touched accounts
	 * to the `RunTxResult` returned.
	 */
	reportPreimages?: boolean
}
