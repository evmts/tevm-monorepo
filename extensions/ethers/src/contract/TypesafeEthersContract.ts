import type {
	Abi,
	AbiParametersToPrimitiveTypes,
	ExtractAbiEventNames,
	ExtractAbiFunction,
	ExtractAbiFunctionNames,
	GetEventArgs,
} from '@tevm/utils'
import type { BaseContract, BlockTag, ContractEventName, ContractTransactionResponse, EventLog, Log, Result } from 'ethers'
import type { BaseContractMethod } from './BaseContractMethod.js'

type EthersAbiParameter = {
	readonly type: string
	readonly components?: readonly EthersAbiParameter[]
}

type EthersAbiParameterToPrimitiveType<TParameter> = TParameter extends {
	readonly type: `${infer TType}[${string}]`
}
	? TParameter extends { readonly components: infer TComponents extends readonly EthersAbiParameter[] }
		? Array<EthersAbiParameterToPrimitiveType<{ readonly type: TType; readonly components: TComponents }>>
		: Array<EthersAbiParameterToPrimitiveType<{ readonly type: TType }>>
	: TParameter extends { readonly type: `uint${string}` | `int${string}` | 'uint' | 'int' }
		? bigint
		: TParameter extends { readonly type: 'bool' }
			? boolean
			: TParameter extends { readonly type: 'address' | 'string' | `bytes${string}` | 'bytes' | 'function' }
				? string
				: TParameter extends { readonly type: 'tuple'; readonly components: infer TComponents extends readonly EthersAbiParameter[] }
					? Result & EthersAbiParametersToPrimitiveTypes<TComponents>
					: unknown

type EthersAbiParametersToPrimitiveTypes<TParameters extends readonly EthersAbiParameter[]> = {
	[TKey in keyof TParameters]: EthersAbiParameterToPrimitiveType<TParameters[TKey]>
}

type EthersFunctionOutput<TAbi extends Abi, TFunctionName extends ExtractAbiFunctionNames<TAbi>> =
	EthersAbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>['outputs']> extends infer TOutputs extends
		readonly unknown[]
		? TOutputs['length'] extends 0
			? void
			: TOutputs['length'] extends 1
				? TOutputs[0]
				: Result & TOutputs
		: never

type EthersEventLog<TAbi extends Abi, TContractEventName extends ExtractAbiEventNames<TAbi>> = EventLog & {
	args: GetEventArgs<TAbi, TContractEventName>
}

export type TypesafeEthersContract<TAbi extends Abi> = BaseContract & {
	// readonly methods
	[TFunctionName in ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>]: BaseContractMethod<
		AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>['inputs']> & any[],
		EthersFunctionOutput<TAbi, TFunctionName>,
		EthersFunctionOutput<TAbi, TFunctionName>
	>
} & {
	// write methods
	[TFunctionName in ExtractAbiFunctionNames<TAbi, 'nonpayable' | 'payable'>]: BaseContractMethod<
		AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>['inputs']> & any[],
		EthersFunctionOutput<TAbi, TFunctionName>,
		ContractTransactionResponse
	>
} & {
	// events
	queryFilter: <
		TContractEventName extends Omit<ContractEventName, ExtractAbiEventNames<TAbi>> | ExtractAbiEventNames<TAbi>,
	>(
		event: TContractEventName,
		fromBlock?: BlockTag,
		toBlock?: BlockTag,
	) => Promise<
		Array<
			TContractEventName extends ExtractAbiEventNames<TAbi> ? EthersEventLog<TAbi, TContractEventName> : EventLog | Log
		>
	>
	}
