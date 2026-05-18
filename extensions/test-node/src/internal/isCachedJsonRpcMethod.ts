import type { BlockTag } from '@tevm/actions'
import {
	type EIP1193Parameters,
	type EIP1474Methods,
	type Hex,
	isHex,
	type RpcBlockIdentifier,
	type RpcTransactionRequest,
} from 'viem'

/**
 * Checks if a block tag is static (deterministic) and therefore safe to cache.
 * Static tags include: block hashes, hex block numbers, and 'earliest'.
 * Dynamic tags like 'latest', 'pending', 'safe', 'finalized' should not be cached.
 *
 * @param param - The block tag to check
 * @returns true if the block tag is static and cacheable
 */
const isStaticBlockTag = (param: BlockTag | Hex | RpcBlockIdentifier | undefined) =>
	param &&
	((typeof param === 'object' && 'blockHash' in param && param.blockHash !== undefined) ||
		(typeof param === 'object' && 'blockNumber' in param && param.blockNumber !== undefined) ||
		isHex(param) ||
		param === 'earliest')

/**
 * Checks if a transaction has all required static parameters that would make
 * the response deterministic. Required fields are: nonce, gas, and either
 * gasPrice (legacy) or maxFeePerGas + maxPriorityFeePerGas (EIP-1559).
 *
 * @param tx - The transaction request to check
 * @returns true if all required static parameters are provided
 */
const isStaticTxParams = (tx: RpcTransactionRequest) => {
	const isLegacy = tx.gasPrice !== undefined
	const isEip1559 = tx.maxFeePerGas !== undefined && tx.maxPriorityFeePerGas !== undefined

	return tx.nonce !== undefined && tx.gas !== undefined && (isLegacy || isEip1559)
}

/**
 * Determines if a JSON-RPC method call should be cached based on the method
 * and its parameters. Methods that return deterministic results for static
 * block tags are cacheable, while methods with side effects or dynamic results
 * are not cached.
 *
 * @param request - The EIP-1193 request with method and params
 * @returns true if the method call should be cached
 *
 * @example
 * ```typescript
 * import { isCachedJsonRpcMethod } from '@tevm/test-node'
 *
 * // Cacheable - static block number
 * isCachedJsonRpcMethod({ method: 'eth_getBalance', params: ['0x...', '0x123'] }) // true
 *
 * // Not cacheable - dynamic block tag
 * isCachedJsonRpcMethod({ method: 'eth_getBalance', params: ['0x...', 'latest'] }) // false
 *
 * // Never cacheable - has side effects
 * isCachedJsonRpcMethod({ method: 'eth_sendTransaction', params: [{}] }) // false
 * ```
 */
export const isCachedJsonRpcMethod = ({ method, params }: EIP1193Parameters<EIP1474Methods>) => {
	switch (method) {
		case 'eth_accounts':
			return false
		case 'eth_blobBaseFee':
			return false
		case 'eth_blockNumber':
			return false
		case 'eth_chainId':
			return true
		case 'eth_call':
			return false
		case 'eth_coinbase':
			return true
		case 'eth_createAccessList':
			return isStaticBlockTag(params[1]) // non provided params can be computed on the fly, it won't change the output (e.g. gasPrice, nonce)
		case 'eth_estimateGas':
			return isStaticBlockTag(params[1]) // same here
		case 'eth_feeHistory':
			return isStaticBlockTag(params[1])
		case 'eth_gasPrice':
			return false
		case 'eth_getBalance':
			return isStaticBlockTag(params[1])
		case 'eth_getBlockByHash':
			return true
		case 'eth_getBlockByNumber':
			return isStaticBlockTag(params[0])
		case 'eth_getBlockTransactionCountByHash':
			return true
		case 'eth_getBlockTransactionCountByNumber':
			return isStaticBlockTag(params[0])
		case 'eth_getCode':
			return isStaticBlockTag(params[1])
		case 'eth_getFilterChanges':
			return false
		case 'eth_getFilterLogs':
			return false
		case 'eth_getLogs':
			return (
				isStaticBlockTag(params[0].fromBlock as BlockTag | Hex | undefined) &&
				isStaticBlockTag(params[0].toBlock as BlockTag | Hex | undefined)
			)
		case 'eth_getProof':
			return isStaticBlockTag(params[2])
		case 'eth_getStorageAt':
			return isStaticBlockTag(params[2])
		case 'eth_getTransactionByBlockHashAndIndex':
			return true
		case 'eth_getTransactionByBlockNumberAndIndex':
			return isStaticBlockTag(params[0])
		case 'eth_getTransactionByHash':
			return true
		case 'eth_getTransactionCount':
			return isStaticBlockTag(params[1])
		case 'eth_getTransactionReceipt':
			return true
		case 'eth_getUncleByBlockHashAndIndex':
			return true
		case 'eth_getUncleByBlockNumberAndIndex':
			return isStaticBlockTag(params[0])
		case 'eth_getUncleCountByBlockHash':
			return true
		case 'eth_getUncleCountByBlockNumber':
			return isStaticBlockTag(params[0])
		case 'eth_maxPriorityFeePerGas':
			return false
		case 'eth_newBlockFilter':
			return false
		case 'eth_newFilter':
			return false
		case 'eth_newPendingTransactionFilter':
			return false
		case 'eth_protocolVersion':
			return true
		case 'eth_sendRawTransaction':
			return false
		case 'eth_sendTransaction':
			return false
		case 'eth_simulateV1':
			return isStaticBlockTag(params[1])
		case 'eth_sign':
			return true
		case 'eth_signTransaction':
			return isStaticTxParams(params[0])
		case 'eth_syncing':
			return false
		case 'eth_uninstallFilter':
			return false
		// EIP-4337 (bundler)
		case 'eth_estimateUserOperationGas':
			return true
		case 'eth_getUserOperationByHash':
			return true
		case 'eth_getUserOperationReceipt':
			return true
		case 'eth_sendUserOperation':
			return false
		case 'eth_supportedEntryPoints':
			return true
	}

	return false
}
