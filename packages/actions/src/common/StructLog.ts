import type { Hex } from './Hex.js'

export type StructLog = {
	readonly depth: number
	readonly gas: bigint
	readonly gasCost: bigint
	readonly op: string
	readonly pc: number
	readonly stack: Array<Hex>
	readonly error?: {
		error: string
		errorType: string
	}
}
