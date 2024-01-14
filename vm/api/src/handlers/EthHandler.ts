import type {
	EthAccountsParams,
	EthBlockNumberParams,
	EthCallParams,
	EthChainIdParams,
	EthCoinbaseParams,
	EthEstimateGasParams,
	EthGasPriceParams,
	EthGetBalanceParams,
	EthGetBlockByHashParams,
	EthGetBlockByNumberParams,
	EthGetBlockTransactionCountByHashParams,
	EthGetBlockTransactionCountByNumberParams,
	EthGetCodeParams,
	EthGetFilterChangesParams,
	EthGetFilterLogsParams,
	EthGetLogsParams,
	EthGetStorageAtParams,
	EthGetTransactionByBlockHashAndIndexParams,
	EthGetTransactionByBlockNumberAndIndexParams,
	EthGetTransactionByHashParams,
	EthGetTransactionCountParams,
	EthGetTransactionReceiptParams,
	EthGetUncleByBlockHashAndIndexParams,
	EthGetUncleByBlockNumberAndIndexParams,
	EthGetUncleCountByBlockHashParams,
	EthGetUncleCountByBlockNumberParams,
	EthHashrateParams,
	EthMiningParams,
	EthNewBlockFilterParams,
	EthNewFilterParams,
	EthNewPendingTransactionFilterParams,
	EthProtocolVersionParams,
	EthSendRawTransactionParams,
	EthSendTransactionParams,
	EthSignParams,
	EthSignTransactionParams,
	EthSyncingParams,
	EthUninstallFilterParams,
} from '../params/index.js'
import type {
	EthAccountsResult,
	EthBlockNumberResult,
	EthCallResult,
	EthChainIdResult,
	EthCoinbaseResult,
	EthEstimateGasResult,
	EthGasPriceResult,
	EthGetBalanceResult,
	EthGetBlockByHashResult,
	EthGetBlockByNumberResult,
	EthGetBlockTransactionCountByHashResult,
	EthGetBlockTransactionCountByNumberResult,
	EthGetCodeResult,
	EthGetFilterChangesResult,
	EthGetFilterLogsResult,
	EthGetLogsResult,
	EthGetStorageAtResult,
	EthGetTransactionByBlockHashAndIndexResult,
	EthGetTransactionByBlockNumberAndIndexResult,
	EthGetTransactionByHashResult,
	EthGetTransactionCountResult,
	EthGetTransactionReceiptResult,
	EthGetUncleByBlockHashAndIndexResult,
	EthGetUncleByBlockNumberAndIndexResult,
	EthGetUncleCountByBlockHashResult,
	EthGetUncleCountByBlockNumberResult,
	EthHashrateResult,
	EthMiningResult,
	EthNewBlockFilterResult,
	EthNewFilterResult,
	EthNewPendingTransactionFilterResult,
	EthProtocolVersionResult,
	EthSendRawTransactionResult,
	EthSendTransactionResult,
	EthSignResult,
	EthSignTransactionResult,
	EthSyncingResult,
	EthUninstallFilterResult,
} from '../result/index.js'

// eth_accounts
export type EthAccountsHandler = (
	request?: EthAccountsParams,
) => Promise<EthAccountsResult>
// eth_blockNumber
export type EthBlockNumberHandler = (
	request?: EthBlockNumberParams,
) => Promise<EthBlockNumberResult>
// eth_call
export type EthCallHandler = (request: EthCallParams) => Promise<EthCallResult>
// eth_chainId
export type EthChainIdHandler = (
	request?: EthChainIdParams,
) => Promise<EthChainIdResult>
// eth_coinbase
export type EthCoinbaseHandler = (
	request: EthCoinbaseParams,
) => Promise<EthCoinbaseResult>
// eth_estimateGas
export type EthEstimateGasHandler = (
	request: EthEstimateGasParams,
) => Promise<EthEstimateGasResult>
// eth_hashrate
export type EthHashrateHandler = (
	request?: EthHashrateParams,
) => Promise<EthHashrateResult>
// eth_gasPrice
export type EthGasPriceHandler = (
	request?: EthGasPriceParams,
) => Promise<EthGasPriceResult>
// eth_getBalance
export type EthGetBalanceHandler = (
	request: EthGetBalanceParams,
) => Promise<EthGetBalanceResult>
// eth_getBlockByHash
export type EthGetBlockByHashHandler = (
	request: EthGetBlockByHashParams,
) => Promise<EthGetBlockByHashResult>
// eth_getBlockByNumber
export type EthGetBlockByNumberHandler = (
	request: EthGetBlockByNumberParams,
) => Promise<EthGetBlockByNumberResult>
// eth_getBlockTransactionCountByHash
export type EthGetBlockTransactionCountByHashHandler = (
	request: EthGetBlockTransactionCountByHashParams,
) => Promise<EthGetBlockTransactionCountByHashResult>
// eth_getBlockTransactionCountByNumber
export type EthGetBlockTransactionCountByNumberHandler = (
	request: EthGetBlockTransactionCountByNumberParams,
) => Promise<EthGetBlockTransactionCountByNumberResult>
// eth_getCode
export type EthGetCodeHandler = (
	request: EthGetCodeParams,
) => Promise<EthGetCodeResult>
// eth_getFilterChanges
export type EthGetFilterChangesHandler = (
	request: EthGetFilterChangesParams,
) => Promise<EthGetFilterChangesResult>
// eth_getFilterLog
export type EthGetFilterLogsHandler = (
	request: EthGetFilterLogsParams,
) => Promise<EthGetFilterLogsResult>
// eth_getLogs
export type EthGetLogsHandler = (
	request: EthGetLogsParams,
) => Promise<EthGetLogsResult>
// eth_getStorageAt
export type EthGetStorageAtHandler = (
	request: EthGetStorageAtParams,
) => Promise<EthGetStorageAtResult>
// eth_getTransactionCount
export type EthGetTransactionCountHandler = (
	request: EthGetTransactionCountParams,
) => Promise<EthGetTransactionCountResult>
// eth_getUncleCountByBlockHash
export type EthGetUncleCountByBlockHashHandler = (
	request: EthGetUncleCountByBlockHashParams,
) => Promise<EthGetUncleCountByBlockHashResult>
// eth_getUncleCountByBlockNumber
export type EthGetUncleCountByBlockNumberHandler = (
	request: EthGetUncleCountByBlockNumberParams,
) => Promise<EthGetUncleCountByBlockNumberResult>
// eth_getTransactionByHash
export type EthGetTransactionByHashHandler = (
	request: EthGetTransactionByHashParams,
) => Promise<EthGetTransactionByHashResult>
// eth_getTransactionByBlockHashAndIndex
export type EthGetTransactionByBlockHashAndIndexHandler = (
	request: EthGetTransactionByBlockHashAndIndexParams,
) => Promise<EthGetTransactionByBlockHashAndIndexResult>
// eth_getTransactionByBlockNumberAndIndex
export type EthGetTransactionByBlockNumberAndIndexHandler = (
	request: EthGetTransactionByBlockNumberAndIndexParams,
) => Promise<EthGetTransactionByBlockNumberAndIndexResult>
// eth_getTransactionReceipt
export type EthGetTransactionReceiptHandler = (
	request: EthGetTransactionReceiptParams,
) => Promise<EthGetTransactionReceiptResult>
// eth_getUncleByBlockHashAndIndex
export type EthGetUncleByBlockHashAndIndexHandler = (
	request: EthGetUncleByBlockHashAndIndexParams,
) => Promise<EthGetUncleByBlockHashAndIndexResult>
// eth_getUncleByBlockNumberAndIndex
export type EthGetUncleByBlockNumberAndIndexHandler = (
	request: EthGetUncleByBlockNumberAndIndexParams,
) => Promise<EthGetUncleByBlockNumberAndIndexResult>
// eth_mining
export type EthMiningHandler = (
	request: EthMiningParams,
) => Promise<EthMiningResult>
// eth_protocolVersion
export type EthProtocolVersionHandler = (
	request: EthProtocolVersionParams,
) => Promise<EthProtocolVersionResult>
// eth_sendRawTransaction
export type EthSendRawTransactionHandler = (
	request: EthSendRawTransactionParams,
) => Promise<EthSendRawTransactionResult>
// eth_sendTransaction
export type EthSendTransactionHandler = (
	request: EthSendTransactionParams,
) => Promise<EthSendTransactionResult>
// eth_sign
export type EthSignHandler = (request: EthSignParams) => Promise<EthSignResult>
// eth_signTransaction
export type EthSignTransactionHandler = (
	request: EthSignTransactionParams,
) => Promise<EthSignTransactionResult>
// eth_syncing
export type EthSyncingHandler = (
	request: EthSyncingParams,
) => Promise<EthSyncingResult>
// eth_newFilter
export type EthNewFilterHandler = (
	request: EthNewFilterParams,
) => Promise<EthNewFilterResult>
// eth_newBlockFilter
export type EthNewBlockFilterHandler = (
	request: EthNewBlockFilterParams,
) => Promise<EthNewBlockFilterResult>
// eth_newPendingTransactionFilter
export type EthNewPendingTransactionFilterHandler = (
	request: EthNewPendingTransactionFilterParams,
) => Promise<EthNewPendingTransactionFilterResult>
// eth_uninstallFilter
export type EthUninstallFilterHandler = (
	request: EthUninstallFilterParams,
) => Promise<EthUninstallFilterResult>
