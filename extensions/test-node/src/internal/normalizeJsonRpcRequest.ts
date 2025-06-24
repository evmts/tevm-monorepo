import type { Hex } from 'viem'
import { ethMethodToCacheKey } from './ethMethodToCacheKey.js'

export const normalizeJsonRpcRequest = (chainId: Hex, body: string): string => {
	try {
		const rpcRequest = JSON.parse(body)
		if (!('id' in rpcRequest) || !('method' in rpcRequest) || !('jsonrpc' in rpcRequest)) return body

		if (!(rpcRequest.method in ethMethodToCacheKey)) return body

		const key = ethMethodToCacheKey[rpcRequest.method as keyof typeof ethMethodToCacheKey]?.(rpcRequest)
		return `${chainId}:${key}`
	} catch (err) {
		// If not valid JSON, fall back to original body
		return body
	}
}
