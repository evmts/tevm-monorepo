import type { EVMts } from '../evmts.js'
import { Address as EthjsAddress } from '@ethereumjs/util'
import { type Address, type Hex, hexToBytes } from 'viem'

export type RunCallAction = {
	to: Address
	caller: Address
	origin: Address
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
		origin: new EthjsAddress(hexToBytes(action.origin)),
		gasLimit: action.gasLimit ?? BigInt('0xfffffffffffffff'),
		data: Buffer.from(action.data.slice(2), 'hex'),
		value: action.value ?? 0n,
	})
}
