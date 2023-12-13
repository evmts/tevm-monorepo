import { Address as EthjsAddress } from '@ethereumjs/util'
import { hexToBytes } from 'viem'

/**
 * @param {import("../../tevm.js").Tevm} tevm
 * @param {import("./PutContractCodeAction.js").PutContractCodeAction} action
 * @returns {Promise<import("./PutContractCodeResult.js").PutContractCodeResult>}
 */
export const putContractCodeHandler = async (tevm, action) => {
	const ethAddress = new EthjsAddress(hexToBytes(action.contractAddress))
	await tevm._evm.stateManager.putContractCode(
		ethAddress,
		hexToBytes(action.deployedBytecode),
	)
	return tevm._evm.stateManager.getContractCode(ethAddress)
}
