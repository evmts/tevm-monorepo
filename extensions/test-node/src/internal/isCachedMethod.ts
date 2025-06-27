import { type EIP1193Parameters, type EIP1474Methods, isHex } from 'viem'

// This only tells polly if this should be cached or not.
// Actually caching/retrieving from cache depending on the parameters is done separately.
export const isCachedMethod = ({ method, params }: EIP1193Parameters<EIP1474Methods>) => {
	switch (method) {
		// TODO: handle all eth_methods
		case 'eth_blockNumber':
			return false
		case 'eth_getBlockByNumber':
			return isHex(params[0]) // only cache if block number is hex and not a tag
	}

	return false
}
