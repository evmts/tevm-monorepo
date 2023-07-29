import type { TypesafeEthersContract } from './TypesafeEthersContract'
import type { EvmtsContract } from '@evmts/core'
import type { Abi, Address, FormatAbi } from 'abitype'
import { Contract, type ContractRunner, Interface } from 'ethers'

export type CreateEthersContractOptions<TChainIds extends number> =
	| {
			chainId: TChainIds
			runner: ContractRunner
	  }
	| {
			address: Address
			runner: ContractRunner
	  }

/**
 * Create an ethers contract from an evmts contract
 * @example
 * import {MyContract} from './MyContract'
 * import {providers} from 'ethers'
 * const provider = new providers.JsonRpcProvider('http://localhost:8545')
 * const contract = createEthersContract(myContract, {chainId: 1, runner: provider})
 */
export const createEthersContract = <
	TName extends string,
	TAddresses extends Record<number, Address>,
	TAbi extends Abi,
	THumanReadableAbi = FormatAbi<TAbi>,
>(
	contract: Pick<
		EvmtsContract<TName, TAddresses, TAbi, THumanReadableAbi>,
		'abi' | 'addresses'
	>,
	options: CreateEthersContractOptions<number | (keyof TAddresses & number)>,
): TypesafeEthersContract<TAbi> => {
	const getAddress = () => {
		if ('address' in options && options.address) {
			return options.address
		} else if ('chainId' in options && options.chainId) {
			return contract.addresses[options.chainId]
		} else {
			throw new Error('No chainId or address provided')
		}
	}
	return new Contract(
		getAddress(),
		new Interface(contract.abi as any),
		options.runner,
	) as TypesafeEthersContract<TAbi>
}
