import type { Hex } from './Hex.js'

/**
 * The state of an account as captured by `debug_` traces
 */
export type AccountState = {
	readonly balance: Hex
	readonly nonce: number
	readonly code: Hex
	readonly storage: Record<Hex, Hex>
}
