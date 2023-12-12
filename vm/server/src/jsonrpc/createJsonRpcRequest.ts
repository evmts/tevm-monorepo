import type { JsonRpcRequest } from "./JsonRpcRequest.js"

export function createJsonRpcRequest<TRequest extends Omit<JsonRpcRequest, 'jsonrpc'>>(
  request: TRequest,
): TRequest & Pick<JsonRpcRequest, 'jsonrpc'> {
  const out: TRequest & Pick<JsonRpcRequest, 'jsonrpc'> = {
    jsonrpc: '2.0',
    ...request,
  }
  return out
}

