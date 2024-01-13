import type {
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
} from '../requests/index.js'
import type {
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
} from '../responses/index.js'

// eth_accounts
export type EthAccountsJsonRpcProcedure = (
	request: EthAccountsJsonRpcRequest,
) => Promise<EthAccountsJsonRpcResponse>
// eth_blockNumber
export type EthBlockNumberJsonRpcProcedure = (
	request: EthBlockNumberJsonRpcRequest,
) => Promise<EthBlockNumberJsonRpcResponse>
// eth_call
export type EthCallJsonRpcProcedure = (
	request: EthCallJsonRpcRequest,
) => Promise<EthCallJsonRpcResponse>
// eth_chainId
export type EthChainIdJsonRpcProcedure = (
	request: EthChainIdJsonRpcRequest,
) => Promise<EthChainIdJsonRpcResponse>
// eth_coinbase
export type EthCoinbaseJsonRpcProcedure = (
	request: EthCoinbaseJsonRpcRequest,
) => Promise<EthCoinbaseJsonRpcResponse>
// eth_estimateGas
export type EthEstimateGasJsonRpcProcedure = (
	request: EthEstimateGasJsonRpcRequest,
) => Promise<EthEstimateGasJsonRpcResponse>
// eth_hashrate
export type EthHashrateJsonRpcProcedure = (
	request: EthHashrateJsonRpcRequest,
) => Promise<EthHashrateJsonRpcResponse>
// eth_gasPrice
export type EthGasPriceJsonRpcProcedure = (
	request: EthGasPriceJsonRpcRequest,
) => Promise<EthGasPriceJsonRpcResponse>
// eth_getBalance
export type EthGetBalanceJsonRpcProcedure = (
	request: EthGetBalanceJsonRpcRequest,
) => Promise<EthGetBalanceJsonRpcResponse>
// eth_getBlockByHash
export type EthGetBlockByHashJsonRpcProcedure = (
	request: EthGetBlockByHashJsonRpcRequest,
) => Promise<EthGetBlockByHashJsonRpcResponse>
// eth_getBlockByNumber
export type EthGetBlockByNumberJsonRpcProcedure = (
	request: EthGetBlockByNumberJsonRpcRequest,
) => Promise<EthGetBlockByNumberJsonRpcResponse>
// eth_getBlockTransactionCountByHash
export type EthGetBlockTransactionCountByHashJsonRpcProcedure = (
	request: EthGetBlockTransactionCountByHashJsonRpcRequest,
) => Promise<EthGetBlockTransactionCountByHashJsonRpcResponse>
// eth_getBlockTransactionCountByNumber
export type EthGetBlockTransactionCountByNumberJsonRpcProcedure = (
	request: EthGetBlockTransactionCountByNumberJsonRpcRequest,
) => Promise<EthGetBlockTransactionCountByNumberJsonRpcResponse>
// eth_getCode
export type EthGetCodeJsonRpcProcedure = (
	request: EthGetCodeJsonRpcRequest,
) => Promise<EthGetCodeJsonRpcResponse>
// eth_getFilterChanges
export type EthGetFilterChangesJsonRpcProcedure = (
	request: EthGetFilterChangesJsonRpcRequest,
) => Promise<EthGetFilterChangesJsonRpcResponse>
// eth_getFilterLog
export type EthGetFilterLogsJsonRpcProcedure = (
	request: EthGetFilterLogsJsonRpcRequest,
) => Promise<EthGetFilterLogsJsonRpcResponse>
// eth_getLogs
export type EthGetLogsJsonRpcProcedure = (
	request: EthGetLogsJsonRpcRequest,
) => Promise<EthGetLogsJsonRpcResponse>
// eth_getStorageAt
export type EthGetStorageAtJsonRpcProcedure = (
	request: EthGetStorageAtJsonRpcRequest,
) => Promise<EthGetStorageAtJsonRpcResponse>
// eth_getTransactionCount
export type EthGetTransactionCountJsonRpcProcedure = (
	request: EthGetTransactionCountJsonRpcRequest,
) => Promise<EthGetTransactionCountJsonRpcResponse>
// eth_getUncleCountByBlockHash
export type EthGetUncleCountByBlockHashJsonRpcProcedure = (
	request: EthGetUncleCountByBlockHashJsonRpcRequest,
) => Promise<EthGetUncleCountByBlockHashJsonRpcResponse>
// eth_getUncleCountByBlockNumber
export type EthGetUncleCountByBlockNumberJsonRpcProcedure = (
	request: EthGetUncleCountByBlockNumberJsonRpcRequest,
) => Promise<EthGetUncleCountByBlockNumberJsonRpcResponse>
// eth_getTransactionByHash
export type EthGetTransactionByHashJsonRpcProcedure = (
	request: EthGetTransactionByHashJsonRpcRequest,
) => Promise<EthGetTransactionByHashJsonRpcResponse>
// eth_getTransactionByBlockHashAndIndex
export type EthGetTransactionByBlockHashAndIndexJsonRpcProcedure = (
	request: EthGetTransactionByBlockHashAndIndexJsonRpcRequest,
) => Promise<EthGetTransactionByBlockHashAndIndexJsonRpcResponse>
// eth_getTransactionByBlockNumberAndIndex
export type EthGetTransactionByBlockNumberAndIndexJsonRpcProcedure = (
	request: EthGetTransactionByBlockNumberAndIndexJsonRpcRequest,
) => Promise<EthGetTransactionByBlockNumberAndIndexJsonRpcResponse>
// eth_getTransactionReceipt
export type EthGetTransactionReceiptJsonRpcProcedure = (
	request: EthGetTransactionReceiptJsonRpcRequest,
) => Promise<EthGetTransactionReceiptJsonRpcResponse>
// eth_getUncleByBlockHashAndIndex
export type EthGetUncleByBlockHashAndIndexJsonRpcProcedure = (
	request: EthGetUncleByBlockHashAndIndexJsonRpcRequest,
) => Promise<EthGetUncleByBlockHashAndIndexJsonRpcResponse>
// eth_getUncleByBlockNumberAndIndex
export type EthGetUncleByBlockNumberAndIndexJsonRpcProcedure = (
	request: EthGetUncleByBlockNumberAndIndexJsonRpcRequest,
) => Promise<EthGetUncleByBlockNumberAndIndexJsonRpcResponse>
// eth_mining
export type EthMiningJsonRpcProcedure = (
	request: EthMiningJsonRpcRequest,
) => Promise<EthMiningJsonRpcResponse>
// eth_protocolVersion
export type EthProtocolVersionJsonRpcProcedure = (
	request: EthProtocolVersionJsonRpcRequest,
) => Promise<EthProtocolVersionJsonRpcResponse>
// eth_sendRawTransaction
export type EthSendRawTransactionJsonRpcProcedure = (
	request: EthSendRawTransactionJsonRpcRequest,
) => Promise<EthSendRawTransactionJsonRpcResponse>
// eth_sendTransaction
export type EthSendTransactionJsonRpcProcedure = (
	request: EthSendTransactionJsonRpcRequest,
) => Promise<EthSendTransactionJsonRpcResponse>
// eth_sign
export type EthSignJsonRpcProcedure = (
	request: EthSignJsonRpcRequest,
) => Promise<EthSignJsonRpcResponse>
// eth_signTransaction
export type EthSignTransactionJsonRpcProcedure = (
	request: EthSignTransactionJsonRpcRequest,
) => Promise<EthSignTransactionJsonRpcResponse>
// eth_syncing
export type EthSyncingJsonRpcProcedure = (
	request: EthSyncingJsonRpcRequest,
) => Promise<EthSyncingJsonRpcResponse>
// eth_newFilter
export type EthNewFilterJsonRpcProcedure = (
	request: EthNewFilterJsonRpcRequest,
) => Promise<EthNewFilterJsonRpcResponse>
// eth_newBlockFilter
export type EthNewBlockFilterJsonRpcProcedure = (
	request: EthNewBlockFilterJsonRpcRequest,
) => Promise<EthNewBlockFilterJsonRpcResponse>
// eth_newPendingTransactionFilter
export type EthNewPendingTransactionFilterJsonRpcProcedure = (
	request: EthNewPendingTransactionFilterJsonRpcRequest,
) => Promise<EthNewPendingTransactionFilterJsonRpcResponse>
// eth_uninstallFilter
export type EthUninstallFilterJsonRpcProcedure = (
	request: EthUninstallFilterJsonRpcRequest,
) => Promise<EthUninstallFilterJsonRpcResponse>
