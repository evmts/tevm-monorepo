import { EvmError, type ExecResult } from '@tevm/evm'
import {
	type Abi,
	type AbiParametersToPrimitiveTypes,
	type ExtractAbiFunction,
	type ExtractAbiFunctionNames,
	decodeFunctionData,
	encodeFunctionResult,
	hexToBytes,
} from '@tevm/utils'
import type { CallResult } from './CallResult.js'
import { logToEthjsLog } from './logToEthjsLog.js'

type Handler<TAbi extends Abi, TFunctionName extends ExtractAbiFunctionNames<TAbi>> = (params: {
	gasLimit: bigint
	args: AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>['inputs']>
}) => Promise<CallResult<TAbi, TFunctionName>>

/**
 * Defines a call handler for a contract precompile by mapping function names to handler implementations.
 *
 * The defineCall function takes an ABI and a map of function names to handler implementations.
 * Each handler receives the decoded function arguments and gas limit, and returns a result
 * that will be encoded according to the ABI.
 *
 * @example
 * ```js
 * import { defineCall } from '@tevm/precompiles'
 * import { parseAbi } from '@tevm/utils'
 *
 * const abi = parseAbi([
 *   'function readFile(string path) view returns (string)',
 *   'function writeFile(string path, string content) returns (bool)'
 * ])
 *
 * const fsCall = defineCall(abi, {
 *   readFile: async ({ args }) => {
 *     const [path] = args
 *     return {
 *       returnValue: await fs.readFile(path, 'utf8'),
 *       executionGasUsed: 0n
 *     }
 *   },
 *   writeFile: async ({ args }) => {
 *     const [path, content] = args
 *     await fs.writeFile(path, content)
 *     return {
 *       returnValue: true,
 *       executionGasUsed: 0n
 *     }
 *   }
 * })
 * ```
 */
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
							logs: logs.map((logs) => logToEthjsLog(abi, logs)),
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
					...new EvmError('revert' as any),
					...{
						message: typeof e === 'string' ? e : e instanceof Error ? e.message : 'unknown error',
					},
				},
			}
		}
	}
}
