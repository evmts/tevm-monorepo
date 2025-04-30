import { hexToBigInt } from '@tevm/utils'
import { serializeTraceResult } from '../internal/serializeTraceResult.js'
import { traceCallHandler } from './traceCallHandler.js'

/**
 * Request handler for debug_traceCall JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugProcedure.js').DebugTraceCallProcedure}
 */
export const debugTraceCallJsonRpcProcedure = (client) => {
	/**
	 * @template {'callTracer' | 'prestateTracer' | undefined} TTracer
	 * @template {boolean} TDiffMode
	 * @param {import('./DebugJsonRpcRequest.js').DebugTraceCallJsonRpcRequest<TTracer, TDiffMode>} request
	 * @returns {Promise<import('./DebugJsonRpcResponse.js').DebugTraceCallJsonRpcResponse<TTracer, TDiffMode>>}
	 */
	return async (request) => {
		const { blockTag, tracer, to, gas, data, from, value, timeout, gasPrice, tracerConfig } = request.params[0]
		if (timeout !== undefined) {
			client.logger.warn('Warning: timeout is currently respected param of debug_traceCall')
		}

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

		return {
			method: request.method,
			result: /** @type {any} */ (serializeTraceResult(traceResult)),
			jsonrpc: '2.0',
			...(request.id ? { id: request.id } : {}),
		}
	}
}
