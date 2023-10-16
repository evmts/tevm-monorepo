import type { BaseContractMethod } from './BaseContractMethod.js'
import type {
	Abi,
	AbiParametersToPrimitiveTypes,
	ExtractAbiEvent,
	ExtractAbiEventNames,
	ExtractAbiFunction,
	ExtractAbiFunctionNames,
} from 'abitype'
import type { Log } from 'ethers'
import type { EventLog } from 'ethers'
import type { BlockTag } from 'ethers'
import type {
	BaseContract,
	ContractEventName,
	ContractTransactionResponse,
} from 'ethers'

export type TypesafeEthersContract<TAbi extends Abi> = BaseContract & {
	// readonly methods
	[TFunctionName in
		ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>]: BaseContractMethod<
		AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<TAbi, TFunctionName>['inputs']
		> &
			any[],
		// this is not a super robust way of doing this but should work for an initial release
		// this likely will have rough edges in non happy cases like the abi not being readable as const
		AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<TAbi, TFunctionName>['outputs']
		>[0],
		AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<TAbi, TFunctionName>['outputs']
		>[0]
	>
} & {
	// write methods
	[TFunctionName in
		ExtractAbiFunctionNames<
			TAbi,
			'nonpayable' | 'payable'
		>]: BaseContractMethod<
		AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<TAbi, TFunctionName>['inputs']
		> &
			any[],
		// this is not a super robust way of doing this but should work for an initial release
		// this likely will have rough edges in non happy cases like the abi not being readable as const
		AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<TAbi, TFunctionName>['outputs']
		>[0],
		ContractTransactionResponse
	>
} & {
	// events
	queryFilter: <
		TContractEventName extends
			| Omit<ContractEventName, ExtractAbiEventNames<TAbi>>
			| ExtractAbiEventNames<TAbi>,
	>(
		event: TContractEventName,
		fromBlock?: BlockTag,
		toBlock?: BlockTag,
		// TODO this return type does not work
		// this is extremely difficult to override the return type into being generic
	) => Promise<
		Array<
			TContractEventName extends ExtractAbiEventNames<TAbi>
				? ExtractAbiEvent<TAbi, TContractEventName>
				: EventLog | Log
		>
	>
}
