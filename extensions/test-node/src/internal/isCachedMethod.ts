import type { EthJsonRpcRequest } from "@tevm/actions"
import { isHex } from "viem"

// This only tells polly if this should be cached or not.
// Actually caching/retrieving from cache depending on the parameters is done separately.
export const isCachedMethod = (body: string | undefined) => {
  if (!body) return false
  const request = JSON.parse(body) as EthJsonRpcRequest

  switch (request.method) {
    // TODO: handle all eth_methods
    case 'eth_blockNumber':
      return false
    case 'eth_getBlockByNumber':
      return isHex(request.params[0]) // only cache if block number is hex and not a tag
  }

  return true
}