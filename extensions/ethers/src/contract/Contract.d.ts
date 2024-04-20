import type { Abi } from '@tevm/utils'
import type {
	Addressable,
	ContractRunner,
	Contract as EthersContract,
	Interface as EthersInterface,
	InterfaceAbi,
	TransactionResponse,
} from 'ethers'
import type { TypesafeEthersContract } from './TypesafeEthersContract.js'

type TypesafeEthersInterfaceConstructor = {
	new <TAbi extends Abi>(abi: InterfaceAbi): Omit<EthersInterface, 'fragments'> & { fragments: TAbi }
}

export const Interface: TypesafeEthersInterfaceConstructor

type TypesafeEthersContractConstructor = {
	new <TAbi extends Abi>(
		target: string | Addressable,
		abi: { fragments: TAbi } | TAbi,
		runner?: null | ContractRunner,
		_deployTx?: null | TransactionResponse,
	): TypesafeEthersContract<TAbi> & EthersContract
}

export const Contract: TypesafeEthersContractConstructor
