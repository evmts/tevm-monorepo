import { JsonRpcErrorResponse } from "./JsonRpcErrorResponse"

export function createJsonRpcErrorResponse<TResponse extends Omit<JsonRpcErrorResponse, 'jsonrpc'>>(
  response: TResponse,
): TResponse & Pick<JsonRpcErrorResponse, 'jsonrpc'> {
  const out: TResponse & Pick<JsonRpcErrorResponse, 'jsonrpc'> = {
    jsonrpc: '2.0',
    ...response,
  }
  return out
}

