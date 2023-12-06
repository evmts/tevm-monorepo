import type { Tevm } from '../tevm.js'
import { Address as EthjsAddress } from '@ethereumjs/util'
import { Address as ZAddress } from 'abitype/zod'
import { type Address, type Hex, hexToBytes, maxInt256 } from 'viem'
import { z } from 'zod'

// TODO replace with abitype https://github.com/wevm/abitype/pull/218
const hexRegex = /^0x[0-9a-fA-F]*$/
const ZHex = z.string().transform((value, ctx) => {
	if (!hexRegex.test(value)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'value must be a hex string',
		})
	}
	return value as Hex
})

export const CallActionValidator = z.object({
	to: ZAddress.describe('the address to send call to'),
	caller: ZAddress.describe('the address of the caller'),
	origin: ZAddress.optional().describe('the address of the origin'),
	gasLimit: z.bigint().optional().describe('the gas limit'),
	data: ZHex.describe('the data to send'),
	value: z.bigint().optional().describe('the eth value to send in wei'),
})

/**
 * Tevm action to execute a call on the vm
 */
export type RunCallAction = {
	to: Address
	caller: Address
	origin?: Address | undefined
	gasLimit?: bigint | undefined
	data: Hex
	value?: bigint | undefined
}

/**
 * Executes a call on the vm
 */
export const runCallHandler = async (tevm: Tevm, action: RunCallAction) => {
	return tevm._evm.runCall({
		to: new EthjsAddress(hexToBytes(action.to)),
		caller: new EthjsAddress(hexToBytes(action.caller)),
		gasLimit: action.gasLimit ?? maxInt256,
		data: hexToBytes(action.data),
		value: action.value ?? 0n,
		...(action.origin && {
			origin: new EthjsAddress(hexToBytes(action.origin)),
		}),
	})
}
