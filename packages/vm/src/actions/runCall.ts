import type { EVMts } from '../evmts.js'
import { Address as EthjsAddress } from '@ethereumjs/util'
import { type Address, type Hex, hexToBytes } from 'viem'

export type RunCallParameters = {
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
export const runCall = async (evmts: EVMts, options: RunCallParameters) => {
	return evmts._evm.runCall({
		to: new EthjsAddress(hexToBytes(options.to)),
		caller: new EthjsAddress(hexToBytes(options.caller)),
		origin: new EthjsAddress(hexToBytes(options.origin)),
		gasLimit: options.gasLimit ?? BigInt('0xfffffffffffffff'),
		data: Buffer.from(options.data.slice(2), 'hex'),
		value: options.value ?? 0n,
	})
}
