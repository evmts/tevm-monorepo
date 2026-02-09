import { type BlockTag, type EIP1193Parameters, type EIP1474Methods, type Hex } from 'viem'
import { normalizeBlockTag } from './normalizeBlockTag.js'
import { normalizeHex } from './normalizeHex.js'
import { normalizeTx } from './normalizeTx.js'
import { normalizeUserOperation } from './normalizeUserOperation.js'

type CacheKeyParamsSelector<TMethod extends EIP1193Parameters<EIP1474Methods>['method']> = (
	req: Extract<EIP1193Parameters<EIP1474Methods>, { method: TMethod }>,
) => unknown[]

const paramSelectors: {
	[TMethod in EIP1193Parameters<EIP1474Methods>['method']]?: CacheKeyParamsSelector<TMethod>
} = {
	eth_chainId: () => [],
	eth_coinbase: () => [],
	eth_createAccessList: (req) => [...normalizeTx(req.params[0]), normalizeBlockTag(req.params[1])],
	eth_estimateGas: (req) => [...normalizeTx(req.params[0]), normalizeBlockTag(req.params[1]), req.params[2]], // overrides have been serialized
	eth_feeHistory: (req) => [normalizeHex(req.params[0]), normalizeBlockTag(req.params[1]), req.params[2]],
	eth_getBalance: (req) => [normalizeHex(req.params[0]), normalizeBlockTag(req.params[1])],
	eth_getBlockByHash: (req) => [normalizeHex(req.params[0]), req.params[1]],
	eth_getBlockByNumber: (req) => [normalizeBlockTag(req.params[0]), req.params[1]],
	eth_getBlockTransactionCountByHash: (req) => [normalizeHex(req.params[0])],
	eth_getBlockTransactionCountByNumber: (req) => [normalizeBlockTag(req.params[0])],
	eth_getCode: (req) => [normalizeHex(req.params[0]), normalizeBlockTag(req.params[1])],
	eth_getLogs: (req) => [
		normalizeBlockTag(req.params[0].fromBlock as BlockTag | Hex | undefined),
		normalizeBlockTag(req.params[0].toBlock as BlockTag | Hex | undefined),
	],
	eth_getProof: (req) => [
		normalizeHex(req.params[0]),
		req.params[1].map(normalizeHex),
		normalizeBlockTag(req.params[2]),
	],
	eth_getStorageAt: (req) => [
		normalizeHex(req.params[0]),
		normalizeHex(req.params[1]),
		normalizeBlockTag(req.params[2]),
	],
	eth_getTransactionByBlockHashAndIndex: (req) => [normalizeHex(req.params[0]), normalizeHex(req.params[1])],
	eth_getTransactionByBlockNumberAndIndex: (req) => [normalizeBlockTag(req.params[0]), normalizeHex(req.params[1])],
	eth_getTransactionByHash: (req) => [normalizeHex(req.params[0])],
	eth_getTransactionCount: (req) => [normalizeHex(req.params[0]), normalizeBlockTag(req.params[1])],
	eth_getTransactionReceipt: (req) => [normalizeHex(req.params[0])],
	eth_getUncleByBlockHashAndIndex: (req) => [normalizeHex(req.params[0]), normalizeHex(req.params[1])],
	eth_getUncleByBlockNumberAndIndex: (req) => [normalizeBlockTag(req.params[0]), normalizeHex(req.params[1])],
	eth_getUncleCountByBlockHash: (req) => [normalizeHex(req.params[0])],
	eth_getUncleCountByBlockNumber: (req) => [normalizeBlockTag(req.params[0])],
	eth_protocolVersion: () => [],
	eth_sign: (req) => [normalizeHex(req.params[0]), normalizeHex(req.params[1])],
	eth_signTransaction: (req) => [normalizeTx(req.params[0])],
	eth_simulateV1: (req) => req.params, // TODO: normalize
	// EIP-4337 (bundler)
	eth_estimateUserOperationGas: (req) => [
		normalizeUserOperation(req.params[0]),
		normalizeHex(req.params[1]),
		req.params[2],
	],
	eth_getUserOperationByHash: (req) => [normalizeHex(req.params[0])],
	eth_getUserOperationReceipt: (req) => [normalizeHex(req.params[0])],
	eth_supportedEntryPoints: () => [],
}

// Turn a request (that can be cached, we ignore non cacheable methods) into a cache key that depends on block height
// i.e. we don't pass the full request as req.id for instance would make every request unique
export const ethMethodToCacheKey = <TMethod extends EIP1193Parameters<EIP1474Methods>['method']>(
	method: TMethod,
): ((req: Extract<EIP1193Parameters<EIP1474Methods>, { method: TMethod }> & { jsonrpc: string }) => string) => {
	const selector = paramSelectors[method]

	return (req) => {
		const params = selector ? (selector as CacheKeyParamsSelector<TMethod>)(req) : []
		return JSON.stringify([req.jsonrpc, req.method, ...params])
	}
}
