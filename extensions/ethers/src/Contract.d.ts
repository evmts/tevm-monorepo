import type { TypesafeEthersContract } from './TypesafeEthersContract.js'
import type { Abi } from 'abitype'
import {
	type Addressable,
	type Contract as EthersContract,
	type ContractRunner,
	type Interface as EthersInterface,
	type InterfaceAbi,
	type TransactionResponse,
} from 'ethers'

type TypesafeEthersInterfaceConstructor = {
	new <TAbi extends Abi>(abi: InterfaceAbi): Omit<
		EthersInterface,
		'fragments'
	> & { fragments: TAbi }
}

/**
 * Typesafe version of the ethers Interface class.
 */
export const Interface: TypesafeEthersInterfaceConstructor

type TypesafeEthersContractConstructor = {
	new <TAbi extends Abi>(
		target: string | Addressable,
		abi: { fragments: TAbi } | TAbi,
		runner?: null | ContractRunner,
		_deployTx?: null | TransactionResponse,
	): TypesafeEthersContract<TAbi> & EthersContract
}

/**
 * Typesafe version of the ethers Contract class.
 */
export const Contract: TypesafeEthersContractConstructor
