import { simulateCallHandler } from './simulateCallHandler.js'

/**
 * Creates a JSON-RPC procedure handler for the `tevm_simulateCall` method
 *
 * This handler simulates a call transaction in the context of a specific block,
 * with the option to simulate after specific transactions in the block.
 *
 * @param {import('@tevm/node').TevmNode} client - The TEVM node instance
 * @returns {import('../tevm-request-handler/TevmJsonRpcRequestHandler.js').TevmJsonRpcRequestHandler} A handler function for tevm_simulateCall requests
 * @throws {Error} If simulation fails
 *
 * @example
 * ```javascript
 * import { createTevmNode } from '@tevm/node'
 * import { simulateCallJsonRpcProcedure } from '@tevm/actions'
 *
 * // Create a node
 * const node = createTevmNode()
 *
 * // Create the procedure handler
 * const simulateCallProcedure = simulateCallJsonRpcProcedure(node)
 *
 * // Use it to handle JSON-RPC requests
 * const result = await simulateCallProcedure({
 *   jsonrpc: '2.0',
 *   method: 'tevm_simulateCall',
 *   params: [{
 *     blockNumber: 1000000,
 *     transactionIndex: 2,
 *     to: '0x1234567890123456789012345678901234567890',
 *     data: '0xabcdef',
 *     value: 1000000000
 *   }],
 *   id: 1
 * })
 * ```
 */
export const simulateCallJsonRpcProcedure = (client) => {
	const handler = simulateCallHandler(client)

	/**
	 * @type {import('../tevm-request-handler/TevmJsonRpcRequestHandler.js').TevmJsonRpcRequestHandler}
	 */
	return async (request) => {
		try {
			// Ensure params exist and are well-formed
			if (!request.params || !Array.isArray(request.params) || request.params.length === 0) {
				// @ts-ignore - TypeScript has trouble with complex union types in the error response
				return {
					jsonrpc: '2.0',
					id: request.id,
					method: request.method,
					error: {
						code: -32602,
						message: 'Invalid params: Parameters are required and must be provided as an array',
					}
				}
			}

			// Extract and validate the parameters
			const params = request.params[0]
			if (typeof params !== 'object' || params === null) {
				// @ts-ignore - TypeScript has trouble with complex union types in the error response
				return {
					jsonrpc: '2.0',
					id: request.id,
					method: request.method,
					error: {
						code: -32602,
						message: 'Invalid params: First parameter must be an object',
					}
				}
			}

			// Create a safe SimulateCallParams object with type assertion
			/** @type {import('./SimulateCallParams.js').SimulateCallParams} */
			const simulateCallParams = {
				...(typeof params === 'object' && params !== null ? params : {}),
			}

			const result = await handler(simulateCallParams)
			// @ts-ignore - TypeScript has trouble with complex union types in the success response
			return {
				jsonrpc: '2.0',
				id: request.id,
				method: request.method,
				result,
			}
		} catch (error) {
			// @ts-ignore - TypeScript has trouble with complex union types in the error response
			return {
				jsonrpc: '2.0',
				id: request.id,
				method: request.method,
				error: {
					code: -32000,
					message: error instanceof Error ? error.message : String(error),
				}
			}
		}
	}
}