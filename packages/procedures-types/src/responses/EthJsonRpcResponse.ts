import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { BlockResult } from '@tevm/actions-types'
import type { FilterLog } from '@tevm/actions-types'
import type { TransactionReceiptResult } from '@tevm/actions-types'
import type { TransactionResult } from '@tevm/actions-types'
import type { EthBlockNumberResult } from '@tevm/actions-types'
import type { JsonRpcResponse } from '@tevm/jsonrpc'
import type { Address, Hex } from '@tevm/utils'

// eth_accounts
/**
 * JSON-RPC response for `eth_accounts` procedure
 */
export type EthAccountsJsonRpcResponse = JsonRpcResponse<
	'eth_accounts',
	Address[],
	string
>

// eth_blockNumber
/**
 * JSON-RPC response for `eth_blockNumber` procedure
 */
export type EthBlockNumberJsonRpcResponse = JsonRpcResponse<
	'eth_blockNumber',
	SerializeToJson<EthBlockNumberResult>,
	string
>

// eth_call
/**
 * JSON-RPC response for `eth_call` procedure
 */
export type EthCallJsonRpcResponse = JsonRpcResponse<'eth_call', Hex, string>

// eth_chainId
/**
 * JSON-RPC response for `eth_chainId` procedure
 */
export type EthChainIdJsonRpcResponse = JsonRpcResponse<
	'eth_chainId',
	Hex,
	string
>

// eth_coinbase
/**
 * JSON-RPC response for `eth_coinbase` procedure
 */
export type EthCoinbaseJsonRpcResponse = JsonRpcResponse<
	'eth_coinbase',
	Hex,
	string
>

// eth_estimateGas
/**
 * JSON-RPC response for `eth_estimateGas` procedure
 */
export type EthEstimateGasJsonRpcResponse = JsonRpcResponse<
	'eth_estimateGas',
	Hex,
	string
>

// eth_hashrate
/**
 * JSON-RPC response for `eth_hashrate` procedure
 */
export type EthHashrateJsonRpcResponse = JsonRpcResponse<
	'eth_hashrate',
	Hex,
	string
>

// eth_gasPrice
/**
 * JSON-RPC response for `eth_gasPrice` procedure
 */
export type EthGasPriceJsonRpcResponse = JsonRpcResponse<
	'eth_gasPrice',
	Hex,
	string
>

// eth_getBalance
/**
 * JSON-RPC response for `eth_getBalance` procedure
 */
export type EthGetBalanceJsonRpcResponse = JsonRpcResponse<
	'eth_getBalance',
	Hex,
	string
>

// eth_getBlockByHash
/**
 * JSON-RPC response for `eth_getBlockByHash` procedure
 */
export type EthGetBlockByHashJsonRpcResponse = JsonRpcResponse<
	'eth_getBlockByHash',
	BlockResult,
	string
>

// eth_getBlockByNumber
/**
 * JSON-RPC response for `eth_getBlockByNumber` procedure
 */
export type EthGetBlockByNumberJsonRpcResponse = JsonRpcResponse<
	'eth_getBlockByNumber',
	BlockResult,
	string
>

// eth_getBlockTransactionCountByHash
/**
 * JSON-RPC response for `eth_getBlockTransactionCountByHash` procedure
 */
export type EthGetBlockTransactionCountByHashJsonRpcResponse = JsonRpcResponse<
	'eth_getBlockTransactionCountByHash',
	Hex,
	string
>

// eth_getBlockTransactionCountByNumber
/**
 * JSON-RPC response for `eth_getBlockTransactionCountByNumber` procedure
 */
export type EthGetBlockTransactionCountByNumberJsonRpcResponse =
	JsonRpcResponse<'eth_getBlockTransactionCountByNumber', Hex, string>

// eth_getCode
/**
 * JSON-RPC response for `eth_getCode` procedure
 */
export type EthGetCodeJsonRpcResponse = JsonRpcResponse<
	'eth_getCode',
	Hex,
	string
>

// eth_getFilterChanges
/**
 * JSON-RPC response for `eth_getFilterChanges` procedure
 */
export type EthGetFilterChangesJsonRpcResponse = JsonRpcResponse<
	'eth_getFilterChanges',
	Array<FilterLog>,
	string
>

// eth_getFilterLogs
/**
 * JSON-RPC response for `eth_getFilterLogs` procedure
 */
export type EthGetFilterLogsJsonRpcResponse = JsonRpcResponse<
	'eth_getFilterLogs',
	Array<FilterLog>,
	string
>

// eth_getLogs
/**
 * JSON-RPC response for `eth_getLogs` procedure
 */
export type EthGetLogsJsonRpcResponse = JsonRpcResponse<
	'eth_getLogs',
	Array<FilterLog>,
	string
>

// eth_getStorageAt
/**
 * JSON-RPC response for `eth_getStorageAt` procedure
 */
export type EthGetStorageAtJsonRpcResponse = JsonRpcResponse<
	'eth_getStorageAt',
	Hex,
	string
>

// eth_getTransactionCount
/**
 * JSON-RPC response for `eth_getTransactionCount` procedure
 */
export type EthGetTransactionCountJsonRpcResponse = JsonRpcResponse<
	'eth_getTransactionCount',
	Hex,
	string
>

// eth_getUncleCountByBlockHash
/**
 * JSON-RPC response for `eth_getUncleCountByBlockHash` procedure
 */
export type EthGetUncleCountByBlockHashJsonRpcResponse = JsonRpcResponse<
	'eth_getUncleCountByBlockHash',
	Hex,
	string
>

// eth_getUncleCountByBlockNumber
/**
 * JSON-RPC response for `eth_getUncleCountByBlockNumber` procedure
 */
export type EthGetUncleCountByBlockNumberJsonRpcResponse = JsonRpcResponse<
	'eth_getUncleCountByBlockNumber',
	Hex,
	string
>

// eth_getTransactionByHash
/**
 * JSON-RPC response for `eth_getTransactionByHash` procedure
 */
export type EthGetTransactionByHashJsonRpcResponse = JsonRpcResponse<
	'eth_getTransactionByHash',
	TransactionResult,
	string
>

// eth_getTransactionByBlockHashAndIndex
/**
 * JSON-RPC response for `eth_getTransactionByBlockHashAndIndex` procedure
 */
export type EthGetTransactionByBlockHashAndIndexJsonRpcResponse =
	JsonRpcResponse<
		'eth_getTransactionByBlockHashAndIndex',
		TransactionResult,
		string
	>

// eth_getTransactionByBlockNumberAndIndex
/**
 * JSON-RPC response for `eth_getTransactionByBlockNumberAndIndex` procedure
 */
export type EthGetTransactionByBlockNumberAndIndexJsonRpcResponse =
	JsonRpcResponse<
		'eth_getTransactionByBlockNumberAndIndex',
		TransactionResult,
		string
	>

// eth_getTransactionReceipt
/**
 * JSON-RPC response for `eth_getTransactionReceipt` procedure
 */
export type EthGetTransactionReceiptJsonRpcResponse = JsonRpcResponse<
	'eth_getTransactionReceipt',
	TransactionReceiptResult,
	string
>

// eth_getUncleByBlockHashAndIndex
/**
 * JSON-RPC response for `eth_getUncleByBlockHashAndIndex` procedure
 */
export type EthGetUncleByBlockHashAndIndexJsonRpcResponse = JsonRpcResponse<
	'eth_getUncleByBlockHashAndIndex',
	Hex,
	string
>

// eth_getUncleByBlockNumberAndIndex
/**
 * JSON-RPC response for `eth_getUncleByBlockNumberAndIndex` procedure
 */
export type EthGetUncleByBlockNumberAndIndexJsonRpcResponse = JsonRpcResponse<
	'eth_getUncleByBlockNumberAndIndex',
	Hex,
	string
>

// eth_mining
/**
 * JSON-RPC response for `eth_mining` procedure
 */
export type EthMiningJsonRpcResponse = JsonRpcResponse<
	'eth_mining',
	boolean,
	string
>

// eth_protocolVersion
/**
 * JSON-RPC response for `eth_protocolVersion` procedure
 */
export type EthProtocolVersionJsonRpcResponse = JsonRpcResponse<
	'eth_protocolVersion',
	Hex,
	string
>

// eth_sendRawTransaction
/**
 * JSON-RPC response for `eth_sendRawTransaction` procedure
 */
export type EthSendRawTransactionJsonRpcResponse = JsonRpcResponse<
	'eth_sendRawTransaction',
	Hex,
	string
>

// eth_sendTransaction
/**
 * JSON-RPC response for `eth_sendTransaction` procedure
 */
export type EthSendTransactionJsonRpcResponse = JsonRpcResponse<
	'eth_sendTransaction',
	Hex,
	string
>

// eth_sign
/**
 * JSON-RPC response for `eth_sign` procedure
 */
export type EthSignJsonRpcResponse = JsonRpcResponse<'eth_sign', Hex, string>

// eth_signTransaction
/**
 * JSON-RPC response for `eth_signTransaction` procedure
 */
export type EthSignTransactionJsonRpcResponse = JsonRpcResponse<
	'eth_signTransaction',
	Hex,
	string
>

// eth_syncing
/**
 * JSON-RPC response for `eth_syncing` procedure
 */
export type EthSyncingJsonRpcResponse = JsonRpcResponse<
	'eth_syncing',
	| boolean
	| {
			startingBlock: Hex
			currentBlock: Hex
			highestBlock: Hex
			// some clients return these
			// geth
			headedBytecodebytes?: Hex
			healedBytecodes?: Hex
			healedTrienodes?: Hex
			healingBytecode?: Hex
			healingTrienodes?: Hex
			syncedBytecodeBytes?: Hex
			syncedBytecodes?: Hex
			syncedStorage?: Hex
			syncedStorageBytes?: Hex
			// besu
			pulledStates: Hex
			knownStates: Hex
	  },
	string
>

// eth_newFilter
/**
 * JSON-RPC response for `eth_newFilter` procedure
 */
export type EthNewFilterJsonRpcResponse = JsonRpcResponse<
	'eth_newFilter',
	Hex,
	string
>

// eth_newBlockFilter
/**
 * JSON-RPC response for `eth_newBlockFilter` procedure
 */
export type EthNewBlockFilterJsonRpcResponse = JsonRpcResponse<
	'eth_newBlockFilter',
	// FilterId
	Hex,
	string
>

// eth_newPendingTransactionFilter
/**
 * JSON-RPC response for `eth_newPendingTransactionFilter` procedure
 */
export type EthNewPendingTransactionFilterJsonRpcResponse = JsonRpcResponse<
	'eth_newPendingTransactionFilter',
	// FilterId
	Hex,
	string
>

// eth_uninstallFilter
/**
 * JSON-RPC response for `eth_uninstallFilter` procedure
 */
export type EthUninstallFilterJsonRpcResponse = JsonRpcResponse<
	'eth_uninstallFilter',
	boolean,
	string
>
