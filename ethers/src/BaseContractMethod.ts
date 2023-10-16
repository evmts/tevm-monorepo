import type { ContractMethodArgs } from './ContractMethodArgs.js'
import type {
	BaseContract,
	ContractTransaction,
	ContractTransactionResponse,
	FunctionFragment,
	Result,
} from 'ethers'

export type BaseContractMethod<
	TArguments extends ReadonlyArray<any> = ReadonlyArray<any>,
	TReturnType = any,
	TExtendedReturnType extends
		| TReturnType
		| ContractTransactionResponse = ContractTransactionResponse,
> = {
	(...args: ContractMethodArgs<TArguments>): Promise<
		TReturnType | TExtendedReturnType
	>

	name: string

	_contract: BaseContract

	_key: string

	getFragment: (...args: ContractMethodArgs<TArguments>) => FunctionFragment
	estimateGas: (...args: ContractMethodArgs<TArguments>) => Promise<bigint>
	populateTransaction: (
		...args: ContractMethodArgs<TArguments>
	) => Promise<ContractTransaction>
	send: (
		...args: ContractMethodArgs<TArguments>
	) => Promise<ContractTransactionResponse>
	staticCall: (...args: ContractMethodArgs<TArguments>) => Promise<TReturnType>
	staticCallResult: (...args: ContractMethodArgs<TArguments>) => Promise<Result>

	readonly fragment: FunctionFragment
}
