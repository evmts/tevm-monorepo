import type { JsonRpcRequest } from '@tevm/jsonrpc'
import type { Address, BlockTag, Hex } from '@tevm/utils'
import type { BaseCallParams } from '../BaseCall/BaseCallParams.js'
import type { FilterParams } from '../common/FilterParams.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'

/**
 * the transaction call object for methods like `eth_call`
 */
export type JsonRpcTransaction = {
	/**
	 * The address from which the transaction is sent
	 */
	from?: Address
	/**
	 * The address to which the transaction is addressed
	 */
	to?: Address
	/**
	 * The integer of gas provided for the transaction execution
	 */
	gas?: Hex
	/**
	 * The integer of gasPrice used for each paid gas encoded as hexadecimal
	 */
	gasPrice?: Hex
	/**
	 * The integer of value sent with this transaction encoded as hexadecimal
	 */
	value?: Hex
	/**
	 * The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation
	 */
	data?: Hex
	/**
	 * The integer of the nonce. If not provided a nonce will automatically be generated
	 */
	nonce?: Hex
}

// eth_accounts
/**
 * JSON-RPC request for `eth_accounts` procedure
 */
export type EthAccountsJsonRpcRequest = JsonRpcRequest<'eth_accounts', readonly []>
// eth_blobBaseFee
/**
 * JSON-RPC request for `eth_blobBaseFee` procedure
 */
export type EthBlobBaseFeeJsonRpcRequest = JsonRpcRequest<'eth_blobBaseFee', readonly []>
// eth_blockNumber
/**
 * JSON-RPC request for `eth_blockNumber` procedure
 */
export type EthBlockNumberJsonRpcRequest = JsonRpcRequest<'eth_blockNumber', readonly []>
// eth_call
/**
 * JSON-RPC request for `eth_call` procedure
 */
export type EthCallJsonRpcRequest = JsonRpcRequest<
	'eth_call',
	readonly [
		tx: JsonRpcTransaction,
		tag: BlockTag | Hex,
		stateOverrideSet?: SerializeToJson<BaseCallParams['stateOverrideSet']>,
		blockOverrideSet?: SerializeToJson<BaseCallParams['blockOverrideSet']>,
	]
>
// eth_chainId
/**
 * JSON-RPC request for `eth_chainId` procedure
 */
export type EthChainIdJsonRpcRequest = JsonRpcRequest<'eth_chainId', readonly []>
// eth_coinbase
/**
 * JSON-RPC request for `eth_coinbase` procedure
 */
export type EthCoinbaseJsonRpcRequest = JsonRpcRequest<'eth_coinbase', readonly []>
// eth_estimateGas
/**
 * JSON-RPC request for `eth_estimateGas` procedure
 */
export type EthEstimateGasJsonRpcRequest = JsonRpcRequest<
	'eth_estimateGas',
	readonly [
		tx: JsonRpcTransaction,
		tag?: BlockTag | Hex,
		stateOverrideSet?: SerializeToJson<BaseCallParams['stateOverrideSet']>,
		blockOverrideSet?: SerializeToJson<BaseCallParams['blockOverrideSet']>,
	]
>
// eth_hashrate
/**
 * JSON-RPC request for `eth_hashrate` procedure
 */
export type EthHashrateJsonRpcRequest = JsonRpcRequest<'eth_hashrate', readonly []>
// eth_gasPrice
/**
 * JSON-RPC request for `eth_gasPrice` procedure
 */
export type EthGasPriceJsonRpcRequest = JsonRpcRequest<'eth_gasPrice', readonly []>
// eth_maxPriorityFeePerGas
/**
 * JSON-RPC request for `eth_maxPriorityFeePerGas` procedure
 */
export type EthMaxPriorityFeePerGasJsonRpcRequest = JsonRpcRequest<'eth_maxPriorityFeePerGas', readonly []>
// eth_feeHistory
/**
 * JSON-RPC request for `eth_feeHistory` procedure
 */
export type EthFeeHistoryJsonRpcRequest = JsonRpcRequest<
	'eth_feeHistory',
	readonly [blockCount: Hex, newestBlock: BlockTag | Hex, rewardPercentiles?: readonly number[]]
>
// eth_getBalance
/**
 * JSON-RPC request for `eth_getBalance` procedure
 */
export type EthGetBalanceJsonRpcRequest = JsonRpcRequest<'eth_getBalance', [address: Address, tag: BlockTag | Hex]>
// eth_getBlockByHash
/**
 * JSON-RPC request for `eth_getBlockByHash` procedure
 */
export type EthGetBlockByHashJsonRpcRequest = JsonRpcRequest<
	'eth_getBlockByHash',
	readonly [blockHash: Hex, fullTransactionObjects: boolean]
>
// eth_getBlockByNumber
/**
 * JSON-RPC request for `eth_getBlockByNumber` procedure
 */
export type EthGetBlockByNumberJsonRpcRequest = JsonRpcRequest<
	'eth_getBlockByNumber',
	readonly [tag: BlockTag | Hex, fullTransactionObjects: boolean]
>
// eth_getBlockTransactionCountByHash
/**
 * JSON-RPC request for `eth_getBlockTransactionCountByHash` procedure
 */
export type EthGetBlockTransactionCountByHashJsonRpcRequest = JsonRpcRequest<
	'eth_getBlockTransactionCountByHash',
	readonly [hash: Hex]
>
// eth_getBlockTransactionCountByNumber
/**
 * JSON-RPC request for `eth_getBlockTransactionCountByNumber` procedure
 */
export type EthGetBlockTransactionCountByNumberJsonRpcRequest = JsonRpcRequest<
	'eth_getBlockTransactionCountByNumber',
	readonly [tag: BlockTag | Hex]
>
// eth_getCode
/**
 * JSON-RPC request for `eth_getCode` procedure
 */
export type EthGetCodeJsonRpcRequest = JsonRpcRequest<'eth_getCode', readonly [address: Address, tag: BlockTag | Hex]>
// eth_getFilterChanges
/**
 * JSON-RPC request for `eth_getFilterChanges` procedure
 */
export type EthGetFilterChangesJsonRpcRequest = JsonRpcRequest<'eth_getFilterChanges', [filterId: Hex]>
// eth_getFilterLogs
/**
 * JSON-RPC request for `eth_getFilterLogs` procedure
 */
export type EthGetFilterLogsJsonRpcRequest = JsonRpcRequest<'eth_getFilterLogs', [filterId: Hex]>
// eth_getLogs
/**
 * JSON-RPC request for `eth_getLogs` procedure
 */
export type EthGetLogsJsonRpcRequest = JsonRpcRequest<'eth_getLogs', [filterParams: FilterParams]>
// eth_getStorageAt
/**
 * JSON-RPC request for `eth_getStorageAt` procedure
 */
export type EthGetStorageAtJsonRpcRequest = JsonRpcRequest<
	'eth_getStorageAt',
	readonly [address: Address, position: Hex, tag: BlockTag | Hex]
>
// eth_getTransactionCount
/**
 * JSON-RPC request for `eth_getTransactionCount` procedure
 */
export type EthGetTransactionCountJsonRpcRequest = JsonRpcRequest<
	'eth_getTransactionCount',
	readonly [address: Address, tag: BlockTag | Hex]
>
// eth_getUncleCountByBlockHash
/**
 * JSON-RPC request for `eth_getUncleCountByBlockHash` procedure
 */
export type EthGetUncleCountByBlockHashJsonRpcRequest = JsonRpcRequest<
	'eth_getUncleCountByBlockHash',
	readonly [hash: Hex]
>
// eth_getUncleCountByBlockNumber
/**
 * JSON-RPC request for `eth_getUncleCountByBlockNumber` procedure
 */
export type EthGetUncleCountByBlockNumberJsonRpcRequest = JsonRpcRequest<
	'eth_getUncleCountByBlockNumber',
	readonly [tag: BlockTag | Hex]
>
// eth_getTransactionByHash
/**
 * JSON-RPC request for `eth_getTransactionByHash` procedure
 */
export type EthGetTransactionByHashJsonRpcRequest = JsonRpcRequest<'eth_getTransactionByHash', readonly [data: Hex]>
// eth_getTransactionByBlockHashAndIndex
/**
 * JSON-RPC request for `eth_getTransactionByBlockHashAndIndex` procedure
 */
export type EthGetTransactionByBlockHashAndIndexJsonRpcRequest = JsonRpcRequest<
	'eth_getTransactionByBlockHashAndIndex',
	readonly [tag: Hex, index: Hex]
>
// eth_getTransactionByBlockNumberAndIndex
/**
 * JSON-RPC request for `eth_getTransactionByBlockNumberAndIndex` procedure
 */
export type EthGetTransactionByBlockNumberAndIndexJsonRpcRequest = JsonRpcRequest<
	'eth_getTransactionByBlockNumberAndIndex',
	readonly [tag: BlockTag | Hex, index: Hex]
>
// eth_getTransactionReceipt
/**
 * JSON-RPC request for `eth_getTransactionReceipt` procedure
 */
export type EthGetTransactionReceiptJsonRpcRequest = JsonRpcRequest<'eth_getTransactionReceipt', readonly [txHash: Hex]>
// eth_getBlockReceipts
/**
 * JSON-RPC request for `eth_getBlockReceipts` procedure
 */
export type EthGetBlockReceiptsJsonRpcRequest = JsonRpcRequest<
	'eth_getBlockReceipts',
	readonly [blockId: BlockTag | Hex]
>
// eth_getUncleByBlockHashAndIndex
/**
 * JSON-RPC request for `eth_getUncleByBlockHashAndIndex` procedure
 */
export type EthGetUncleByBlockHashAndIndexJsonRpcRequest = JsonRpcRequest<
	'eth_getUncleByBlockHashAndIndex',
	readonly [blockHash: Hex, uncleIndex: Hex]
>
// eth_getUncleByBlockNumberAndIndex
/**
 * JSON-RPC request for `eth_getUncleByBlockNumberAndIndex` procedure
 */
export type EthGetUncleByBlockNumberAndIndexJsonRpcRequest = JsonRpcRequest<
	'eth_getUncleByBlockNumberAndIndex',
	readonly [tag: BlockTag | Hex, uncleIndex: Hex]
>
// eth_mining
/**
 * JSON-RPC request for `eth_mining` procedure
 */
export type EthMiningJsonRpcRequest = JsonRpcRequest<'eth_mining', readonly []>
// eth_protocolVersion
/**
 * JSON-RPC request for `eth_protocolVersion` procedure
 */
export type EthProtocolVersionJsonRpcRequest = JsonRpcRequest<'eth_protocolVersion', readonly []>
// eth_sendRawTransaction
/**
 * JSON-RPC request for `eth_sendRawTransaction` procedure
 */
export type EthSendRawTransactionJsonRpcRequest = JsonRpcRequest<'eth_sendRawTransaction', [data: Hex]>
// eth_sendTransaction
/**
 * JSON-RPC request for `eth_sendTransaction` procedure
 */
export type EthSendTransactionJsonRpcRequest = JsonRpcRequest<'eth_sendTransaction', readonly [tx: JsonRpcTransaction]>
// eth_sign
/**
 * JSON-RPC request for `eth_sign` procedure
 */
export type EthSignJsonRpcRequest = JsonRpcRequest<'eth_sign', readonly [address: Address, message: Hex]>
// eth_signTransaction
/**
 * JSON-RPC request for `eth_signTransaction` procedure
 */
export type EthSignTransactionJsonRpcRequest = JsonRpcRequest<
	'eth_signTransaction',
	readonly [
		{
			from: Address
			to?: Address
			gas?: Hex
			gasPrice?: Hex
			value?: Hex
			data?: Hex
			nonce?: Hex
			chainId?: Hex
		},
	]
>
// eth_syncing
/**
 * JSON-RPC request for `eth_syncing` procedure
 */
export type EthSyncingJsonRpcRequest = JsonRpcRequest<'eth_syncing', readonly []>
// eth_newFilter
/**
 * JSON-RPC request for `eth_newFilter` procedure
 */
export type EthNewFilterJsonRpcRequest = JsonRpcRequest<'eth_newFilter', readonly [SerializeToJson<FilterParams>]>
// eth_newBlockFilter
/**
 * JSON-RPC request for `eth_newBlockFilter` procedure
 */
export type EthNewBlockFilterJsonRpcRequest = JsonRpcRequest<'eth_newBlockFilter', readonly []>
// eth_newPendingTransactionFilter
/**
 * JSON-RPC request for `eth_newPendingTransactionFilter` procedure
 */
export type EthNewPendingTransactionFilterJsonRpcRequest = JsonRpcRequest<
	'eth_newPendingTransactionFilter',
	readonly []
>
// eth_uninstallFilter
/**
 * JSON-RPC request for `eth_uninstallFilter` procedure
 */
export type EthUninstallFilterJsonRpcRequest = JsonRpcRequest<'eth_uninstallFilter', readonly [filterId: Hex]>
// eth_subscribe
/**
 * JSON-RPC request for `eth_subscribe` procedure
 */
export type EthSubscribeJsonRpcRequest = JsonRpcRequest<
	'eth_subscribe',
	readonly [
		subscriptionType: 'newHeads' | 'logs' | 'newPendingTransactions' | 'syncing',
		filterParams?: SerializeToJson<{ address?: Address | Address[]; topics?: (Hex | Hex[] | null)[] }>,
	]
>
// eth_unsubscribe
/**
 * JSON-RPC request for `eth_unsubscribe` procedure
 */
export type EthUnsubscribeJsonRpcRequest = JsonRpcRequest<'eth_unsubscribe', readonly [subscriptionId: Hex]>
// eth_createAccessList
/**
 * JSON-RPC request for `eth_createAccessList` procedure
 */
export type EthCreateAccessListJsonRpcRequest = JsonRpcRequest<
	'eth_createAccessList',
	readonly [tx: JsonRpcTransaction, tag?: BlockTag | Hex]
>
// eth_getProof
/**
 * JSON-RPC request for `eth_getProof` procedure (EIP-1186)
 */
export type EthGetProofJsonRpcRequest = JsonRpcRequest<
	'eth_getProof',
	readonly [address: Address, storageKeys: readonly Hex[], tag: BlockTag | Hex]
>
// eth_simulateV1
/**
 * JSON-RPC transaction for simulateV1
 */
export type JsonRpcSimulateTransaction = JsonRpcTransaction & {
	maxFeePerGas?: Hex
	maxPriorityFeePerGas?: Hex
}
/**
 * State override for simulateV1
 */
export type JsonRpcStateOverride = {
	[address: Address]: {
		balance?: Hex
		nonce?: Hex
		code?: Hex
		state?: Record<Hex, Hex>
		stateDiff?: Record<Hex, Hex>
	}
}
/**
 * Block override for simulateV1
 */
export type JsonRpcBlockOverride = {
	number?: Hex
	time?: Hex
	gasLimit?: Hex
	feeRecipient?: Address
	prevRandao?: Hex
	baseFeePerGas?: Hex
	blobBaseFee?: Hex
}
/**
 * A block of calls for simulateV1
 */
export type JsonRpcBlockStateCall = {
	blockOverrides?: JsonRpcBlockOverride
	stateOverrides?: JsonRpcStateOverride
	calls?: JsonRpcSimulateTransaction[]
}
/**
 * JSON-RPC request for `eth_simulateV1` procedure
 */
export type EthSimulateV1JsonRpcRequest = JsonRpcRequest<
	'eth_simulateV1',
	readonly [
		opts: {
			blockStateCalls: JsonRpcBlockStateCall[]
			traceTransfers?: boolean
			validation?: boolean
			returnFullTransactions?: boolean
		},
		blockTag?: BlockTag | Hex,
	]
>

// eth_simulateV2
/**
 * JSON-RPC transaction for simulateV2 (extends V1 with estimateGas option)
 */
export type JsonRpcSimulateV2Transaction = JsonRpcSimulateTransaction & {
	estimateGas?: boolean
}
/**
 * A block of calls for simulateV2 (uses V2 transactions)
 */
export type JsonRpcBlockStateCallV2 = {
	blockOverrides?: JsonRpcBlockOverride
	stateOverrides?: JsonRpcStateOverride
	calls?: JsonRpcSimulateV2Transaction[]
}
/**
 * JSON-RPC request for `eth_simulateV2` procedure
 * Extends V1 with additional options for contract creation detection and call tracing
 */
export type EthSimulateV2JsonRpcRequest = JsonRpcRequest<
	'eth_simulateV2',
	readonly [
		opts: {
			blockStateCalls: JsonRpcBlockStateCallV2[]
			traceTransfers?: boolean
			validation?: boolean
			returnFullTransactions?: boolean
			/** V2: Include contract creation events in logs */
			includeContractCreationEvents?: boolean
			/** V2: Include call traces for debugging */
			includeCallTraces?: boolean
		},
		blockTag?: BlockTag | Hex,
	]
>

export type EthJsonRpcRequest =
	| EthAccountsJsonRpcRequest
	| EthAccountsJsonRpcRequest
	| EthBlobBaseFeeJsonRpcRequest
	| EthBlockNumberJsonRpcRequest
	| EthCallJsonRpcRequest
	| EthChainIdJsonRpcRequest
	| EthCoinbaseJsonRpcRequest
	| EthEstimateGasJsonRpcRequest
	| EthHashrateJsonRpcRequest
	| EthGasPriceJsonRpcRequest
	| EthMaxPriorityFeePerGasJsonRpcRequest
	| EthFeeHistoryJsonRpcRequest
	| EthGetBalanceJsonRpcRequest
	| EthGetBlockByHashJsonRpcRequest
	| EthGetBlockByNumberJsonRpcRequest
	| EthGetBlockTransactionCountByHashJsonRpcRequest
	| EthGetBlockTransactionCountByNumberJsonRpcRequest
	| EthGetCodeJsonRpcRequest
	| EthGetFilterChangesJsonRpcRequest
	| EthGetFilterLogsJsonRpcRequest
	| EthGetLogsJsonRpcRequest
	| EthGetStorageAtJsonRpcRequest
	| EthGetTransactionCountJsonRpcRequest
	| EthGetUncleCountByBlockHashJsonRpcRequest
	| EthGetUncleCountByBlockNumberJsonRpcRequest
	| EthGetTransactionByHashJsonRpcRequest
	| EthGetTransactionByBlockHashAndIndexJsonRpcRequest
	| EthGetTransactionByBlockNumberAndIndexJsonRpcRequest
	| EthGetTransactionReceiptJsonRpcRequest
	| EthGetBlockReceiptsJsonRpcRequest
	| EthGetUncleByBlockHashAndIndexJsonRpcRequest
	| EthGetUncleByBlockNumberAndIndexJsonRpcRequest
	| EthMiningJsonRpcRequest
	| EthProtocolVersionJsonRpcRequest
	| EthSendRawTransactionJsonRpcRequest
	| EthSendTransactionJsonRpcRequest
	| EthSignJsonRpcRequest
	| EthSignTransactionJsonRpcRequest
	| EthSyncingJsonRpcRequest
	| EthNewFilterJsonRpcRequest
	| EthNewBlockFilterJsonRpcRequest
	| EthNewPendingTransactionFilterJsonRpcRequest
	| EthUninstallFilterJsonRpcRequest
	| EthSubscribeJsonRpcRequest
	| EthUnsubscribeJsonRpcRequest
	| EthCreateAccessListJsonRpcRequest
	| EthGetProofJsonRpcRequest
	| EthSimulateV1JsonRpcRequest
	| EthSimulateV2JsonRpcRequest
