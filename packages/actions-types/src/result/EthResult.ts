/***
 * TODO I didn't update any of these jsdocs
 * TODO some of these types are not deserialized and/or don't match viem types and will
 * need to be updated as t hey are implemented
 */
import type { BlockResult } from '../common/BlockResult.js'
import type { FilterLog } from '../common/FilterLog.js'
import type { TransactionReceiptResult } from '../common/TransactionReceiptResult.js'
import type { TransactionResult } from '../common/TransactionResult.js'
import type { Address, Hex } from '../common/index.js'

// eth_account
export type EthAccountsResult = Array<Address>
// eth_blockNumber
/**
 * JSON-RPC response for `eth_blockNumber` procedure
 */
export type EthBlockNumberResult = bigint

// eth_call
/**
 * JSON-RPC response for `eth_call` procedure
 */
export type EthCallResult = Hex

// eth_chainId
/**
 * JSON-RPC response for `eth_chainId` procedure
 */
export type EthChainIdResult = bigint

// eth_coinbase
/**
 * JSON-RPC response for `eth_coinbase` procedure
 */
export type EthCoinbaseResult = Address

// eth_estimateGas
/**
 * JSON-RPC response for `eth_estimateGas` procedure
 */
export type EthEstimateGasResult = bigint

// eth_hashrate
/**
 * JSON-RPC response for `eth_hashrate` procedure
 */
export type EthHashrateResult = Hex

// eth_gasPrice
/**
 * JSON-RPC response for `eth_gasPrice` procedure
 */
export type EthGasPriceResult = bigint

// eth_getBalance
/**
 * JSON-RPC response for `eth_getBalance` procedure
 */
export type EthGetBalanceResult = bigint

// eth_getBlockByHash
/**
 * JSON-RPC response for `eth_getBlockByHash` procedure
 */
export type EthGetBlockByHashResult = BlockResult

// eth_getBlockByNumber
/**
 * JSON-RPC response for `eth_getBlockByNumber` procedure
 */
export type EthGetBlockByNumberResult = BlockResult
// eth_getBlockTransactionCountByHash
/**
 * JSON-RPC response for `eth_getBlockTransactionCountByHash` procedure
 */
export type EthGetBlockTransactionCountByHashResult = Hex

// eth_getBlockTransactionCountByNumber
/**
 * JSON-RPC response for `eth_getBlockTransactionCountByNumber` procedure
 */
export type EthGetBlockTransactionCountByNumberResult = Hex

// eth_getCode
/**
 * JSON-RPC response for `eth_getCode` procedure
 */
export type EthGetCodeResult = Hex

// eth_getFilterChanges
/**
 * JSON-RPC response for `eth_getFilterChanges` procedure
 */
export type EthGetFilterChangesResult = Array<FilterLog>

// eth_getFilterLogs
/**
 * JSON-RPC response for `eth_getFilterLogs` procedure
 */
export type EthGetFilterLogsResult = Array<FilterLog>

// eth_getLogs
/**
 * JSON-RPC response for `eth_getLogs` procedure
 */
export type EthGetLogsResult = Array<FilterLog>

// eth_getStorageAt
/**
 * JSON-RPC response for `eth_getStorageAt` procedure
 */
export type EthGetStorageAtResult = Hex

// eth_getTransactionCount
/**
 * JSON-RPC response for `eth_getTransactionCount` procedure
 */
export type EthGetTransactionCountResult = Hex

// eth_getUncleCountByBlockHash
/**
 * JSON-RPC response for `eth_getUncleCountByBlockHash` procedure
 */
export type EthGetUncleCountByBlockHashResult = Hex

// eth_getUncleCountByBlockNumber
/**
 * JSON-RPC response for `eth_getUncleCountByBlockNumber` procedure
 */
export type EthGetUncleCountByBlockNumberResult = Hex

// eth_getTransactionByHash
/**
 * JSON-RPC response for `eth_getTransactionByHash` procedure
 */
export type EthGetTransactionByHashResult = TransactionResult

// eth_getTransactionByBlockHashAndIndex
/**
 * JSON-RPC response for `eth_getTransactionByBlockHashAndIndex` procedure
 */
export type EthGetTransactionByBlockHashAndIndexResult = TransactionResult

// eth_getTransactionByBlockNumberAndIndex
/**
 * JSON-RPC response for `eth_getTransactionByBlockNumberAndIndex` procedure
 */
export type EthGetTransactionByBlockNumberAndIndexResult = TransactionResult

// eth_getTransactionReceipt
/**
 * JSON-RPC response for `eth_getTransactionReceipt` procedure
 */
export type EthGetTransactionReceiptResult = TransactionReceiptResult

// eth_getUncleByBlockHashAndIndex
/**
 * JSON-RPC response for `eth_getUncleByBlockHashAndIndex` procedure
 */
export type EthGetUncleByBlockHashAndIndexResult = Hex

// eth_getUncleByBlockNumberAndIndex
/**
 * JSON-RPC response for `eth_getUncleByBlockNumberAndIndex` procedure
 */
export type EthGetUncleByBlockNumberAndIndexResult = Hex

// eth_mining
/**
 * JSON-RPC response for `eth_mining` procedure
 */
export type EthMiningResult = boolean

// eth_protocolVersion
/**
 * JSON-RPC response for `eth_protocolVersion` procedure
 */
export type EthProtocolVersionResult = Hex

// eth_sendRawTransaction
/**
 * JSON-RPC response for `eth_sendRawTransaction` procedure
 */
export type EthSendRawTransactionResult = Hex

// eth_sendTransaction
/**
 * JSON-RPC response for `eth_sendTransaction` procedure
 */
export type EthSendTransactionResult = Hex

// eth_sign
/**
 * JSON-RPC response for `eth_sign` procedure
 */
export type EthSignResult = Hex

// eth_signTransaction
/**
 * JSON-RPC response for `eth_signTransaction` procedure
 */
export type EthSignTransactionResult = Hex

// eth_syncing
/**
 * JSON-RPC response for `eth_syncing` procedure
 */
export type EthSyncingResult =
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
	  }

// eth_newFilter
/**
 * JSON-RPC response for `eth_newFilter` procedure
 */
export type EthNewFilterResult = Hex

// eth_newBlockFilter
/**
 * JSON-RPC response for `eth_newBlockFilter` procedure
 */
export type EthNewBlockFilterResult = Hex

// eth_newPendingTransactionFilter
/**
 * JSON-RPC response for `eth_newPendingTransactionFilter` procedure
 */
export type EthNewPendingTransactionFilterResult = Hex

// eth_uninstallFilter
/**
 * JSON-RPC response for `eth_uninstallFilter` procedure
 */
export type EthUninstallFilterResult = boolean
