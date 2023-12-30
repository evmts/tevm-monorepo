import { Address as EthjsAddress } from '@ethereumjs/util'
import { hexToBytes } from 'viem'

/**
 * @param {import("@ethereumjs/evm").EVM} evm
 * @param {import('@tevm/actions').PutContractCodeAction} action
 * @returns {Promise<import("@tevm/actions").PutContractCodeResponse>}
 */
export const putContractCodeHandler = async (evm, action) => {
	const ethAddress = new EthjsAddress(hexToBytes(action.contractAddress))
	await evm.stateManager.putContractCode(
		ethAddress,
		hexToBytes(action.deployedBytecode),
	)
	return evm.stateManager.getContractCode(ethAddress)
}
