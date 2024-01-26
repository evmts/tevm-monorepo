import type { Block } from '../common/Block.js'
import { type Address, type Hex } from 'viem'

/**
 * Properties shared accross call-like params
 */
export type BaseCallParams = {
	/**
	 * The `block` the `tx` belongs to. If omitted a default blank block will be used.
	 */
	block?: Partial<Block>
	/**
	 * Set caller to msg.value of less than msg.value
	 * Defaults to false exceipt for when running scripts
	 * where it is set to true
	 */
	skipBalance?: boolean
	/**
	 * Refund counter. Defaults to `0`
	 */
	gasRefund?: bigint
	/**
	 * The gas price for the call. Defaults to `0`
	 */
	gasPrice?: bigint
	/**
	 * The gas price for the call. Defaults to `0`
	 */
	gas?: bigint
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
