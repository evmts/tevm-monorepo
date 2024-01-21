import type { Address } from 'abitype'
import type { Hex } from 'viem'

/**
 * Generic log information
 */
export type Log = {
	readonly address: Address
	readonly topics: Hex[]
	readonly data: Hex
}
