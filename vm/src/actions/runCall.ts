import type { EVMts } from '../evmts.js'
import { Address as EthjsAddress } from '@ethereumjs/util'
import { type Address, type Hex, hexToBytes, maxInt256 } from 'viem'

/**
 * EVMts action to execute a call on the vm
 */
export type RunCallAction = {
	to: Address
	caller: Address
	origin?: Address
	gasLimit?: bigint
	data: Hex
	value?: bigint
}

/**
 * Executes a call on the vm
 */
export const runCallHandler = async (evmts: EVMts, action: RunCallAction) => {
	return evmts._evm.runCall({
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
