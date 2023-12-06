import type { Tevm } from '../tevm.js'
import { ZHex } from '../utils/zod.js'
import { Address as EthjsAddress } from '@ethereumjs/util'
import { Address as ZAddress } from 'abitype/zod'
import { type Address, type Hex, hexToBytes } from 'viem'
import { z } from 'zod'

export const PutContractCodeActionValidator = z.object({
	deployedBytecode: ZHex.describe('The deployed bytecode of the contract'),
	contractAddress: ZAddress.describe('The address of the contract'),
})

/**
 * Tevm action to put contract code into the vm state
 */
export type PutContractCodeAction = {
	deployedBytecode: Hex
	contractAddress: Address
}

export const putContractCodeHandler = async (
	tevm: Tevm,
	action: PutContractCodeAction,
) => {
	const ethAddress = new EthjsAddress(hexToBytes(action.contractAddress))
	await tevm._evm.stateManager.putContractCode(
		ethAddress,
		hexToBytes(action.deployedBytecode),
	)
	return tevm._evm.stateManager.getContractCode(ethAddress)
}
