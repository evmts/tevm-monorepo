import { EvmError, type ExecResult } from '@evmts/zevm/evm'
import {
	type Abi,
	type AbiParametersToPrimitiveTypes,
	decodeFunctionData,
	type ExtractAbiFunction,
	type ExtractAbiFunctionNames,
	encodeErrorResult,
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
	return async ({ data, gasLimit }: { data: `0x${string}`; gasLimit: bigint }): Promise<ExecResult> => {
		try {
			const d = decodeFunctionData({
				abi: abi,
				data: data,
			})
			const handler = handlers[d.functionName]
			if (!handler) {
				throw new Error(`No precompile handler found for ${d.functionName}`)
			}
			const { returnValue, executionGasUsed, logs, error, blobGasUsed, selfdestruct } = await handler({
				gasLimit: gasLimit,
				args: d.args as any,
			})
			if (error) {
				// Preserve revert data so callers (e.g. Solidity try/catch) can decode the reason.
				// If the handler already returned raw bytes, forward them as-is; otherwise ABI-encode
				// a standard Error(string) payload (selector 0x08c379a0) from the error message,
				// mirroring how the success path ABI-encodes the return value.
				const revertData =
					returnValue instanceof Uint8Array
						? returnValue
						: hexToBytes(
								encodeErrorResult({
									abi: [
										{
											type: 'error',
											name: 'Error',
											inputs: [{ type: 'string', name: 'message' }],
										},
									],
									errorName: 'Error',
									args: [error.message],
								}),
							)
				const result: ExecResult = {
					executionGasUsed,
					returnValue: revertData,
					exceptionError: {
						...new EvmError('revert' as any),
						...{ message: error.message },
					},
				}
				if (blobGasUsed) {
					result.blobGasUsed = blobGasUsed
				}
				return result
			}
			const result: ExecResult = {
				executionGasUsed,
				returnValue: hexToBytes(
					encodeFunctionResult({
						abi: abi,
						functionName: d.functionName as any,
						result: returnValue as any,
					} as any),
				),
			}
			if (selfdestruct) {
				result.selfdestruct = selfdestruct
			}
			if (blobGasUsed) {
				result.blobGasUsed = blobGasUsed
			}
			if (logs) {
				// This logs block is not covered
				result.logs = logs.map((logs) => logToEthjsLog(abi, logs))
			}
			return result
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
