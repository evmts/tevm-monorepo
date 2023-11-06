import type { EVMts } from '../evmts.js'
import { Address as EthjsAddress } from '@ethereumjs/util'
import { type Address, type Hex, hexToBytes } from 'viem'

/**
 * EVMts action to put contract code into the vm state
 */
export type PutContractCodeAction = {
	bytecode: Hex
	contractAddress: Address
}

export const putContractCodeHandler = async (
	evmts: EVMts,
	action: PutContractCodeAction,
) => {
	const ethAddress = new EthjsAddress(hexToBytes(action.contractAddress))
	await evmts._evm.stateManager.putContractCode(
		ethAddress,
		hexToBytes(action.bytecode),
	)
	return evmts._evm.stateManager.getContractCode(ethAddress)
}
