import { simulateCallHandler } from './simulateCallHandler.js'

/**
 * Creates a JSON-RPC procedure handler for the `tevm_simulateCall` method
 *
 * This handler simulates a call transaction in the context of a specific block,
 * with the option to simulate after specific transactions in the block.
 *
 * @param {import('@tevm/node').TevmNode} client - The TEVM node instance
 * @returns {import('../requestProcedure.js').JsonRpcRequestHandler} A handler function for tevm_simulateCall requests
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
   * @type {import('../requestProcedure.js').JsonRpcRequestHandler}
   */
  return async (request) => {
    try {
      const result = await handler(request.params[0])
      return {
        result,
        jsonrpc: '2.0',
        method: request.method,
        ...(request.id !== undefined ? { id: request.id } : {}),
      }
    } catch (error) {
      return {
        error: {
          code: -32000,
          message: error instanceof Error ? error.message : String(error),
        },
        jsonrpc: '2.0',
        method: request.method,
        ...(request.id !== undefined ? { id: request.id } : {}),
      }
    }
  }
}