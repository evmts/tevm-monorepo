import type { TypesafeEthersContract } from './TypesafeEthersContract'
import type { EvmtsContract } from '@evmts/core'
import type { Abi, Address } from 'abitype'
import {
	Contract,
	type ContractRunner,
	Interface,
	type InterfaceAbi,
	isAddress,
} from 'ethers'

export type CreateEthersContractOptions<TChainIds extends number> =
	| {
			/**
			 * Provide a chainId if EVMts config has addresses for contracts configured for that chain.
			 * Otherwise provide the `address` prop to specify the address
			 */
			chainId: TChainIds
			/**
			 * Ethers.js provider or signer
			 */
			runner: ContractRunner
	  }
	| {
			/**
			 * Address of the contract. If EVMts config has addresses configured already simply provide the chainId
			 */
			address: Address
			/**
			 * Ethers.js provider or signer
			 */
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
	TAddresses extends Record<number, Address>,
	TAbi extends Abi,
>(
	contract: Pick<
		EvmtsContract<any, TAddresses, TAbi, any>,
		'abi' | 'addresses'
	>,
	options: CreateEthersContractOptions<keyof TAddresses & number>,
): TypesafeEthersContract<TAbi> => {
	const getAddress = () => {
		if ('address' in options && options.address) {
			return options.address
		} else if ('chainId' in options && options.chainId) {
			const a = contract.addresses[options.chainId]
			if (!a) {
				throw new Error(
					`No address prop supplied and no default address exists for chainId ${options.chainId}`,
				)
			}
			return a
		} else {
			throw new Error('No chainId or address provided')
		}
	}
	const address = getAddress()
	if (!isAddress(address)) {
		throw new Error(`"${address}" is not a valid ethereum address`)
	}
	return new Contract(
		address,
		new Interface(contract.abi as InterfaceAbi),
		options.runner,
	) as TypesafeEthersContract<TAbi>
}
