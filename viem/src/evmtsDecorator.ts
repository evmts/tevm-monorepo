import {
	type EvmtsGetContractReturnType,
	getContractFromEvmts,
} from './getContractFromEvmts'
import type { EvmtsContract } from '@evmts/core'
import type {
	Abi,
	Account,
	Address,
	Chain,
	PublicClient,
	Transport,
} from 'viem'
import type { WalletClient } from 'viem'

export type EvmtsPublicActions = {
	getContractFromEvmts: <
		TAddresses extends Record<number, Address>,
		TAbi extends Abi,
		TTransport extends Transport,
		TChain extends Chain | undefined = Chain | undefined,
		TAccount extends Account | undefined = Account | undefined,
		TPublicClient extends PublicClient<TTransport, TChain> = PublicClient<
			TTransport,
			TChain
		>,
	>(
		evmtsContract: EvmtsContract<string, TAddresses, TAbi>,
	) => EvmtsGetContractReturnType<
		TAbi,
		TTransport,
		TChain,
		TAccount,
		TPublicClient,
		undefined,
		Address
	>
}

export type EvmtsWalletActions = {
	getContractFromEvmts: <
		TAddresses extends Record<number, Address>,
		TAbi extends Abi,
		TTransport extends Transport,
		TChain extends Chain | undefined = Chain | undefined,
		TAccount extends Account | undefined = Account | undefined,
		TWalletClient extends WalletClient<
			TTransport,
			TChain,
			TAccount
		> = WalletClient<TTransport, TChain, TAccount>,
	>(
		evmtsContract: EvmtsContract<string, TAddresses, TAbi>,
	) => EvmtsGetContractReturnType<
		TAbi,
		TTransport,
		TChain,
		TAccount,
		undefined,
		TWalletClient,
		Address
	>
}

export function evmtsDecorator<
	TClient extends
		| WalletClient<TTransport, TChain, TAccount>
		| PublicClient<TTransport, TChain>,
	TTransport extends Transport = Transport,
	TChain extends Chain = Chain,
	TAccount extends Account = Account,
>(
	client: TClient,
): TClient extends WalletClient<any, any, any>
	? EvmtsWalletActions
	: EvmtsPublicActions {
	return {
		getContractFromEvmts: (contract: EvmtsContract<any, any, any>) => {
			return getContractFromEvmts({
				evmts: contract,
				publicClient: (client as WalletClient<TTransport, TChain, TAccount>)
					.signMessage
					? undefined
					: (client as any),
				walletClient: (client as WalletClient<TTransport, TChain, TAccount>)
					.signMessage
					? (client as any)
					: undefined,
			}) as any
		},
	}
}
