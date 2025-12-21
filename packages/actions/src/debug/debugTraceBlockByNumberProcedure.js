import { debugTraceBlockJsonRpcProcedure } from './debugTraceBlockProcedure.js'

/**
 * Creates a JSON-RPC procedure handler for the `debug_traceBlockByNumber` method
 *
 * This handler is a convenience wrapper around `debug_traceBlock` that accepts a block number
 * as the first parameter directly (not wrapped in an object). It traces the execution of all
 * transactions in the specified block.
 *
 * @param {import('@tevm/node').TevmNode} client - The TEVM node instance
 * @returns {import('./DebugProcedure.js').DebugTraceBlockByNumberProcedure} A handler function for debug_traceBlockByNumber requests
 * @throws {Error} If the block cannot be found
 * @throws {Error} If the parent block's state root is not available and cannot be forked
 *
 * @example
 * ```javascript
 * import { createTevmNode } from '@tevm/node'
 * import { debugTraceBlockByNumberJsonRpcProcedure } from '@tevm/actions'
 *
 * // Create a node with automatic mining
 * const node = createTevmNode({ miningConfig: { type: 'auto' } })
 *
 * // Get a block number
 * const blockNumber = await node.getBlockNumber()
 *
 * // Create the debug procedure handler
 * const debugProcedure = debugTraceBlockByNumberJsonRpcProcedure(node)
 *
 * // Trace the block by number
 * const trace = await debugProcedure({
 *   jsonrpc: '2.0',
 *   method: 'debug_traceBlockByNumber',
 *   params: [
 *     '0x1',  // Block number as hex string, or 'latest', 'earliest', 'pending'
 *     {
 *       tracer: 'callTracer',  // Or 'prestateTracer'
 *       tracerConfig: {
 *         // Configuration options for the tracer
 *       }
 *     }
 *   ],
 *   id: 1
 * })
 *
 * console.log('Block transaction traces:', trace.result)
 * ```
 */
export const debugTraceBlockByNumberJsonRpcProcedure = (client) => {
	// Get the main debug_traceBlock procedure to delegate to
	const debugTraceBlock = debugTraceBlockJsonRpcProcedure(client)

	/**
	 * @template {'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer'} TTracer
	 * @template {boolean} TDiffMode
	 * @param {import('./DebugJsonRpcRequest.js').DebugTraceBlockByNumberJsonRpcRequest<TTracer, TDiffMode>} request
	 * @returns {Promise<import('./DebugJsonRpcResponse.js').DebugTraceBlockByNumberJsonRpcResponse<TTracer, TDiffMode>>}
	 */
	return async (request) => {
		// Extract parameters: [blockNumber, tracerOptions]
		const [blockNumberParam, tracerOptions = {}] = request.params

		client.logger.debug(
			{ blockNumber: blockNumberParam, tracer: tracerOptions.tracer },
			'debug_traceBlockByNumber: executing with params',
		)

		// Construct parameters in the format expected by debug_traceBlock
		const debugTraceBlockParams = {
			blockNumber: blockNumberParam,
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
		return {
			...result,
			method: request.method,
		}
	}
}
