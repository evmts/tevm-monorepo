import { hexToBigInt, numberToHex } from '@tevm/utils'
import { traceCallHandler } from './traceCallHandler.js'

/**
 * Request handler for debug_traceCall JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugProcedure.js').DebugTraceCallProcedure}
 */
export const debugTraceCallJsonRpcProcedure = (client) => {
	/**
	 * @template {'callTracer' | 'prestateTracer'} TTracer
	 * @template {boolean} TDiffMode
	 * @param {import('./DebugJsonRpcRequest.js').DebugTraceCallJsonRpcRequest<TTracer, TDiffMode>} request
	 * @returns {Promise<import('./DebugJsonRpcResponse.js').DebugTraceCallJsonRpcResponse<TTracer, TDiffMode>>}
	 */
	return async (request) => {
		const { blockTag, tracer, to, gas, data, from, value, timeout, gasPrice, tracerConfig } = request.params[0]
		const traceResult = await traceCallHandler(client)({
			tracer,
			...(to !== undefined ? { to } : {}),
			...(from !== undefined ? { from } : {}),
			...(gas !== undefined ? { gas: typeof gas === 'bigint' ? gas : hexToBigInt(gas) } : {}),
			...(gasPrice !== undefined ? { gasPrice: typeof gasPrice === 'bigint' ? gasPrice : hexToBigInt(gasPrice) } : {}),
			...(value !== undefined ? { value: typeof value === 'bigint' ? value : hexToBigInt(value) } : {}),
			...(data !== undefined ? { data } : {}),
			...(blockTag !== undefined ? { blockTag } : {}),
			...(timeout !== undefined ? { timeout } : {}),
			.../** @type {any} */ (tracerConfig !== undefined ? { tracerConfig } : {}),
		})

		// Handle different tracer result formats
		if (tracer === 'prestateTracer') {
			// For prestate tracer, return the result directly
			return {
				method: request.method,
				result: /** @type {any} */ (traceResult),
				jsonrpc: '2.0',
				...(request.id ? { id: request.id } : {}),
			}
		}
		// For standard tracer with opcode tracing
		const debugTraceCallResult = /** @type {import('./DebugResult.js').EvmTracerResult} */ (traceResult)
		return {
			method: request.method,
			result: /** @type {any} */ ({
				gas: numberToHex(debugTraceCallResult.gas),
				failed: debugTraceCallResult.failed,
				returnValue: debugTraceCallResult.returnValue,
				structLogs: debugTraceCallResult.structLogs.map((log) => {
					return {
						gas: numberToHex(log.gas),
						gasCost: numberToHex(log.gasCost),
						op: log.op,
						pc: log.pc,
						stack: log.stack,
						depth: log.depth,
					}
				}),
			}),
			jsonrpc: '2.0',
			...(request.id ? { id: request.id } : {}),
		}
	}
}
