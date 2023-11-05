import type { EVMts } from '../evmts.js'
import { Address as EthjsAddress } from '@ethereumjs/util'
import { type Address, type Hex, hexToBytes } from 'viem'

export type PutContractCodeParameters = {
	bytecode: Hex
	contractAddress: Address
}

export const putContractCode = async (
	evmts: EVMts,
	options: PutContractCodeParameters,
) => {
	const ethAddress = new EthjsAddress(hexToBytes(options.contractAddress))
	await evmts._evm.stateManager.putContractCode(
		ethAddress,
		hexToBytes(options.bytecode),
	)
	return evmts._evm.stateManager.getContractCode(ethAddress)
}
