import type {
	AccountJsonRpcResponse,
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
	ScriptJsonRpcResponse,
	TevmJsonRpcRequest,
} from './index.js'
import type { AnvilJsonRpcRequest } from './requests/AnvilJsonRpcRequest.js'
import type { DebugJsonRpcRequest } from './requests/DebugJsonRpcRequest.js'
import type { EthJsonRpcRequest } from './requests/EthJsonRpcRequest.js'
import type { TraceCallJsonRpcResponse } from './responses/TraceCallJsonRpcResponse.js'
import type { TraceContractJsonRpcResponse } from './responses/TraceContractJsonRpcResponse.js'
import type { TraceScriptJsonRpcResponse } from './responses/TraceScriptJsonRpcResponse.js'

type DebugReturnType = {
	debug_traceTransaction: DebugTraceTransactionJsonRpcResponse
	debug_traceCall: DebugTraceCallJsonRpcResponse
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

type TevmReturnType = {
	tevm_call: CallJsonRpcResponse
	tevm_script: ScriptJsonRpcResponse
	tevm_account: AccountJsonRpcResponse
	tevm_traceCall: TraceCallJsonRpcResponse
	tevm_traceContract: TraceContractJsonRpcResponse
	tevm_traceScript: TraceScriptJsonRpcResponse
}

type ReturnType<
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
 * Type of a JSON-RPC request handler for tevm procedures
 * Generic and returns the correct response type for a given request
 */
export type TevmJsonRpcRequestHandler = <
	TRequest extends
	| TevmJsonRpcRequest
	| EthJsonRpcRequest
	| AnvilJsonRpcRequest
	| DebugJsonRpcRequest,
>(
	request: TRequest,
) => Promise<ReturnType<TRequest['method']>>

export type EthJsonRpcRequestHandler = <TRequest extends EthJsonRpcRequest>(
	request: TRequest,
) => Promise<EthReturnType[TRequest['method']]>
