import { traceCallHandler } from '@tevm/actions'
import { hexToBigInt, numberToHex } from '@tevm/utils'

/**
 * Request handler for debug_traceCall JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugProcedure.js').DebugTraceCallProcedure}
 */
export const debugTraceCallJsonRpcProcedure = (client) => {
	return async (request) => {
		const debugTraceCallRequest =
			/** @type {import('./index.js').DebugTraceCallJsonRpcRequest}*/
			(request)
		const { blockTag, tracer, to, gas, data, from, value, timeout, gasPrice, tracerConfig } =
			debugTraceCallRequest.params[0]
		const traceResult = await traceCallHandler(client)({
			tracer,
			...(to !== undefined ? { to } : {}),
			...(from !== undefined ? { from } : {}),
			...(gas !== undefined ? { gas: hexToBigInt(gas) } : {}),
			...(gasPrice !== undefined ? { gasPrice: hexToBigInt(gasPrice) } : {}),
			...(value !== undefined ? { value: hexToBigInt(value) } : {}),
			...(data !== undefined ? { data } : {}),
			...(blockTag !== undefined ? { blockTag } : {}),
			...(timeout !== undefined ? { timeout } : {}),
			...(tracerConfig !== undefined ? { tracerConfig } : {}),
		})
		return {
			method: debugTraceCallRequest.method,
			result: {
				gas: numberToHex(traceResult.gas),
				failed: traceResult.failed,
				returnValue: traceResult.returnValue,
				structLogs: traceResult.structLogs.map((log) => {
					return {
						gas: numberToHex(log.gas),
						gasCost: numberToHex(log.gasCost),
						op: log.op,
						pc: log.pc,
						stack: log.stack,
						depth: log.depth,
					}
				}),
			},
			jsonrpc: '2.0',
			...(debugTraceCallRequest.id ? { id: debugTraceCallRequest.id } : {}),
		}
	}
}
