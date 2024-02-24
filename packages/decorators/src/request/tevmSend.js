import { requestProcedure, requestBulkProcedure } from '@tevm/procedures'
/**
 * The low level method for sending and recieving a JSON-RPC request.
 * Strictly adheres to the JSON-RPC 2.0 spec.
 * See `requestEip1193` for a more user friendly method.
 * @returns {import('@tevm/base-client').Extension<{send: import('@tevm/procedures-types').TevmJsonRpcRequestHandler, sendBulk: import('@tevm/procedures-types').TevmJsonRpcBulkRequestHandler}>}
 */
export const tevmSend = () => (client) => {
  return {
    send: requestProcedure(client),
    sendBulk: requestBulkProcedure(client),
  }
}
