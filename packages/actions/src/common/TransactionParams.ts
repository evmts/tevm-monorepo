import type { Address } from './Address.js'
import type { Hex } from './Hex.js'

/**
 * A transaction request object
 */
export type TransactionParams = {
	readonly from: Address
	readonly to?: Address
	readonly gas?: Hex
	readonly gasPrice?: Hex
	readonly value?: Hex
	readonly input: Hex
	readonly nonce?: Hex
}
