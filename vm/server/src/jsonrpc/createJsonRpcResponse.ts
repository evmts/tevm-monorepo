import type { JsonRpcErrorResponse } from "./JsonRpcErrorResponse"
import type { JsonRpcSuccessResponse } from "./JsonRpcSuccessResponse"
import { createJsonRpcErrorResponse } from "./createJsonRpcErrorResponse"
import { createJsonRpcSuccessResponse } from "./createJsonRpcSuccessResponse"

export function createJsonRpcResponse<TResponse extends Omit<JsonRpcSuccessResponse, 'jsonrpc'> | Omit<JsonRpcErrorResponse, 'jsonrpc'>>(
  response: TResponse,
): Pick<JsonRpcSuccessResponse, 'jsonrpc'> {
  if ('result' in response) {
    return createJsonRpcSuccessResponse(response)
  }
  if ('error' in response) {
    return createJsonRpcErrorResponse(response)
  }
  throw new Error('Invalid response. Must contain a result or error')
}

