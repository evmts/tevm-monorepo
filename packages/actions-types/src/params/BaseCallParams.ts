import type { Address, BlockParam, Hex } from '../common/index.js'
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
	}
