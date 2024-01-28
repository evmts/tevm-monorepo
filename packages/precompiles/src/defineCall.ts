import { EVMErrorMessage, EvmError } from '@ethereumjs/evm'
import type {
	Abi,
	AbiParametersToPrimitiveTypes,
	ExtractAbiFunction,
	ExtractAbiFunctionNames,
} from 'abitype'
import { decodeFunctionData, encodeFunctionResult, hexToBytes } from 'viem'

type Handler<
	TAbi extends Abi,
	TFunctionName extends ExtractAbiFunctionNames<TAbi>,
> = (params: {
	gasLimit: bigint
	args: AbiParametersToPrimitiveTypes<
		ExtractAbiFunction<TAbi, TFunctionName>['inputs']
	>
}) => Promise<{
	executionGasUsed: bigint
	returnValue: AbiParametersToPrimitiveTypes<
		ExtractAbiFunction<TAbi, TFunctionName>['outputs']
	>[0]
	// TODO expose the ability to emit logs from precompiles
	// logs: ExtractEvetLogs<TAbi, TFunctionName>
	// TODO add ability to return revert errors
}>

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
	}: { data: `0x${string}`; gasLimit: bigint }) => {
		const d = decodeFunctionData({
			abi: abi,
			data: data,
		})
		const handler = handlers[d.functionName]
		try {
			const { returnValue, executionGasUsed } = await handler({
				gasLimit: gasLimit,
				args: d.args as any,
			})
			return {
				executionGasUsed,
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
				exeptionEror: {
					...new EvmError(EVMErrorMessage.REVERT),
					message:
						typeof e === 'string'
							? e
							: e instanceof Error
							? e.message
							: 'unknown error',
				},
			}
		}
	}
}
