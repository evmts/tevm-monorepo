import type { CallResult } from './CallResult.js'
import { EVMErrorMessage, EvmError, type ExecResult } from '@ethereumjs/evm'
import {
	type Abi,
	type AbiEvent,
	type AbiParametersToPrimitiveTypes,
	type ExtractAbiFunction,
	type ExtractAbiFunctionNames,
	decodeFunctionData,
	encodeAbiParameters,
	encodeEventTopics,
	encodeFunctionResult,
	hexToBytes,
} from '@tevm/utils'

type Handler<
	TAbi extends Abi,
	TFunctionName extends ExtractAbiFunctionNames<TAbi>,
> = (params: {
	gasLimit: bigint
	args: AbiParametersToPrimitiveTypes<
		ExtractAbiFunction<TAbi, TFunctionName>['inputs']
	>
}) => Promise<CallResult<TAbi, TFunctionName>>

export const defineCall = <TAbi extends Abi>(
	abi: TAbi,
	handlers: {
		[TFunctionName in ExtractAbiFunctionNames<TAbi>]: Handler<
			TAbi,
			TFunctionName
		>
	},
) => {
	return async ({
		data,
		gasLimit,
	}: { data: `0x${string}`; gasLimit: bigint }): Promise<ExecResult> => {
		const d = decodeFunctionData({
			abi: abi,
			data: data,
		})
		const handler = handlers[d.functionName]
		try {
			const {
				returnValue,
				executionGasUsed,
				logs,
				error,
				blobGasUsed,
				selfdestruct,
			} = await handler({
				gasLimit: gasLimit,
				args: d.args as any,
			})
			return {
				executionGasUsed,
				...(error ? { exeptionError: error } : {}),
				...(selfdestruct ? { selfdestruct } : {}),
				...(blobGasUsed ? { blobGasUsed } : {}),
				...(logs
					? {
							logs: logs.map((log) => {
								const topics = encodeEventTopics({
									abi,
									eventName: log.name,
									args: log.inputs,
								} as any).map((topics) => hexToBytes(topics))
								const eventItem = abi.find(
									(item) => item.type === 'event' && item.name === log.name,
								) as AbiEvent
								if (!eventItem)
									throw new Error(`Event ${log.name} not found in ABI`)
								const data = encodeAbiParameters(eventItem.inputs, log.inputs)
								return [hexToBytes(log.address), topics, hexToBytes(data)]
							}),
					  }
					: {}),
				returnValue: hexToBytes(
					encodeFunctionResult({
						abi: abi,
						functionName: d.functionName as any,
						result: returnValue as any,
					} as any),
				),
			}
		} catch (e) {
			return {
				executionGasUsed: BigInt(0),
				returnValue: Buffer.alloc(0),
				exceptionError: {
					...new EvmError(EVMErrorMessage.REVERT),
					...{
						message:
							typeof e === 'string'
								? e
								: e instanceof Error
								? e.message
								: 'unknown error',
					},
				},
			}
		}
	}
}
