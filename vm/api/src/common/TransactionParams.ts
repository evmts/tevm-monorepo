import type { Address } from 'abitype'
import type { Hex } from 'viem'

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
