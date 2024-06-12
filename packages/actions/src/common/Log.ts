import type { Address } from './Address.js'
import type { Hex } from './Hex.js'

/**
 * Generic log information
 */
export type Log = {
	readonly address: Address
	readonly topics: Hex[]
	readonly data: Hex
}
