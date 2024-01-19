import type {
	AnvilDropTransactionJsonRpcResponse,
	AnvilDumpStateJsonRpcResponse,
	AnvilGetAutomineJsonRpcResponse,
	AnvilImpersonateAccountJsonRpcResponse,
	AnvilLoadStateJsonRpcResponse,
	AnvilMineJsonRpcResponse,
	AnvilResetJsonRpcResponse,
	AnvilSetBalanceJsonRpcResponse,
	AnvilSetChainIdJsonRpcResponse,
	AnvilSetCodeJsonRpcResponse,
	AnvilSetNonceJsonRpcResponse,
	AnvilSetStorageAtJsonRpcResponse,
	AnvilStopImpersonatingAccountJsonRpcResponse,
	CallJsonRpcResponse,
	DebugTraceCallJsonRpcResponse,
	DebugTraceTransactionJsonRpcResponse,
	EthAccountsJsonRpcResponse,
	EthBlockNumberJsonRpcResponse,
	EthCallJsonRpcResponse,
	EthChainIdJsonRpcResponse,
	EthCoinbaseJsonRpcResponse,
	EthEstimateGasJsonRpcResponse,
	EthGasPriceJsonRpcResponse,
	EthGetBalanceJsonRpcResponse,
	EthGetBlockByHashJsonRpcResponse,
	EthGetBlockByNumberJsonRpcResponse,
	EthGetBlockTransactionCountByHashJsonRpcResponse,
	EthGetBlockTransactionCountByNumberJsonRpcResponse,
	EthGetCodeJsonRpcResponse,
	EthGetFilterChangesJsonRpcResponse,
	EthGetFilterLogsJsonRpcResponse,
	EthGetLogsJsonRpcResponse,
	EthGetStorageAtJsonRpcResponse,
	EthGetTransactionByBlockHashAndIndexJsonRpcResponse,
	EthGetTransactionByBlockNumberAndIndexJsonRpcResponse,
	EthGetTransactionByHashJsonRpcResponse,
	EthGetTransactionCountJsonRpcResponse,
	EthGetTransactionReceiptJsonRpcResponse,
	EthGetUncleByBlockHashAndIndexJsonRpcResponse,
	EthGetUncleByBlockNumberAndIndexJsonRpcResponse,
	EthGetUncleCountByBlockHashJsonRpcResponse,
	EthGetUncleCountByBlockNumberJsonRpcResponse,
	EthHashrateJsonRpcResponse,
	EthMiningJsonRpcResponse,
	EthNewBlockFilterJsonRpcResponse,
	EthNewFilterJsonRpcResponse,
	EthNewPendingTransactionFilterJsonRpcResponse,
	EthProtocolVersionJsonRpcResponse,
	EthSendRawTransactionJsonRpcResponse,
	EthSendTransactionJsonRpcResponse,
	EthSignJsonRpcResponse,
	EthSignTransactionJsonRpcResponse,
	EthSyncingJsonRpcResponse,
	EthUninstallFilterJsonRpcResponse,
	GetAccountJsonRpcResponse,
	ScriptJsonRpcResponse,
	SetAccountJsonRpcResponse,
	TevmJsonRpcRequest,
} from './index.js'
import type { EthJsonRpcRequest } from './requests/EthJsonRpcRequest.js'
import type {
	AnvilDropTransactionJsonRpcRequest,
	AnvilDumpStateJsonRpcRequest,
	AnvilGetAutomineJsonRpcRequest,
	AnvilImpersonateAccountJsonRpcRequest,
	AnvilJsonRpcRequest,
	AnvilLoadStateJsonRpcRequest,
	AnvilMineJsonRpcRequest,
	AnvilResetJsonRpcRequest,
	AnvilSetBalanceJsonRpcRequest,
	AnvilSetChainIdJsonRpcRequest,
	AnvilSetCodeJsonRpcRequest,
	AnvilSetNonceJsonRpcRequest,
	AnvilSetStorageAtJsonRpcRequest,
	AnvilStopImpersonatingAccountJsonRpcRequest,
	DebugJsonRpcRequest,
	DebugTraceCallJsonRpcRequest,
	DebugTraceTransactionJsonRpcRequest,
	EthAccountsJsonRpcRequest,
	EthBlockNumberJsonRpcRequest,
	EthCallJsonRpcRequest,
	EthChainIdJsonRpcRequest,
	EthCoinbaseJsonRpcRequest,
	EthEstimateGasJsonRpcRequest,
	EthGasPriceJsonRpcRequest,
	EthGetBalanceJsonRpcRequest,
	EthGetBlockByHashJsonRpcRequest,
	EthGetBlockByNumberJsonRpcRequest,
	EthGetBlockTransactionCountByHashJsonRpcRequest,
	EthGetBlockTransactionCountByNumberJsonRpcRequest,
	EthGetCodeJsonRpcRequest,
	EthGetFilterChangesJsonRpcRequest,
	EthGetFilterLogsJsonRpcRequest,
	EthGetLogsJsonRpcRequest,
	EthGetStorageAtJsonRpcRequest,
	EthGetTransactionByBlockHashAndIndexJsonRpcRequest,
	EthGetTransactionByBlockNumberAndIndexJsonRpcRequest,
	EthGetTransactionByHashJsonRpcRequest,
	EthGetTransactionCountJsonRpcRequest,
	EthGetTransactionReceiptJsonRpcRequest,
	EthGetUncleByBlockHashAndIndexJsonRpcRequest,
	EthGetUncleByBlockNumberAndIndexJsonRpcRequest,
	EthGetUncleCountByBlockHashJsonRpcRequest,
	EthGetUncleCountByBlockNumberJsonRpcRequest,
	EthHashrateJsonRpcRequest,
	EthMiningJsonRpcRequest,
	EthNewBlockFilterJsonRpcRequest,
	EthNewFilterJsonRpcRequest,
	EthNewPendingTransactionFilterJsonRpcRequest,
	EthProtocolVersionJsonRpcRequest,
	EthSendRawTransactionJsonRpcRequest,
	EthSendTransactionJsonRpcRequest,
	EthSignJsonRpcRequest,
	EthSignTransactionJsonRpcRequest,
	EthSyncingJsonRpcRequest,
	EthUninstallFilterJsonRpcRequest,
} from './requests/index.js'

type DebugReturnType = {
	debug_traceTransaction: DebugTraceTransactionJsonRpcResponse
	debug_traceCall: DebugTraceCallJsonRpcResponse
}

type DebugRequestType = {
	debug_traceTransaction: DebugTraceTransactionJsonRpcRequest
	debug_traceCall: DebugTraceCallJsonRpcRequest
}

type AnvilReturnType = {
	anvil_impersonateAccount: AnvilImpersonateAccountJsonRpcResponse
	anvil_stopImpersonatingAccount: AnvilStopImpersonatingAccountJsonRpcResponse
	// anvil_autoImpersonateAccount: AnvilAutoImpersonateAccountJsonRpcResponse,
	anvil_getAutomine: AnvilGetAutomineJsonRpcResponse
	anvil_mine: AnvilMineJsonRpcResponse
	anvil_reset: AnvilResetJsonRpcResponse
	anvil_dropTransaction: AnvilDropTransactionJsonRpcResponse
	anvil_setBalance: AnvilSetBalanceJsonRpcResponse
	anvil_setCode: AnvilSetCodeJsonRpcResponse
	anvil_setNonce: AnvilSetNonceJsonRpcResponse
	anvil_setStorageAt: AnvilSetStorageAtJsonRpcResponse
	anvil_setChainId: AnvilSetChainIdJsonRpcResponse
	anvil_dumpState: AnvilDumpStateJsonRpcResponse
	anvil_loadState: AnvilLoadStateJsonRpcResponse
}

type AnvilRequestType = {
	anvil_impersonateAccount: AnvilImpersonateAccountJsonRpcRequest
	anvil_stopImpersonatingAccount: AnvilStopImpersonatingAccountJsonRpcRequest
	// anvil_autoImpersonateAccount: AnviAnvilImpersonateAccountJsonRpcRequest,
	anvil_getAutomine: AnvilGetAutomineJsonRpcRequest
	anvil_mine: AnvilMineJsonRpcRequest
	anvil_reset: AnvilResetJsonRpcRequest
	anvil_dropTransaction: AnvilDropTransactionJsonRpcRequest
	anvil_setBalance: AnvilSetBalanceJsonRpcRequest
	anvil_setCode: AnvilSetCodeJsonRpcRequest
	anvil_setNonce: AnvilSetNonceJsonRpcRequest
	anvil_setStorageAt: AnvilSetStorageAtJsonRpcRequest
	anvil_setChainId: AnvilSetChainIdJsonRpcRequest
	anvil_dumpState: AnvilDumpStateJsonRpcRequest
	anvil_loadState: AnvilLoadStateJsonRpcRequest
}

type EthReturnType = {
	eth_call: EthCallJsonRpcResponse
	eth_gasPrice: EthGasPriceJsonRpcResponse
	eth_sign: EthSignJsonRpcResponse
	eth_newBlockFilter: EthNewBlockFilterJsonRpcResponse
	eth_mining: EthMiningJsonRpcResponse
	eth_chainId: EthChainIdJsonRpcResponse
	eth_getCode: EthGetCodeJsonRpcResponse
	eth_getLogs: EthGetLogsJsonRpcResponse
	eth_syncing: EthSyncingJsonRpcResponse
	eth_accounts: EthAccountsJsonRpcResponse
	eth_coinbase: EthCoinbaseJsonRpcResponse
	eth_hashrate: EthHashrateJsonRpcResponse
	eth_newFilter: EthNewFilterJsonRpcResponse
	eth_getBalance: EthGetBalanceJsonRpcResponse
	eth_blockNumber: EthBlockNumberJsonRpcResponse
	eth_estimateGas: EthEstimateGasJsonRpcResponse
	eth_getStorageAt: EthGetStorageAtJsonRpcResponse
	eth_getFilterLogs: EthGetFilterLogsJsonRpcResponse
	eth_getBlockByHash: EthGetBlockByHashJsonRpcResponse
	eth_protocolVersion: EthProtocolVersionJsonRpcResponse
	eth_sendTransaction: EthSendTransactionJsonRpcResponse
	eth_signTransaction: EthSignTransactionJsonRpcResponse
	eth_uninstallFilter: EthUninstallFilterJsonRpcResponse
	eth_getBlockByNumber: EthGetBlockByNumberJsonRpcResponse
	eth_getFilterChanges: EthGetFilterChangesJsonRpcResponse
	eth_sendRawTransaction: EthSendRawTransactionJsonRpcResponse
	eth_getTransactionCount: EthGetTransactionCountJsonRpcResponse
	eth_getTransactionByHash: EthGetTransactionByHashJsonRpcResponse
	eth_getTransactionReceipt: EthGetTransactionReceiptJsonRpcResponse
	eth_getUncleCountByBlockHash: EthGetUncleCountByBlockHashJsonRpcResponse
	eth_getUncleCountByBlockNumber: EthGetUncleCountByBlockNumberJsonRpcResponse
	eth_getUncleByBlockHashAndIndex: EthGetUncleByBlockHashAndIndexJsonRpcResponse
	eth_newPendingTransactionFilter: EthNewPendingTransactionFilterJsonRpcResponse
	eth_getUncleByBlockNumberAndIndex: EthGetUncleByBlockNumberAndIndexJsonRpcResponse
	eth_getBlockTransactionCountByHash: EthGetBlockTransactionCountByHashJsonRpcResponse
	eth_getBlockTransactionCountByNumber: EthGetBlockTransactionCountByNumberJsonRpcResponse
	eth_getTransactionByBlockHashAndIndex: EthGetTransactionByBlockHashAndIndexJsonRpcResponse
	eth_getTransactionByBlockNumberAndIndex: EthGetTransactionByBlockNumberAndIndexJsonRpcResponse
}

type EthRequestType = {
	eth_call: EthCallJsonRpcRequest
	eth_gasPrice: EthGasPriceJsonRpcRequest
	eth_sign: EthSignJsonRpcRequest
	eth_newBlockFilter: EthNewBlockFilterJsonRpcRequest
	eth_mining: EthMiningJsonRpcRequest
	eth_chainId: EthChainIdJsonRpcRequest
	eth_getCode: EthGetCodeJsonRpcRequest
	eth_getLogs: EthGetLogsJsonRpcRequest
	eth_syncing: EthSyncingJsonRpcRequest
	eth_accounts: EthAccountsJsonRpcRequest
	eth_coinbase: EthCoinbaseJsonRpcRequest
	eth_hashrate: EthHashrateJsonRpcRequest
	eth_newFilter: EthNewFilterJsonRpcRequest
	eth_getBalance: EthGetBalanceJsonRpcRequest
	eth_blockNumber: EthBlockNumberJsonRpcRequest
	eth_estimateGas: EthEstimateGasJsonRpcRequest
	eth_getStorageAt: EthGetStorageAtJsonRpcRequest
	eth_getFilterLogs: EthGetFilterLogsJsonRpcRequest
	eth_getBlockByHash: EthGetBlockByHashJsonRpcRequest
	eth_protocolVersion: EthProtocolVersionJsonRpcRequest
	eth_sendTransaction: EthSendTransactionJsonRpcRequest
	eth_signTransaction: EthSignTransactionJsonRpcRequest
	eth_uninstallFilter: EthUninstallFilterJsonRpcRequest
	eth_getBlockByNumber: EthGetBlockByNumberJsonRpcRequest
	eth_getFilterChanges: EthGetFilterChangesJsonRpcRequest
	eth_sendRawTransaction: EthSendRawTransactionJsonRpcRequest
	eth_getTransactionCount: EthGetTransactionCountJsonRpcRequest
	eth_getTransactionByHash: EthGetTransactionByHashJsonRpcRequest
	eth_getTransactionReceipt: EthGetTransactionReceiptJsonRpcRequest
	eth_getUncleCountByBlockHash: EthGetUncleCountByBlockHashJsonRpcRequest
	eth_getUncleCountByBlockNumber: EthGetUncleCountByBlockNumberJsonRpcRequest
	eth_getUncleByBlockHashAndIndex: EthGetUncleByBlockHashAndIndexJsonRpcRequest
	eth_newPendingTransactionFilter: EthNewPendingTransactionFilterJsonRpcRequest
	eth_getUncleByBlockNumberAndIndex: EthGetUncleByBlockNumberAndIndexJsonRpcRequest
	eth_getBlockTransactionCountByHash: EthGetBlockTransactionCountByHashJsonRpcRequest
	eth_getBlockTransactionCountByNumber: EthGetBlockTransactionCountByNumberJsonRpcRequest
	eth_getTransactionByBlockHashAndIndex: EthGetTransactionByBlockHashAndIndexJsonRpcRequest
	eth_getTransactionByBlockNumberAndIndex: EthGetTransactionByBlockNumberAndIndexJsonRpcRequest
}

type TevmReturnType = {
	tevm_call: CallJsonRpcResponse
	tevm_script: ScriptJsonRpcResponse
	tevm_getAccount: GetAccountJsonRpcResponse
	tevm_setAccount: SetAccountJsonRpcResponse
}

type TevmRequestType = {
	tevm_call: CallJsonRpcResponse
	tevm_script: ScriptJsonRpcResponse
	tevm_getAccount: GetAccountJsonRpcResponse
	tevm_setAccount: SetAccountJsonRpcResponse
}

/**
 * Utility type to get the return type given a method name
 * @example
 * ```typescript
 * type BlockNumberReturnType = JsonRpcReturnTypeFromMethod<'eth_blockNumber'>
 * ```
 */
export type JsonRpcReturnTypeFromMethod<
	TMethod extends
		| keyof EthReturnType
		| keyof TevmReturnType
		| keyof AnvilReturnType
		| keyof DebugReturnType,
> = (EthReturnType &
	TevmReturnType &
	AnvilReturnType &
	DebugReturnType)[TMethod]

/**
 * Utility type to get the request type given a method name
 * @example
 * ```typescript
 * type BlockNumberRequestType = JsonRpcRequestTypeFromMethod<'eth_blockNumber'>
 * ```
 */
export type JsonRpcRequestTypeFromMethod<
	TMethod extends
		| keyof EthRequestType
		| keyof TevmRequestType
		| keyof AnvilRequestType
		| keyof DebugRequestType,
> = (EthRequestType &
	TevmRequestType &
	AnvilRequestType &
	DebugRequestType)[TMethod]

/**
 * Typesafe request handler for JSON-RPC requests. Most users will want to use the higher level
 * and more feature-rich `actions` api
 * @example
 * ```typescript
 * const blockNumberResponse = await tevm.request({
 *  method: 'eth_blockNumber',
 *  params: []
 *  id: 1
 *  jsonrpc: '2.0'
 * })
 * const accountResponse = await tevm.request({
 *  method: 'tevm_getAccount',
 *  params: [{address: '0x123...'}]
 *  id: 1
 *  jsonrpc: '2.0'
 * })
 * ```
 *
 * ### tevm_* methods
 *
 * #### tevm_call
 *
 * request - {@link CallJsonRpcRequest}
 * response - {@link CallJsonRpcRequest}
 *
 * #### tevm_script
 *
 * request - {@link ScriptJsonRpcRequest}
 * response - {@link ScriptJsonRpcRequest}
 *
 * #### tevm_getAccount
 *
 * request - {@link GetAccountJsonRpcRequest}
 * response - {@link GetAccountJsonRpcRequest}
 *
 * #### tevm_setAccount
 *
 * request - {@link SetAccountJsonRpcRequest}
 * response - {@link SetAccountJsonRpcRequest}
 *
 * ### debug_* methods
 *
 * #### debug_traceCall
 *
 * request - {@link DebugTraceCallJsonRpcRequest}
 * response - {@link DebugTraceCallJsonRpcResponse}
 *
 * ### eth_* methods
 *
 * #### eth_blockNumber
 *
 * request - {@link EthBlockNumberJsonRpcRequest}
 * response - {@link EthBlockNumberJsonRpcResponse}
 *
 * #### eth_chainId
 *
 * request - {@link EthChainIdJsonRpcRequest}
 * response - {@link EthChainIdJsonRpcResponse}
 *
 * #### eth_getCode
 *
 * request - {@link EthGetCodeJsonRpcRequest}
 * response - {@link EthGetCodeJsonRpcResponse}
 *
 * #### eth_getStorageAt
 *
 * request - {@link EthGetStorageAtJsonRpcRequest}
 * response - {@link EthGetStorageAtJsonRpcResponse}
 *
 * #### eth_gasPrice
 *
 * request - {@link EthGasPriceJsonRpcRequest}
 * response - {@link EthGasPriceJsonRpcResponse}
 *
 * #### eth_getBalance
 *
 * request - {@link EthGetBalanceJsonRpcRequest}
 * response - {@link EthGetBalanceJsonRpcResponse}
 */
export type TevmJsonRpcRequestHandler = <
	TRequest extends
		| TevmJsonRpcRequest
		| EthJsonRpcRequest
		| AnvilJsonRpcRequest
		| DebugJsonRpcRequest,
>(
	request: TRequest,
) => Promise<JsonRpcReturnTypeFromMethod<TRequest['method']>>
