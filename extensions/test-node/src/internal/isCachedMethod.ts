import { isHex, type EIP1193RequestFn } from 'viem'

// This only tells polly if this should be cached or not.
// Actually caching/retrieving from cache depending on the parameters is done separately.
export const isCachedMethod = ({ method, params: _params}: Parameters<EIP1193RequestFn>[0]) => {
	if (_params && !Array.isArray(_params)) return false
	const params = _params as unknown[]

	switch (method) {
		// TODO: handle all eth_methods
		case 'eth_blockNumber':
			return false
		case 'eth_getBlockByNumber':
			return isHex(params?.[0]) // only cache if block number is hex and not a tag
	}

	return true
}
