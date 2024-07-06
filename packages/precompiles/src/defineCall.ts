import { EvmError, EvmErrorMessage, type ExecResult } from '@tevm/evm'
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
import type { CallResult } from './CallResult.js'

type Handler<TAbi extends Abi, TFunctionName extends ExtractAbiFunctionNames<TAbi>> = (params: {
	gasLimit: bigint
	args: AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>['inputs']>
}) => Promise<CallResult<TAbi, TFunctionName>>

export const defineCall = <TAbi extends Abi>(
	abi: TAbi,
	handlers: {
		[TFunctionName in ExtractAbiFunctionNames<TAbi>]: Handler<TAbi, TFunctionName>
	},
) => {
	return async ({
		data,
		gasLimit,
	}: {
		data: `0x${string}`
		gasLimit: bigint
	}): Promise<ExecResult> => {
		const d = decodeFunctionData({
			abi: abi,
			data: data,
		})
		const handler = handlers[d.functionName]
		try {
			const { returnValue, executionGasUsed, logs, error, blobGasUsed, selfdestruct } = await handler({
				gasLimit: gasLimit,
				args: d.args as any,
			})
			return {
				executionGasUsed,
				...(error ? { exeptionError: error } : {}),
				...(selfdestruct ? { selfdestruct } : {}),
				...(blobGasUsed ? { blobGasUsed } : {}),
				...(logs
					? // This logs part of the ternary is not covered
						{
							logs: logs.map((log) => {
								const topics = encodeEventTopics({
									abi,
									eventName: log.eventName,
									args: log.args,
								} as any).map((topics) => hexToBytes(topics))
								const eventItem = abi.find((item) => item.type === 'event' && item.name === log.eventName) as AbiEvent
								const indexedInputs = eventItem.inputs?.filter((param) => 'indexed' in param && param.indexed)
								const argsArray = Array.isArray(log.args)
									? log.args
									: Object.values(log.args ?? {}).length > 0
										? indexedInputs?.map((x: any) => (log.args as any)[x.name]) ?? []
										: []
								const data = encodeAbiParameters(eventItem.inputs, argsArray)
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
			// This entire catch block is not covered
		} catch (e) {
			return {
				executionGasUsed: BigInt(0),
				returnValue: new Uint8Array(),
				exceptionError: {
					...new EvmError(EvmErrorMessage.REVERT),
					...{
						message: typeof e === 'string' ? e : e instanceof Error ? e.message : 'unknown error',
					},
				},
			}
		}
	}
}
