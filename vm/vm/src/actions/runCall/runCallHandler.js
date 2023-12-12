import { Address as EthjsAddress } from '@ethereumjs/util'
import { hexToBytes, maxInt256 } from 'viem'

/**
 * Executes a call on the vm
 * @param {import("../../tevm.js").Tevm} tevm
 * @param {import("./RunCallAction.js").RunCallAction} action
 * @returns {Promise<import("@ethereumjs/evm").EVMResult>}
 */
export const runCallHandler = async (tevm, action) => {
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
