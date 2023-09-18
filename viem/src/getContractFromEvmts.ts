import type { EvmtsContract } from '@evmts/core'
import {
	type Abi,
	type Account,
	type Address,
	type Chain,
	type GetContractParameters,
	type GetContractReturnType,
	type PublicClient,
	type Transport,
	type WalletClient,
	getContract as viemGetContract,
} from 'viem'

export type EvmtsGetContractParameters<
	TAddresses extends Record<number, Address>,
	TAbi extends Abi,
	TTransport extends Transport,
	TChain extends Chain | undefined = Chain | undefined,
	TAccount extends Account | undefined = Account | undefined,
	TPublicClient extends PublicClient<TTransport, TChain> | undefined =
		| PublicClient<TTransport, TChain>
		| undefined,
	TWalletClient extends WalletClient<TTransport, TChain, TAccount> | undefined =
		| WalletClient<TTransport, TChain, TAccount>
		| undefined,
> = Omit<
	GetContractParameters<
		TTransport,
		TChain,
		TAccount,
		TAbi,
		TPublicClient,
		TWalletClient,
		TAddresses[TChain extends Chain ? TChain['id'] : number]
	>,
	'abi' | 'address'
> &
	(
		| {
				evmts: Pick<
					EvmtsContract<string, TAddresses, TAbi, any>,
					'abi' | 'addresses'
				>
				// TODO properly infer if we need an address
				address?: Address
		  }
		| {
				abi: TAbi
				// TODO properly infer if we need an address
				address?: Address
		  }
	)

export type EvmtsGetContractReturnType<
	TAbi extends Abi,
	TTransport extends Transport,
	TChain extends Chain | undefined = Chain | undefined,
	TAccount extends Account | undefined = Account | undefined,
	TPublicClient extends PublicClient<TTransport, TChain> | undefined =
		| PublicClient<TTransport, TChain>
		| undefined,
	TWalletClient extends WalletClient<TTransport, TChain, TAccount> | undefined =
		| WalletClient<TTransport, TChain, TAccount>
		| undefined,
	TAddress extends Address = Address,
> = GetContractReturnType<TAbi, TPublicClient, TWalletClient, TAddress>

/**
 * Create an ethers contract from an evmts contract
 * @example
 * import {MyContract} from './MyContract'
 * import {providers} from 'ethers'
 * const provider = new providers.JsonRpcProvider('http://localhost:8545')
 * const contract = createEthersContract(myContract, {chainId: 1, runner: provider})
 */
export const getContractFromEvmts = <
	TAddresses extends Record<number, Address>,
	TAbi extends Abi,
	TTransport extends Transport,
	TChain extends Chain | undefined = Chain | undefined,
	TAccount extends Account | undefined = Account | undefined,
	TPublicClient extends PublicClient<TTransport, TChain> | undefined =
		| PublicClient<TTransport, TChain>
		| undefined,
	TWalletClient extends WalletClient<TTransport, TChain, TAccount> | undefined =
		| WalletClient<TTransport, TChain, TAccount>
		| undefined,
>(
	options: EvmtsGetContractParameters<
		TAddresses,
		TAbi,
		TTransport,
		TChain,
		TAccount,
		TPublicClient,
		TWalletClient
	>,
): EvmtsGetContractReturnType<
	TAbi,
	TTransport,
	TChain,
	TAccount,
	TPublicClient,
	TWalletClient,
	// TODO infer the address correctly at type level
	Address
> => {
	if ('abi' in options) {
		return viemGetContract(options as any) as GetContractReturnType<
			TAbi,
			TPublicClient,
			TWalletClient,
			Address
		>
	}

	const getAddress = (): Address => {
		if (options.address) {
			return options.address
		}
		const allAddresses = Object.values(options.evmts.addresses)
		if (allAddresses.length === 0) {
			throw new Error(
				'No address configured on EVMts contract or passed in as options. Please pass in an address or configure an address globally in your EVMts config in tsconfig.json',
			)
		}
		if (allAddresses.length === 1) {
			return allAddresses[0] as Address
		}
		const chainId =
			options.publicClient?.chain?.id ?? options.walletClient?.chain?.id
		if (!chainId) {
			throw new Error(
				'chainId could not be found to infer address. Please pass in the contract address explicitly',
			)
		}
		const address = options.evmts.addresses[chainId]
		if (!address) {
			throw new Error(
				`No address configured for chainId ${chainId} on EVMts contract. Valid chainIds are ${Object.keys(
					options.evmts.addresses,
				).join(',')}`,
			)
		}
		return address
	}

	return viemGetContract({
		abi: options.evmts.abi,
		publicClient: options.publicClient as any,
		walletClient: options.walletClient as any,
		address: getAddress(),
	}) as GetContractReturnType<TAbi, TPublicClient, TWalletClient, Address>
}
