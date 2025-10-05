import type { CallParams } from '../Call/CallParams.js'
import type {
	Address,
	BlockOverrideSet,
	BlockParam,
	EmptyParams,
	FilterParams,
	Hex,
	StateOverrideSet,
} from '../common/index.js'
import type { EthSimulateV2Params } from './EthSimulateV2Params.js'

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
	readonly from?: Address
	/**
	 * The address to which the transaction is addressed. Defaults to zero address
	 */
	readonly to?: Address
	/**
	 * The integer of gas provided for the transaction execution
	 */
	readonly gas?: bigint
	/**
	 * The integer of gasPrice used for each paid gas
	 */
	readonly gasPrice?: bigint
	/**
	 * The integer of value sent with this transaction
	 */
	readonly value?: bigint
	/**
	 * The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation
	 * Defaults to zero data
	 */
	readonly data?: Hex

	/**
	 * The block number hash or block tag
	 */
	readonly blockTag?: BlockParam
	/**
	 * The state override set to provide different state values while executing the call
	 */
	readonly stateOverrideSet?: StateOverrideSet
	/**
	 * The block override set to provide different block values while executing the call
	 */
	readonly blockOverride?: BlockOverrideSet
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
export type EthGetBalanceParams = { address: Address; blockTag?: BlockParam }
// eth_getBlockByHash
/**
 * Based on the JSON-RPC request for `eth_getBlockByHash` procedure
 */
export type EthGetBlockByHashParams = {
	readonly blockHash: Hex
	readonly fullTransactionObjects: boolean
}
// eth_getBlockByNumber
/**
 * Based on the JSON-RPC request for `eth_getBlockByNumber` procedure
 */
export type EthGetBlockByNumberParams = {
	readonly blockTag?: BlockParam
	readonly fullTransactionObjects: boolean
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
export type EthGetBlockTransactionCountByNumberParams = {
	readonly blockTag?: BlockParam
}
// eth_getCode
/**
 * Based on the JSON-RPC request for `eth_getCode` procedure
 */
export type EthGetCodeParams = { readonly address: Address; readonly blockTag?: BlockParam }
// eth_getFilterChanges
/**
 * Based on the JSON-RPC request for `eth_getFilterChanges` procedure
 */
export type EthGetFilterChangesParams = { readonly filterId: Hex }
// eth_getFilterLogs
/**
 * Based on the JSON-RPC request for `eth_getFilterLogs` procedure
 */
export type EthGetFilterLogsParams = { readonly filterId: Hex }
// eth_getLogs
/**
 * Based on the JSON-RPC request for `eth_getLogs` procedure
 */
export type EthGetLogsParams = { readonly filterParams: FilterParams }
// eth_getStorageAt
/**
 * Based on the JSON-RPC request for `eth_getStorageAt` procedure
 */
export type EthGetStorageAtParams = {
	readonly address: Address
	readonly position: Hex
	readonly blockTag?: BlockParam
}
// eth_getTransactionCount
/**
 * Based on the JSON-RPC request for `eth_getTransactionCount` procedure
 */
export type EthGetTransactionCountParams = {
	readonly address: Address
	readonly blockTag?: BlockParam
}
// eth_getUncleCountByBlockHash
/**
 * Based on the JSON-RPC request for `eth_getUncleCountByBlockHash` procedure
 */
export type EthGetUncleCountByBlockHashParams = { readonly hash: Hex }
// eth_getUncleCountByBlockNumber
/**
 * Based on the JSON-RPC request for `eth_getUncleCountByBlockNumber` procedure
 */
export type EthGetUncleCountByBlockNumberParams = { readonly blockTag?: BlockParam }
// eth_getTransactionByHash
/**
 * Based on the JSON-RPC request for `eth_getTransactionByHash` procedure
 */
export type EthGetTransactionByHashParams = { readonly data: Hex }
// eth_getTransactionByBlockHashAndIndex
/**
 * Based on the JSON-RPC request for `eth_getTransactionByBlockHashAndIndex` procedure
 */
export type EthGetTransactionByBlockHashAndIndexParams = {
	readonly blockTag?: Hex
	readonly index: Hex
}
// eth_getTransactionByBlockNumberAndIndex
/**
 * Based on the JSON-RPC request for `eth_getTransactionByBlockNumberAndIndex` procedure
 */
export type EthGetTransactionByBlockNumberAndIndexParams = {
	readonly blockTag?: BlockParam
	readonly index: Hex
}
// eth_getTransactionReceipt
/**
 * Based on the JSON-RPC request for `eth_getTransactionReceipt` procedure
 */
export type EthGetTransactionReceiptParams = { readonly hash: Hex }
// eth_getUncleByBlockHashAndIndex
/**
 * Based on the JSON-RPC request for `eth_getUncleByBlockHashAndIndex` procedure
 */
export type EthGetUncleByBlockHashAndIndexParams = {
	readonly blockHash: Hex
	readonly uncleIndex: Hex
}
// eth_getUncleByBlockNumberAndIndex
/**
 * Based on the JSON-RPC request for `eth_getUncleByBlockNumberAndIndex` procedure
 */
export type EthGetUncleByBlockNumberAndIndexParams = {
	readonly blockTag?: BlockParam
	readonly uncleIndex: Hex
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
export type EthSendRawTransactionParams = { readonly data: Hex }
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
export type EthSignParams = { readonly address: Address; readonly data: Hex }
// eth_signTransaction
/**
 * Based on the JSON-RPC request for `eth_signTransaction` procedure
 * @experimental
 */
export type EthSignTransactionParams = {
	/**
	 * The address from which the transaction is sent from
	 */
	readonly from: Address
	/**
	 * The address the transaction is directed to. Optional if
	 * creating a contract
	 */
	readonly to?: Address
	/**
	 * The gas provded for transaction execution. It will return unused gas.
	 * Default value is 90000
	 */
	readonly gas?: bigint
	/**
	 * Integer of the gasPrice used for each paid gas, in Wei.
	 * If not provided tevm will default to the eth_gasPrice value
	 */
	readonly gasPrice?: bigint
	/**
	 * Integer of the value sent with this transaction, in Wei.
	 */
	readonly value?: bigint
	/**
	 * The compiled code of a contract OR the hash of the invoked method signature and encoded parameters.
	 * Optional if creating a contract.
	 */
	readonly data?: Hex
	/**
	 * Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.
	 */
	readonly nonce?: bigint
}

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
export type EthUninstallFilterParams = { readonly filterId: Hex }

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
	| EthSimulateV2Params
