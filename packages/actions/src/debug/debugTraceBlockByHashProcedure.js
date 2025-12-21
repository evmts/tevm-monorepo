import { debugTraceBlockJsonRpcProcedure } from './debugTraceBlockProcedure.js'

/**
 * Creates a JSON-RPC procedure handler for the `debug_traceBlockByHash` method
 *
 * This handler is a convenience wrapper around `debug_traceBlock` that accepts a block hash
 * as the first parameter directly (not wrapped in an object). It traces the execution of all
 * transactions in the specified block.
 *
 * @param {import('@tevm/node').TevmNode} client - The TEVM node instance
 * @returns {import('./DebugProcedure.js').DebugTraceBlockByHashProcedure} A handler function for debug_traceBlockByHash requests
 * @throws {Error} If the block cannot be found
 * @throws {Error} If the parent block's state root is not available and cannot be forked
 *
 * @example
 * ```javascript
 * import { createTevmNode } from '@tevm/node'
 * import { debugTraceBlockByHashJsonRpcProcedure } from '@tevm/actions'
 *
 * // Create a node with automatic mining
 * const node = createTevmNode({ miningConfig: { type: 'auto' } })
 *
 * // Get a block hash
 * const block = await node.getVm().then(vm => vm.blockchain.getCanonicalHeadBlock())
 * const blockHash = '0x' + block.hash().toString('hex')
 *
 * // Create the debug procedure handler
 * const debugProcedure = debugTraceBlockByHashJsonRpcProcedure(node)
 *
 * // Trace the block by hash
 * const trace = await debugProcedure({
 *   jsonrpc: '2.0',
 *   method: 'debug_traceBlockByHash',
 *   params: [
 *     blockHash,  // Block hash as hex string
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
			{ blockHash: blockHashParam, tracer: tracerOptions.tracer },
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
		return {
			...result,
			method: request.method,
		}
	}
}
