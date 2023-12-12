import { type Address, type Hex } from 'viem'

/**
 * Tevm action to put contract code into the vm state
 */
export type PutContractCodeAction = {
	deployedBytecode: Hex
	contractAddress: Address
}

