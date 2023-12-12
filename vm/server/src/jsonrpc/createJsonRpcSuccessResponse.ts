import type { JsonRpcSuccessResponse } from "./JsonRpcSuccessResponse.js"

export function createJsonRpcSuccessResponse<TResponse extends Omit<JsonRpcSuccessResponse, 'jsonrpc'>>(
  response: TResponse,
): TResponse & Pick<JsonRpcSuccessResponse, 'jsonrpc'> {
  const out: TResponse & Pick<JsonRpcSuccessResponse, 'jsonrpc'> = {
    jsonrpc: '2.0',
    ...response,
  }
  return out
}
