import { type Address, type Hex } from 'viem'

/**
 * Tevm action to execute a call on the vm
 */
export type RunCallAction = {
	to?: Address
	caller: Address
	origin?: Address | undefined
	gasLimit?: bigint | undefined
	data: Hex
	value?: bigint | undefined
}
