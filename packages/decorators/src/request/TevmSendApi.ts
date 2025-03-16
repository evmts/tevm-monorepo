import type { TevmJsonRpcBulkRequestHandler, TevmJsonRpcRequestHandler } from '@tevm/actions'

/**
 * API interface for sending JSON-RPC requests to Tevm
 * Provides methods for both single and bulk requests
 * 
 * @example
 * ```typescript
 * import { TevmSendApi } from '@tevm/decorators'
 * 
 * // Example usage with a Tevm client
 * const client: TevmSendApi = {
 *   send: async (request) => { /* implementation */ },
 *   sendBulk: async (requests) => { /* implementation */ }
 * }
 * 
 * // Send a single request
 * await client.send({
 *   method: 'eth_blockNumber',
 *   params: []
 * })
 * 
 * // Send multiple requests in bulk
 * await client.sendBulk([
 *   { method: 'eth_blockNumber', params: [] },
 *   { method: 'eth_getBalance', params: ['0x...', 'latest'] }
 * ])
 * ```
 */
export type TevmSendApi = {
	send: TevmJsonRpcRequestHandler
	sendBulk: TevmJsonRpcBulkRequestHandler
}
