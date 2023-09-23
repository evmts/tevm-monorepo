import type { TypesafeEthersContract } from '.'
import type { Abi } from 'abitype'
import {
	type Addressable,
	Contract as EthersContract,
	type ContractRunner,
	Interface as EthersInterface,
	type InterfaceAbi,
	type TransactionResponse,
} from 'ethers'

type TypesafeEthersInterfaceConstructor = {
	new <TAbi extends Abi>(abi: InterfaceAbi): Omit<
		EthersInterface,
		'fragments'
	> & { fragments: TAbi }
}

export const Interface = EthersInterface as TypesafeEthersInterfaceConstructor

type TypesafeEthersContractConstructor = {
	new <TAbi extends Abi>(
		target: string | Addressable,
		abi: { fragments: TAbi } | TAbi,
		runner?: null | ContractRunner,
		_deployTx?: null | TransactionResponse,
	): TypesafeEthersContract<TAbi> & EthersContract
}

export const Contract = EthersContract as TypesafeEthersContractConstructor
