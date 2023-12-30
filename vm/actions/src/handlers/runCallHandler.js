import { Address as EthjsAddress } from '@ethereumjs/util'
import { hexToBytes, maxInt256 } from 'viem'

/**
 * Executes a call on the vm
 * @param {import("@ethereumjs/evm").EVM} evm
 * @param {import("../actions/index.js").RunCallAction} action
 * @returns {Promise<import("../actions/index.js").RunCallResponse>}
 */
export const runCallHandler = async (evm, action) => {
	return evm.runCall({
		...(action.to && {
			to: new EthjsAddress(hexToBytes(action.to)),
		}),
		caller: new EthjsAddress(hexToBytes(action.caller)),
		gasLimit: action.gasLimit ?? maxInt256,
		data: hexToBytes(action.data),
		value: action.value ?? 0n,
		...(action.origin && {
			origin: new EthjsAddress(hexToBytes(action.origin)),
		}),
	})
}
