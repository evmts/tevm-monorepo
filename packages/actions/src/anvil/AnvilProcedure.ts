import type {
	AnvilAddBalanceJsonRpcRequest,
	AnvilAutoImpersonateAccountJsonRpcRequest,
	AnvilDealErc20JsonRpcRequest,
	AnvilDealJsonRpcRequest,
	AnvilDropAllTransactionsJsonRpcRequest,
	AnvilDropTransactionJsonRpcRequest,
	AnvilDumpStateJsonRpcRequest,
	AnvilGetAutomineJsonRpcRequest,
	AnvilGetIntervalMiningJsonRpcRequest,
	AnvilImpersonateAccountJsonRpcRequest,
	AnvilIncreaseTimeJsonRpcRequest,
	AnvilLoadStateJsonRpcRequest,
	AnvilMetadataJsonRpcRequest,
	AnvilMineJsonRpcRequest,
	AnvilNodeInfoJsonRpcRequest,
	AnvilRemoveBlockTimestampIntervalJsonRpcRequest,
	AnvilRemovePoolTransactionsJsonRpcRequest,
	AnvilResetJsonRpcRequest,
	AnvilRevertJsonRpcRequest,
	AnvilSetAutomineJsonRpcRequest,
	AnvilSetBalanceJsonRpcRequest,
	AnvilSetBlockGasLimitJsonRpcRequest,
	AnvilSetBlockTimestampIntervalJsonRpcRequest,
	AnvilSetChainIdJsonRpcRequest,
	AnvilSetCodeJsonRpcRequest,
	AnvilSetCoinbaseJsonRpcRequest,
	AnvilSetErc20AllowanceJsonRpcRequest,
	AnvilSetIntervalMiningJsonRpcRequest,
	AnvilSetLoggingEnabledJsonRpcRequest,
	AnvilSetMinGasPriceJsonRpcRequest,
	AnvilSetNextBlockBaseFeePerGasJsonRpcRequest,
	AnvilSetNextBlockTimestampJsonRpcRequest,
	AnvilSetNonceJsonRpcRequest,
	AnvilSetRpcUrlJsonRpcRequest,
	AnvilSetStorageAtJsonRpcRequest,
	AnvilSetTimeJsonRpcRequest,
	AnvilSnapshotJsonRpcRequest,
	AnvilStopImpersonatingAccountJsonRpcRequest,
} from './AnvilJsonRpcRequest.js'
import type {
	AnvilAddBalanceJsonRpcResponse,
	AnvilAutoImpersonateAccountJsonRpcResponse,
	AnvilDealErc20JsonRpcResponse,
	AnvilDealJsonRpcResponse,
	AnvilDropAllTransactionsJsonRpcResponse,
	AnvilDropTransactionJsonRpcResponse,
	AnvilDumpStateJsonRpcResponse,
	AnvilGetAutomineJsonRpcResponse,
	AnvilGetIntervalMiningJsonRpcResponse,
	AnvilImpersonateAccountJsonRpcResponse,
	AnvilIncreaseTimeJsonRpcResponse,
	AnvilLoadStateJsonRpcResponse,
	AnvilMetadataJsonRpcResponse,
	AnvilMineJsonRpcResponse,
	AnvilNodeInfoJsonRpcResponse,
	AnvilRemoveBlockTimestampIntervalJsonRpcResponse,
	AnvilRemovePoolTransactionsJsonRpcResponse,
	AnvilResetJsonRpcResponse,
	AnvilRevertJsonRpcResponse,
	AnvilSetAutomineJsonRpcResponse,
	AnvilSetBalanceJsonRpcResponse,
	AnvilSetBlockGasLimitJsonRpcResponse,
	AnvilSetBlockTimestampIntervalJsonRpcResponse,
	AnvilSetChainIdJsonRpcResponse,
	AnvilSetCodeJsonRpcResponse,
	AnvilSetCoinbaseJsonRpcResponse,
	AnvilSetErc20AllowanceJsonRpcResponse,
	AnvilSetIntervalMiningJsonRpcResponse,
	AnvilSetLoggingEnabledJsonRpcResponse,
	AnvilSetMinGasPriceJsonRpcResponse,
	AnvilSetNextBlockBaseFeePerGasJsonRpcResponse,
	AnvilSetNextBlockTimestampJsonRpcResponse,
	AnvilSetNonceJsonRpcResponse,
	AnvilSetRpcUrlJsonRpcResponse,
	AnvilSetStorageAtJsonRpcResponse,
	AnvilSetTimeJsonRpcResponse,
	AnvilSnapshotJsonRpcResponse,
	AnvilStopImpersonatingAccountJsonRpcResponse,
} from './AnvilJsonRpcResponse.js'

export type AnvilSetCoinbaseProcedure = (
	request: AnvilSetCoinbaseJsonRpcRequest,
) => Promise<AnvilSetCoinbaseJsonRpcResponse>
// anvil_impersonateAccount
/**
 * JSON-RPC procedure for `anvil_impersonateAccount`
 */
export type AnvilImpersonateAccountProcedure = (
	request: AnvilImpersonateAccountJsonRpcRequest,
) => Promise<AnvilImpersonateAccountJsonRpcResponse>
// anvil_stopImpersonatingAccount
/**
 * JSON-RPC procedure for `anvil_stopImpersonatingAccount`
 */
export type AnvilStopImpersonatingAccountProcedure = (
	request: AnvilStopImpersonatingAccountJsonRpcRequest,
) => Promise<AnvilStopImpersonatingAccountJsonRpcResponse>
// anvil_autoImpersonateAccount
/**
 * JSON-RPC procedure for `anvil_autoImpersonateAccount`
 */
export type AnvilAutoImpersonateAccountProcedure = (
	request: AnvilAutoImpersonateAccountJsonRpcRequest,
) => Promise<AnvilAutoImpersonateAccountJsonRpcResponse>
// anvil_getAutomine
/**
 * JSON-RPC procedure for `anvil_getAutomine`
 */
export type AnvilGetAutomineProcedure = (
	request: AnvilGetAutomineJsonRpcRequest,
) => Promise<AnvilGetAutomineJsonRpcResponse>
// anvil_setAutomine
/**
 * JSON-RPC procedure for `anvil_setAutomine`
 */
export type AnvilSetAutomineProcedure = (
	request: AnvilSetAutomineJsonRpcRequest,
) => Promise<AnvilSetAutomineJsonRpcResponse>
// anvil_setIntervalMining
/**
 * JSON-RPC procedure for `anvil_setIntervalMining`
 */
export type AnvilSetIntervalMiningProcedure = (
	request: AnvilSetIntervalMiningJsonRpcRequest,
) => Promise<AnvilSetIntervalMiningJsonRpcResponse>
// anvil_getIntervalMining
/**
 * JSON-RPC procedure for `anvil_getIntervalMining`
 */
export type AnvilGetIntervalMiningProcedure = (
	request: AnvilGetIntervalMiningJsonRpcRequest,
) => Promise<AnvilGetIntervalMiningJsonRpcResponse>
// anvil_mine
/**
 * JSON-RPC procedure for `anvil_mine`
 */
export type AnvilMineProcedure = (request: AnvilMineJsonRpcRequest) => Promise<AnvilMineJsonRpcResponse>
// anvil_reset
/**
 * JSON-RPC procedure for `anvil_reset`
 */
export type AnvilResetProcedure = (request: AnvilResetJsonRpcRequest) => Promise<AnvilResetJsonRpcResponse>
// anvil_dropTransaction
/**
 * JSON-RPC procedure for `anvil_dropTransaction`
 */
export type AnvilDropTransactionProcedure = (
	request: AnvilDropTransactionJsonRpcRequest,
) => Promise<AnvilDropTransactionJsonRpcResponse>
// anvil_setBalance
/**
 * JSON-RPC procedure for `anvil_setBalance`
 */
export type AnvilSetBalanceProcedure = (
	request: AnvilSetBalanceJsonRpcRequest,
) => Promise<AnvilSetBalanceJsonRpcResponse>
// anvil_setCode
/**
 * JSON-RPC procedure for `anvil_setCode`
 */
export type AnvilSetCodeProcedure = (request: AnvilSetCodeJsonRpcRequest) => Promise<AnvilSetCodeJsonRpcResponse>
// anvil_setNonce
/**
 * JSON-RPC procedure for `anvil_setNonce`
 */
export type AnvilSetNonceProcedure = (request: AnvilSetNonceJsonRpcRequest) => Promise<AnvilSetNonceJsonRpcResponse>
// anvil_setStorageAt
/**
 * JSON-RPC procedure for `anvil_setStorageAt`
 */
export type AnvilSetStorageAtProcedure = (
	request: AnvilSetStorageAtJsonRpcRequest,
) => Promise<AnvilSetStorageAtJsonRpcResponse>
// anvil_setChainId
/**
 * JSON-RPC procedure for `anvil_setChainId`
 */
export type AnvilSetChainIdProcedure = (
	request: AnvilSetChainIdJsonRpcRequest,
) => Promise<AnvilSetChainIdJsonRpcResponse>
// TODO make this the same as our dump state
// anvil_dumpState
/**
 * JSON-RPC procedure for `anvil_dumpState`
 */
export type AnvilDumpStateProcedure = (request: AnvilDumpStateJsonRpcRequest) => Promise<AnvilDumpStateJsonRpcResponse>
// TODO make this the same as our load state
// anvil_loadState
/**
 * JSON-RPC procedure for `anvil_loadState`
 */
export type AnvilLoadStateProcedure = (request: AnvilLoadStateJsonRpcRequest) => Promise<AnvilLoadStateJsonRpcResponse>
// anvil_deal
/**
 * JSON-RPC procedure for `anvil_deal`
 */
export type AnvilDealProcedure = (request: AnvilDealJsonRpcRequest) => Promise<AnvilDealJsonRpcResponse>
// anvil_dealErc20
/**
 * JSON-RPC procedure for `anvil_dealErc20`
 */
export type AnvilDealErc20Procedure = (request: AnvilDealErc20JsonRpcRequest) => Promise<AnvilDealErc20JsonRpcResponse>
// anvil_setErc20Allowance
/**
 * JSON-RPC procedure for `anvil_setErc20Allowance`
 */
export type AnvilSetErc20AllowanceProcedure = (
	request: AnvilSetErc20AllowanceJsonRpcRequest,
) => Promise<AnvilSetErc20AllowanceJsonRpcResponse>
// anvil_dropAllTransactions
/**
 * JSON-RPC procedure for `anvil_dropAllTransactions`
 */
export type AnvilDropAllTransactionsProcedure = (
	request: AnvilDropAllTransactionsJsonRpcRequest,
) => Promise<AnvilDropAllTransactionsJsonRpcResponse>
// anvil_removePoolTransactions
/**
 * JSON-RPC procedure for `anvil_removePoolTransactions`
 */
export type AnvilRemovePoolTransactionsProcedure = (
	request: AnvilRemovePoolTransactionsJsonRpcRequest,
) => Promise<AnvilRemovePoolTransactionsJsonRpcResponse>
// anvil_snapshot
/**
 * JSON-RPC procedure for `anvil_snapshot`
 */
export type AnvilSnapshotProcedure = (request: AnvilSnapshotJsonRpcRequest) => Promise<AnvilSnapshotJsonRpcResponse>
// anvil_revert
/**
 * JSON-RPC procedure for `anvil_revert`
 */
export type AnvilRevertProcedure = (request: AnvilRevertJsonRpcRequest) => Promise<AnvilRevertJsonRpcResponse>
// anvil_setBlockGasLimit
/**
 * JSON-RPC procedure for `anvil_setBlockGasLimit`
 */
export type AnvilSetBlockGasLimitProcedure = (
	request: AnvilSetBlockGasLimitJsonRpcRequest,
) => Promise<AnvilSetBlockGasLimitJsonRpcResponse>
// anvil_setNextBlockBaseFeePerGas
/**
 * JSON-RPC procedure for `anvil_setNextBlockBaseFeePerGas`
 */
export type AnvilSetNextBlockBaseFeePerGasProcedure = (
	request: AnvilSetNextBlockBaseFeePerGasJsonRpcRequest,
) => Promise<AnvilSetNextBlockBaseFeePerGasJsonRpcResponse>
// anvil_setMinGasPrice
/**
 * JSON-RPC procedure for `anvil_setMinGasPrice`
 */
export type AnvilSetMinGasPriceProcedure = (
	request: AnvilSetMinGasPriceJsonRpcRequest,
) => Promise<AnvilSetMinGasPriceJsonRpcResponse>
// anvil_nodeInfo
/**
 * JSON-RPC procedure for `anvil_nodeInfo`
 */
export type AnvilNodeInfoProcedure = (request: AnvilNodeInfoJsonRpcRequest) => Promise<AnvilNodeInfoJsonRpcResponse>
// anvil_metadata
/**
 * JSON-RPC procedure for `anvil_metadata`
 */
export type AnvilMetadataProcedure = (request: AnvilMetadataJsonRpcRequest) => Promise<AnvilMetadataJsonRpcResponse>
// anvil_setRpcUrl
/**
 * JSON-RPC procedure for `anvil_setRpcUrl`
 */
export type AnvilSetRpcUrlProcedure = (request: AnvilSetRpcUrlJsonRpcRequest) => Promise<AnvilSetRpcUrlJsonRpcResponse>
// anvil_setLoggingEnabled
/**
 * JSON-RPC procedure for `anvil_setLoggingEnabled`
 */
export type AnvilSetLoggingEnabledProcedure = (
	request: AnvilSetLoggingEnabledJsonRpcRequest,
) => Promise<AnvilSetLoggingEnabledJsonRpcResponse>
// anvil_addBalance
/**
 * JSON-RPC procedure for `anvil_addBalance`
 */
export type AnvilAddBalanceProcedure = (
	request: AnvilAddBalanceJsonRpcRequest,
) => Promise<AnvilAddBalanceJsonRpcResponse>
// anvil_increaseTime
/**
 * JSON-RPC procedure for `anvil_increaseTime`
 */
export type AnvilIncreaseTimeProcedure = (
	request: AnvilIncreaseTimeJsonRpcRequest,
) => Promise<AnvilIncreaseTimeJsonRpcResponse>
// anvil_setNextBlockTimestamp
/**
 * JSON-RPC procedure for `anvil_setNextBlockTimestamp`
 */
export type AnvilSetNextBlockTimestampProcedure = (
	request: AnvilSetNextBlockTimestampJsonRpcRequest,
) => Promise<AnvilSetNextBlockTimestampJsonRpcResponse>
// anvil_setTime
/**
 * JSON-RPC procedure for `anvil_setTime`
 */
export type AnvilSetTimeProcedure = (request: AnvilSetTimeJsonRpcRequest) => Promise<AnvilSetTimeJsonRpcResponse>
// anvil_setBlockTimestampInterval
/**
 * JSON-RPC procedure for `anvil_setBlockTimestampInterval`
 */
export type AnvilSetBlockTimestampIntervalProcedure = (
	request: AnvilSetBlockTimestampIntervalJsonRpcRequest,
) => Promise<AnvilSetBlockTimestampIntervalJsonRpcResponse>
// anvil_removeBlockTimestampInterval
/**
 * JSON-RPC procedure for `anvil_removeBlockTimestampInterval`
 */
export type AnvilRemoveBlockTimestampIntervalProcedure = (
	request: AnvilRemoveBlockTimestampIntervalJsonRpcRequest,
) => Promise<AnvilRemoveBlockTimestampIntervalJsonRpcResponse>

export type AnvilProcedure =
	| AnvilSetCoinbaseProcedure
	| AnvilImpersonateAccountProcedure
	| AnvilStopImpersonatingAccountProcedure
	| AnvilAutoImpersonateAccountProcedure
	| AnvilGetAutomineProcedure
	| AnvilSetAutomineProcedure
	| AnvilSetIntervalMiningProcedure
	| AnvilGetIntervalMiningProcedure
	| AnvilMineProcedure
	| AnvilResetProcedure
	| AnvilDropTransactionProcedure
	| AnvilSetBalanceProcedure
	| AnvilSetCodeProcedure
	| AnvilSetNonceProcedure
	| AnvilSetStorageAtProcedure
	| AnvilSetChainIdProcedure
	| AnvilDumpStateProcedure
	| AnvilLoadStateProcedure
	| AnvilDealProcedure
	| AnvilDealErc20Procedure
	| AnvilSetErc20AllowanceProcedure
	| AnvilDropAllTransactionsProcedure
	| AnvilRemovePoolTransactionsProcedure
	| AnvilSnapshotProcedure
	| AnvilRevertProcedure
	| AnvilSetBlockGasLimitProcedure
	| AnvilSetNextBlockBaseFeePerGasProcedure
	| AnvilSetMinGasPriceProcedure
	| AnvilNodeInfoProcedure
	| AnvilMetadataProcedure
	| AnvilSetRpcUrlProcedure
	| AnvilSetLoggingEnabledProcedure
	| AnvilAddBalanceProcedure
	| AnvilIncreaseTimeProcedure
	| AnvilSetNextBlockTimestampProcedure
	| AnvilSetTimeProcedure
	| AnvilSetBlockTimestampIntervalProcedure
	| AnvilRemoveBlockTimestampIntervalProcedure
