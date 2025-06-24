import type { BlockTag, EthJsonRpcRequest } from '@tevm/actions'
import { type Hex } from 'viem'
import { normalizeBlockTag } from './normalizeBlockTag.js'
import { normalizeHex } from './normalizeHex.js'
import { normalizeTx } from './normalizeTx.js'

type CacheKeyParamsSelector<TMethod extends EthJsonRpcRequest['method']> = (
	req: Extract<EthJsonRpcRequest, { method: TMethod }>,
) => unknown[]

const paramSelectors: {
	[TMethod in EthJsonRpcRequest['method']]?: CacheKeyParamsSelector<TMethod>
} = {
	eth_chainId: () => [],
	eth_coinbase: () => [],
	eth_createAccessList: (req) => [...normalizeTx(req.params[0]), normalizeBlockTag(req.params[1])],
	eth_estimateGas: (req) => [
		...normalizeTx(req.params[0]),
		normalizeBlockTag(req.params[1]),
		req.params[2],
		req.params[3],
	], // overrides have been serialized
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
	eth_newFilter: (req) => [
		normalizeBlockTag(req.params[0].fromBlock as BlockTag | Hex | undefined),
		normalizeBlockTag(req.params[0].toBlock as BlockTag | Hex | undefined),
	],
	eth_protocolVersion: () => [],
	eth_sign: (req) => [normalizeHex(req.params[0]), normalizeHex(req.params[1])],
	eth_signTransaction: (req) => [normalizeTx(req.params[0])],
	// TODO: when we support EIP-4337 (bundler)
	// eth_getUserOperationByHash
	// eth_getUserOperationReceipt
	// eth_supportedEntryPoints
	// TODO: when implemented
	// eth_feeHistory (if newestBlock is not a block tag)
	// eth_getProof (if block number is not a block tag)
	// eth_simulateV1 (if blockParameter is not a block tag)
}

// Turn a request (that can be cached, we ignore non cacheable methods) into a cache key that depends on block height
// i.e. we don't pass the full request as req.id for instance would make every request unique
export const ethMethodToCacheKey = <TMethod extends EthJsonRpcRequest['method']>(
	method: TMethod,
): ((req: Extract<EthJsonRpcRequest, { method: TMethod }>) => string) => {
	const selector = paramSelectors[method]

	return (req) => {
		const params = selector ? (selector as CacheKeyParamsSelector<TMethod>)(req) : []
		return JSON.stringify([req.jsonrpc, req.method, ...params])
	}
}
