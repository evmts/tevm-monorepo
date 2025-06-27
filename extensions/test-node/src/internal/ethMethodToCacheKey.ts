import type { EIP1193Parameters, EIP1474Methods } from 'viem'

type CacheKeyParamsSelector<TMethod extends EIP1193Parameters<EIP1474Methods>['method']> = (
	req: Extract<EIP1193Parameters<EIP1474Methods>, { method: TMethod }>,
) => unknown[]

// Turn a request (that can be cached, we ignore non cacheable methods) into a cache key that depends on block height
// i.e. we don't pass the full request as req.id for instance would make every request unique
const paramSelectors: {
	[TMethod in EIP1193Parameters<EIP1474Methods>['method']]?: CacheKeyParamsSelector<TMethod>
} = {
	eth_getBlockByNumber: (req) => [req.params[0].toLowerCase(), req.params[1]],
}

export const ethMethodToCacheKey = <TMethod extends EIP1193Parameters<EIP1474Methods>['method']>(
	method: TMethod,
): ((req: Extract<EIP1193Parameters<EIP1474Methods>, { method: TMethod }> & { jsonrpc: string }) => string) => {
	const selector = paramSelectors[method]

	return (req) => {
		const params = selector ? (selector as CacheKeyParamsSelector<TMethod>)(req) : []
		return JSON.stringify([req.jsonrpc, req.method, ...params])
	}
}
