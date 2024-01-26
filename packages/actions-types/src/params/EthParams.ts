import type { Hex, BlockParam, EmptyParams, FilterParams, Address } from '../common/index.js'
import type { CallParams } from './CallParams.js'

// eth_accounts
/**
 * Params taken by `eth_accounts` handler (no params)
 */
export type EthAccountsParams = EmptyParams
// eth_blockNumber
/**
 * Based on the JSON-RPC request for `eth_blockNumber` procedure (no params)
 */
export type EthBlockNumberParams = EmptyParams
// eth_call
/**
 * Based on the JSON-RPC request for `eth_call` procedure
 */
export type EthCallParams = {
	/**
	 * The address from which the transaction is sent. Defaults to zero address
	 */
	from?: Address
	/**
	 * The address to which the transaction is addressed. Defaults to zero address
	 */
	to?: Address
	/**
	 * The integer of gas provided for the transaction execution
	 */
	gas?: bigint
	/**
	 * The integer of gasPrice used for each paid gas
	 */
	gasPrice?: bigint
	/**
	 * The integer of value sent with this transaction
	 */
	value?: bigint
	/**
	 * The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation
	 * Defaults to zero data
	 */
	data?: Hex

	/**
	 * The block number hash or block tag
	 */
	tag?: BlockParam
}

// eth_chainId
/**
 * Based on the JSON-RPC request for `eth_chainId` procedure
 */
export type EthChainIdParams = EmptyParams
// eth_coinbase
/**
 * Based on the JSON-RPC request for `eth_coinbase` procedure
 */
export type EthCoinbaseParams = EmptyParams
// eth_estimateGas
/**
 * Based on the JSON-RPC request for `eth_estimateGas` procedure
 * This type is a placeholder
 */
export type EthEstimateGasParams = CallParams
// eth_hashrate
/**
 * Based on the JSON-RPC request for `eth_hashrate` procedure
 */
export type EthHashrateParams = EmptyParams
// eth_gasPrice
/**
 * Based on the JSON-RPC request for `eth_gasPrice` procedure
 */
export type EthGasPriceParams = EmptyParams
// eth_getBalance
/**
 *Based on the  JSON-RPC request for `eth_getBalance` procedure
 */
export type EthGetBalanceParams = { address: Address; tag?: BlockParam }
// eth_getBlockByHash
/**
 * Based on the JSON-RPC request for `eth_getBlockByHash` procedure
 */
export type EthGetBlockByHashParams = {
	blockHash: Hex
	fullTransactionObjects: boolean
}
// eth_getBlockByNumber
/**
 * Based on the JSON-RPC request for `eth_getBlockByNumber` procedure
 */
export type EthGetBlockByNumberParams = {
	tag?: BlockParam
	fullTransactionObjects: boolean
}
// eth_getBlockTransactionCountByHash
/**
 * Based on the JSON-RPC request for `eth_getBlockTransactionCountByHash` procedure
 */
export type EthGetBlockTransactionCountByHashParams = { hash: Hex }
// eth_getBlockTransactionCountByNumber
/**
 * Based on the JSON-RPC request for `eth_getBlockTransactionCountByNumber` procedure
 */
export type EthGetBlockTransactionCountByNumberParams = { tag?: BlockParam }
// eth_getCode
/**
 * Based on the JSON-RPC request for `eth_getCode` procedure
 */
export type EthGetCodeParams = { address: Address; tag?: BlockParam }
// eth_getFilterChanges
/**
 * Based on the JSON-RPC request for `eth_getFilterChanges` procedure
 */
export type EthGetFilterChangesParams = { filterId: Hex }
// eth_getFilterLogs
/**
 * Based on the JSON-RPC request for `eth_getFilterLogs` procedure
 */
export type EthGetFilterLogsParams = { filterId: Hex }
// eth_getLogs
/**
 * Based on the JSON-RPC request for `eth_getLogs` procedure
 */
export type EthGetLogsParams = { filterParams: FilterParams }
// eth_getStorageAt
/**
 * Based on the JSON-RPC request for `eth_getStorageAt` procedure
 */
export type EthGetStorageAtParams = {
	address: Address
	position: Hex
	tag?: BlockParam
}
// eth_getTransactionCount
/**
 * Based on the JSON-RPC request for `eth_getTransactionCount` procedure
 */
export type EthGetTransactionCountParams = {
	address: Address
	tag?: BlockParam
}
// eth_getUncleCountByBlockHash
/**
 * Based on the JSON-RPC request for `eth_getUncleCountByBlockHash` procedure
 */
export type EthGetUncleCountByBlockHashParams = { hash: Hex }
// eth_getUncleCountByBlockNumber
/**
 * Based on the JSON-RPC request for `eth_getUncleCountByBlockNumber` procedure
 */
export type EthGetUncleCountByBlockNumberParams = { tag?: BlockParam }
// eth_getTransactionByHash
/**
 * Based on the JSON-RPC request for `eth_getTransactionByHash` procedure
 */
export type EthGetTransactionByHashParams = { data: Hex }
// eth_getTransactionByBlockHashAndIndex
/**
 * Based on the JSON-RPC request for `eth_getTransactionByBlockHashAndIndex` procedure
 */
export type EthGetTransactionByBlockHashAndIndexParams = {
	tag?: Hex
	index: Hex
}
// eth_getTransactionByBlockNumberAndIndex
/**
 * Based on the JSON-RPC request for `eth_getTransactionByBlockNumberAndIndex` procedure
 */
export type EthGetTransactionByBlockNumberAndIndexParams = {
	tag?: BlockParam
	index: Hex
}
// eth_getTransactionReceipt
/**
 * Based on the JSON-RPC request for `eth_getTransactionReceipt` procedure
 */
export type EthGetTransactionReceiptParams = { hash: Hex }
// eth_getUncleByBlockHashAndIndex
/**
 * Based on the JSON-RPC request for `eth_getUncleByBlockHashAndIndex` procedure
 */
export type EthGetUncleByBlockHashAndIndexParams = {
	blockHash: Hex
	uncleIndex: Hex
}
// eth_getUncleByBlockNumberAndIndex
/**
 * Based on the JSON-RPC request for `eth_getUncleByBlockNumberAndIndex` procedure
 */
export type EthGetUncleByBlockNumberAndIndexParams = {
	tag?: BlockParam
	uncleIndex: Hex
}
// eth_mining
/**
 * Based on the JSON-RPC request for `eth_mining` procedure
 */
export type EthMiningParams = EmptyParams
// eth_protocolVersion
/**
 * Based on the JSON-RPC request for `eth_protocolVersion` procedure
 */
export type EthProtocolVersionParams = EmptyParams
// eth_sendRawTransaction
/**
 * Based on the JSON-RPC request for `eth_sendRawTransaction` procedure
 * This type is a placeholder
 */
export type EthSendRawTransactionParams = CallParams
// eth_sendTransaction
/**
 * Based on the JSON-RPC request for `eth_sendTransaction` procedure
 * This type is a placeholder
 * @experimental
 */
export type EthSendTransactionParams = CallParams
// eth_sign
/**
 * Based on the JSON-RPC request for `eth_sign` procedure
 * @experimental
 */
export type EthSignParams = any
// eth_signTransaction
/**
 * Based on the JSON-RPC request for `eth_signTransaction` procedure
 * @experimental
 */
export type EthSignTransactionParams = any
// eth_syncing
/**
 * Based on the JSON-RPC request for `eth_syncing` procedure (no params)
 */
export type EthSyncingParams = EmptyParams
// eth_newFilter
/**
 * Based on the JSON-RPC request for `eth_newFilter` procedure
 */
export type EthNewFilterParams = FilterParams
// eth_newBlockFilter
/**
 * Based on the JSON-RPC request for `eth_newBlockFilter` procedure (no params)
 */
export type EthNewBlockFilterParams = EmptyParams
// eth_newPendingTransactionFilter
/**
 * Based on the JSON-RPC request for `eth_newPendingTransactionFilter` procedure
 */
export type EthNewPendingTransactionFilterParams = EmptyParams
// eth_uninstallFilter
/**
 * Based on the JSON-RPC request for `eth_uninstallFilter` procedure
 */
export type EthUninstallFilterParams = { filterId: Hex }

export type EthParams =
	| EthAccountsParams
	| EthAccountsParams
	| EthBlockNumberParams
	| EthCallParams
	| EthChainIdParams
	| EthCoinbaseParams
	| EthEstimateGasParams
	| EthHashrateParams
	| EthGasPriceParams
	| EthGetBalanceParams
	| EthGetBlockByHashParams
	| EthGetBlockByNumberParams
	| EthGetBlockTransactionCountByHashParams
	| EthGetBlockTransactionCountByNumberParams
	| EthGetCodeParams
	| EthGetFilterChangesParams
	| EthGetFilterLogsParams
	| EthGetLogsParams
	| EthGetStorageAtParams
	| EthGetTransactionCountParams
	| EthGetUncleCountByBlockHashParams
	| EthGetUncleCountByBlockNumberParams
	| EthGetTransactionByHashParams
	| EthGetTransactionByBlockHashAndIndexParams
	| EthGetTransactionByBlockNumberAndIndexParams
	| EthGetTransactionReceiptParams
	| EthGetUncleByBlockHashAndIndexParams
	| EthGetUncleByBlockNumberAndIndexParams
	| EthMiningParams
	| EthProtocolVersionParams
	| EthSendRawTransactionParams
	| EthSendTransactionParams
	| EthSignParams
	| EthSignTransactionParams
	| EthSyncingParams
	| EthNewFilterParams
	| EthNewBlockFilterParams
	| EthNewPendingTransactionFilterParams
	| EthUninstallFilterParams
