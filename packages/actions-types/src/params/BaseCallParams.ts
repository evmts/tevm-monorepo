import type {
	Address,
	BlockOverrideSet,
	BlockParam,
	Hex,
	StateOverrideSet,
} from '../common/index.js'
import type { BaseParams } from './BaseParams.js'

/**
 * Properties shared accross call-like params
 */
export type BaseCallParams<TThrowOnFail extends boolean = boolean> =
	BaseParams<TThrowOnFail> & {
		/**
		 * Whether or not to update the state or run call in a dry-run. Defaults to `false`
		 */
		createTransaction?: boolean
		/**
		 * The block number or block tag to execute the call at. Defaults to `latest`
		 */
		blockTag?: BlockParam
		/**
		 * Set caller to msg.value of less than msg.value
		 * Defaults to false exceipt for when running scripts
		 * where it is set to true
		 */
		skipBalance?: boolean
		/**
		 * The gas limit for the call.
		 * Defaults to 0xffffff (16_777_215n)
		 */
		gas?: bigint
		/**
		 * The gas price for the call.
		 */
		gasPrice?: bigint
		/**
		 * Refund counter. Defaults to `0`
		 */
		gasRefund?: bigint
		/**
		 * The from address for the call. Defaults to the zero address.
		 * It is also possible to set the `origin` and `caller` addresses seperately using
		 * those options. Otherwise both are set to the `from` address
		 */
		from?: Address
		/**
		 * The address where the call originated from. Defaults to the zero address.
		 * This defaults to `from` address if set otherwise it defaults to the zero address
		 */
		origin?: Address
		/**
		 * The address that ran this code (`msg.sender`). Defaults to the zero address.
		 * This defaults to `from` address if set otherwise it defaults to the zero address
		 */
		caller?: Address
		/**
		 * The value in ether that is being sent to `opts.address`. Defaults to `0`
		 */
		value?: bigint
		/**
		 * The call depth. Defaults to `0`
		 */
		depth?: number
		/**
		 * Addresses to selfdestruct. Defaults to the empty set.
		 */
		selfdestruct?: Set<Address>
		/**
		 * The address of the account that is executing this code (`address(this)`). Defaults to the zero address.
		 */
		to?: Address
		/**
		 * Versioned hashes for each blob in a blob transaction
		 */
		blobVersionedHashes?: Hex[]
		// state override description and api is adapted from geth https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-eth
		/**
		 * The state override set is an optional address-to-state mapping, where each entry specifies some state to be ephemerally overridden prior to executing the call. Each address maps to an object containing:
		 * This option cannot be used when `createTransaction` is set to `true`
		 *
		 * The goal of the state override set is manyfold:

		 * It can be used by DApps to reduce the amount of contract code needed to be deployed on chain. Code that simply returns internal state or does pre-defined validations can be kept off chain and fed to the node on-demand.
		 * It can be used for smart contract analysis by extending the code deployed on chain with custom methods and invoking them. This avoids having to download and reconstruct the entire state in a sandbox to run custom code against.
		 * It can be used to debug smart contracts in an already deployed large suite of contracts by selectively overriding some code or state and seeing how execution changes. Specialized tooling will probably be necessary.
		 * @example
		 * ```ts
		 * {
		 *   "0xd9c9cd5f6779558b6e0ed4e6acf6b1947e7fa1f3": {
		 *     "balance": "0xde0b6b3a7640000"
		 *   },
		 *   "0xebe8efa441b9302a0d7eaecc277c09d20d684540": {
		 *     "code": "0x...",
		 *     "state": {
		 *       "0x...": "0x..."
		 *     }
		 *   }
		 * }
		 * ```
		 */
		stateOverrideSet?: StateOverrideSet
		/**
		 * The fields of this optional object customize the block as part of which the call is simulated. The object contains the following fields:
		 * This option cannot be used when `createTransaction` is set to `true`
		 * Setting the block number to past block will not run in the context of that blocks state. To do that fork that block number first.
		 */
		blockOverrideSet?: BlockOverrideSet
	}
