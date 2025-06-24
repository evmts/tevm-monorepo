import type { EthJsonRpcRequest } from "@tevm/actions"

// Turn a request (that can be cached, we ignore non cacheable methods) into a cache key that depends on block height
// i.e. we don't pass the full request as req.id for instance would make every request unique
export const ethMethodToCacheKey: Partial<{
	[TMethod in EthJsonRpcRequest['method']]: (request: Extract<EthJsonRpcRequest, { method: TMethod }>) => string
}> = {
  eth_getBlockByNumber: (req) =>  JSON.stringify([req.jsonrpc, req.method, req.params[0].toLowerCase(), req.params[1]])
}