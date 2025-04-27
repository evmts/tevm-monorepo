import type { Block } from '@tevm/block'
import type { StateManager } from '@tevm/state'
import type { TypedTransaction } from '@tevm/tx'

/**
 * Options for the `runTx` method.
 */
export interface RunTxOpts {
	/**
	 * The `@ethereumjs/block` the `tx` belongs to.
	 * If omitted, a default blank block will be used.
	 */
	block?: Block
	/**
	 * An `@ethereumjs/tx` to run
	 */
	tx: TypedTransaction
	/**
	 * If true, skips the nonce check
	 */
	skipNonce?: boolean

	/**
	 * Skip balance checks if true. Adds transaction cost to balance to ensure execution doesn't fail.
	 */
	skipBalance?: boolean

	/**
	 * If true, skips the validation of the tx's gas limit
	 * against the block's gas limit.
	 */
	skipBlockGasLimitValidation?: boolean

	/**
	 * If true, skips the hardfork validation of vm, block
	 * and tx
	 */
	skipHardForkValidation?: boolean

	/**
	 * If true, adds a generated EIP-2930 access list
	 * to the `RunTxResult` returned.
	 *
	 * Option works with all tx types. EIP-2929 needs to
	 * be activated (included in `berlin` HF).
	 *
	 * Note: if this option is used with a custom {@link StateManager} implementation
	 * {@link StateManager.generateAccessList} must be implemented.
	 */
	reportAccessList?: boolean

	/**
	 * If true, adds a hashedKey -> preimages mapping of all touched accounts
	 * to the `RunTxResult` returned.
	 */
	reportPreimages?: boolean

	/**
	 * To obtain an accurate tx receipt input the block gas used up until this tx.
	 */
	blockGasUsed?: bigint

	/**
	 * If true, doesn't cleanup journal or commit state changes. Default is false.
	 * @internal
	 */
	preserveJournal?: boolean
}
