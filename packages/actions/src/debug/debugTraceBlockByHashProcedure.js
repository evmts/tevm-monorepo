import { debugTraceBlockJsonRpcProcedure } from './debugTraceBlockProcedure.js'

/**
 * Creates a JSON-RPC procedure handler for the `debug_traceBlockByHash` method
 *
 * This handler is a convenience wrapper around `debug_traceBlock` that accepts a block hash
 * as the first parameter directly (not wrapped in an object). It traces the execution of all
 * transactions in the specified block.
 *
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugProcedure.js').DebugTraceBlockByHashProcedure}
 * @throws {Error} If the block cannot be found or its parent state cannot be forked.
 */
export const debugTraceBlockByHashJsonRpcProcedure = (client) => {
	// Get the main debug_traceBlock procedure to delegate to
	const debugTraceBlock = debugTraceBlockJsonRpcProcedure(client)

	/**
	 * @template {'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer'} TTracer
	 * @template {boolean} TDiffMode
	 * @param {import('./DebugJsonRpcRequest.js').DebugTraceBlockByHashJsonRpcRequest<TTracer, TDiffMode>} request
	 * @returns {Promise<import('./DebugJsonRpcResponse.js').DebugTraceBlockByHashJsonRpcResponse<TTracer, TDiffMode>>}
	 */
	return async (request) => {
		// Extract parameters: [blockHash, tracerOptions]
		const [blockHashParam, tracerOptions = {}] = request.params

		client.logger.debug(
			{ blockHash: blockHashParam, tracer: 'tracer' in tracerOptions ? tracerOptions.tracer : undefined },
			'debug_traceBlockByHash: executing with params',
		)

		// Construct parameters in the format expected by debug_traceBlock
		const debugTraceBlockParams = {
			blockHash: blockHashParam,
			...tracerOptions,
		}

		// Delegate to the main debug_traceBlock procedure
		const result = await debugTraceBlock({
			jsonrpc: request.jsonrpc,
			method: 'debug_traceBlock',
			params: [debugTraceBlockParams],
			...(request.id !== undefined ? { id: request.id } : {}),
		})

		// Return the result with the original method name
		return /** @type {any} */ ({
			...result,
			method: request.method,
		})
	}
}
