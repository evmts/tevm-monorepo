import type { BlockTag } from '@tevm/actions'
import { type EIP1193Parameters, type EIP1474Methods, type Hex, isHex, type RpcBlockIdentifier } from 'viem'

// only cache if block number is fixed (hex) and not a tag
const isFixedBlockTag = (param: BlockTag | Hex | RpcBlockIdentifier | undefined) => param && isHex(param)

// This only tells polly if this should be cached or not.
// Actually caching/retrieving from cache depending on the parameters is done separately.
export const isCachedMethod = ({ method, params }: EIP1193Parameters<EIP1474Methods>) => {
	switch (method) {
		case 'eth_accounts':
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
			return isFixedBlockTag(params[1])
		case 'eth_estimateGas':
			return isFixedBlockTag(params[1])
		case 'eth_gasPrice':
			return false
		case 'eth_getBalance':
			return isFixedBlockTag(params[1])
		case 'eth_getBlockByHash':
			return true
		case 'eth_getBlockByNumber':
			return isFixedBlockTag(params[0])
		case 'eth_getBlockTransactionCountByHash':
			return true
		case 'eth_getBlockTransactionCountByNumber':
			return isFixedBlockTag(params[0])
		case 'eth_getCode':
			return isFixedBlockTag(params[1])
		case 'eth_getFilterChanges':
			return false
		case 'eth_getFilterLogs':
			return false
		case 'eth_getLogs':
			return (
				isFixedBlockTag(params[0].fromBlock as BlockTag | Hex | undefined) &&
				isFixedBlockTag(params[0].toBlock as BlockTag | Hex | undefined)
			)
		case 'eth_getStorageAt':
			return isFixedBlockTag(params[2])
		case 'eth_getTransactionByBlockHashAndIndex':
			return true
		case 'eth_getTransactionByBlockNumberAndIndex':
			return isFixedBlockTag(params[0])
		case 'eth_getTransactionByHash':
			return true
		case 'eth_getTransactionCount':
			return isFixedBlockTag(params[1])
		case 'eth_getTransactionReceipt':
			return true
		case 'eth_getUncleByBlockHashAndIndex':
			return true
		case 'eth_getUncleByBlockNumberAndIndex':
			return isFixedBlockTag(params[0])
		case 'eth_getUncleCountByBlockHash':
			return true
		case 'eth_getUncleCountByBlockNumber':
			return isFixedBlockTag(params[0])
		case 'eth_newBlockFilter':
			return false
		case 'eth_newFilter':
			return isFixedBlockTag(params[0].fromBlock) && isFixedBlockTag(params[0].toBlock)
		case 'eth_newPendingTransactionFilter':
			return false
		case 'eth_protocolVersion':
			return true
		case 'eth_sendRawTransaction':
			return false
		case 'eth_sendTransaction':
			return false
		case 'eth_sign':
			return true
		case 'eth_signTransaction': {
			const tx = params[0]
			const isLegacy = tx.gasPrice !== undefined
			const isEip1559 =
				'maxFeePerGas' in tx &&
				'maxPriorityFeePerGas' in tx &&
				tx.maxFeePerGas !== undefined &&
				tx.maxPriorityFeePerGas !== undefined
			return tx.nonce !== undefined && tx.gas !== undefined && (isLegacy || isEip1559)
		}
		case 'eth_syncing':
			return false
		case 'eth_uninstallFilter':
			return false
	}

	return false
}
