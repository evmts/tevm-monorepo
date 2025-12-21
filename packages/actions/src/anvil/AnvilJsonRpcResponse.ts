// debug_traceTransaction

import type { JsonRpcResponse } from '@tevm/jsonrpc'
import type { Address } from '@tevm/utils'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type {
	AnvilAutoImpersonateAccountResult,
	AnvilDealErc20Result,
	AnvilDealResult,
	AnvilDropAllTransactionsResult,
	AnvilDropTransactionResult,
	AnvilDumpStateResult,
	AnvilGetAutomineResult,
	AnvilGetIntervalMiningResult,
	AnvilImpersonateAccountResult,
	AnvilIncreaseTimeResult,
	AnvilLoadStateResult,
	AnvilMetadataResult,
	AnvilMineResult,
	AnvilNodeInfoResult,
	AnvilRemoveBlockTimestampIntervalResult,
	AnvilRemovePoolTransactionsResult,
	AnvilResetResult,
	AnvilRevertResult,
	AnvilSetAutomineResult,
	AnvilSetBalanceResult,
	AnvilSetBlockGasLimitResult,
	AnvilSetBlockTimestampIntervalResult,
	AnvilSetChainIdResult,
	AnvilSetCodeResult,
	AnvilSetErc20AllowanceResult,
	AnvilSetIntervalMiningResult,
	AnvilSetMinGasPriceResult,
	AnvilSetNextBlockBaseFeePerGasResult,
	AnvilSetNextBlockTimestampResult,
	AnvilSetNonceResult,
	AnvilSetStorageAtResult,
	AnvilSetTimeResult,
	AnvilSnapshotResult,
	AnvilStopImpersonatingAccountResult,
} from './index.js'

// TODO type the errors strongly
type AnvilError = string

// anvil_impersonateAccount
/**
 * JSON-RPC response for `anvil_impersonateAccount` procedure
 */
export type AnvilImpersonateAccountJsonRpcResponse = JsonRpcResponse<
	'anvil_impersonateAccount',
	SerializeToJson<AnvilImpersonateAccountResult>,
	AnvilError
>
// anvil_stopImpersonatingAccount
/**
 * JSON-RPC response for `anvil_stopImpersonatingAccount` procedure
 */
export type AnvilStopImpersonatingAccountJsonRpcResponse = JsonRpcResponse<
	'anvil_stopImpersonatingAccount',
	SerializeToJson<AnvilStopImpersonatingAccountResult>,
	AnvilError
>
// anvil_setCoinbase
/**
 * JSON-RPC response for `anvil_setCoinbase` procedure
 */
export type AnvilSetCoinbaseJsonRpcResponse = JsonRpcResponse<'anvil_setCoinbase', Address, AnvilError>
// anvil_autoImpersonateAccount
/**
 * JSON-RPC response for `anvil_autoImpersonateAccount` procedure
 */
export type AnvilAutoImpersonateAccountJsonRpcResponse = JsonRpcResponse<
	'anvil_autoImpersonateAccount',
	SerializeToJson<AnvilAutoImpersonateAccountResult>,
	AnvilError
>
// anvil_getAutomine
/**
 * JSON-RPC response for `anvil_getAutomine` procedure
 */
export type AnvilGetAutomineJsonRpcResponse = JsonRpcResponse<
	'anvil_getAutomine',
	SerializeToJson<AnvilGetAutomineResult>,
	AnvilError
>
// anvil_setAutomine
/**
 * JSON-RPC response for `anvil_setAutomine` procedure
 */
export type AnvilSetAutomineJsonRpcResponse = JsonRpcResponse<
	'anvil_setAutomine',
	SerializeToJson<AnvilSetAutomineResult>,
	AnvilError
>
// anvil_setIntervalMining
/**
 * JSON-RPC response for `anvil_setIntervalMining` procedure
 */
export type AnvilSetIntervalMiningJsonRpcResponse = JsonRpcResponse<
	'anvil_setIntervalMining',
	SerializeToJson<AnvilSetIntervalMiningResult>,
	AnvilError
>
// anvil_getIntervalMining
/**
 * JSON-RPC response for `anvil_getIntervalMining` procedure
 */
export type AnvilGetIntervalMiningJsonRpcResponse = JsonRpcResponse<
	'anvil_getIntervalMining',
	SerializeToJson<AnvilGetIntervalMiningResult>,
	AnvilError
>
// anvil_mine
/**
 * JSON-RPC response for `anvil_mine` procedure
 */
export type AnvilMineJsonRpcResponse = JsonRpcResponse<'anvil_mine', SerializeToJson<AnvilMineResult>, AnvilError>
// anvil_reset
/**
 * JSON-RPC response for `anvil_reset` procedure
 */
export type AnvilResetJsonRpcResponse = JsonRpcResponse<'anvil_reset', SerializeToJson<AnvilResetResult>, AnvilError>
// anvil_dropTransaction
/**
 * JSON-RPC response for `anvil_dropTransaction` procedure
 */
export type AnvilDropTransactionJsonRpcResponse = JsonRpcResponse<
	'anvil_dropTransaction',
	SerializeToJson<AnvilDropTransactionResult>,
	AnvilError
>
// anvil_setBalance
/**
 * JSON-RPC response for `anvil_setBalance` procedure
 */
export type AnvilSetBalanceJsonRpcResponse = JsonRpcResponse<
	'anvil_setBalance',
	SerializeToJson<AnvilSetBalanceResult>,
	AnvilError
>
// anvil_setCode
/**
 * JSON-RPC response for `anvil_setCode` procedure
 */
export type AnvilSetCodeJsonRpcResponse = JsonRpcResponse<
	'anvil_setCode',
	SerializeToJson<AnvilSetCodeResult>,
	AnvilError
>
// anvil_setNonce
/**
 * JSON-RPC response for `anvil_setNonce` procedure
 */
export type AnvilSetNonceJsonRpcResponse = JsonRpcResponse<
	'anvil_setNonce',
	SerializeToJson<AnvilSetNonceResult>,
	AnvilError
>
// anvil_setStorageAt
/**
 * JSON-RPC response for `anvil_setStorageAt` procedure
 */
export type AnvilSetStorageAtJsonRpcResponse = JsonRpcResponse<
	'anvil_setStorageAt',
	SerializeToJson<AnvilSetStorageAtResult>,
	AnvilError
>
// anvil_setChainId
/**
 * JSON-RPC response for `anvil_setChainId` procedure
 */
export type AnvilSetChainIdJsonRpcResponse = JsonRpcResponse<
	'anvil_setChainId',
	SerializeToJson<AnvilSetChainIdResult>,
	AnvilError
>
// TODO make this the same as our dump state
// anvil_dumpState
/**
 * JSON-RPC response for `anvil_dumpState` procedure
 */
export type AnvilDumpStateJsonRpcResponse = JsonRpcResponse<
	'anvil_dumpState',
	SerializeToJson<AnvilDumpStateResult>,
	AnvilError
>
// TODO make this the same as our load state
// anvil_loadState
/**
 * JSON-RPC response for `anvil_loadState` procedure
 */
export type AnvilLoadStateJsonRpcResponse = JsonRpcResponse<
	'anvil_loadState',
	SerializeToJson<AnvilLoadStateResult>,
	AnvilError
>
// anvil_deal
/**
 * JSON-RPC response for `anvil_deal` procedure
 */
export type AnvilDealJsonRpcResponse = JsonRpcResponse<'anvil_deal', SerializeToJson<AnvilDealResult>, AnvilError>
// anvil_dealErc20
/**
 * JSON-RPC response for `anvil_dealErc20` procedure
 */
export type AnvilDealErc20JsonRpcResponse = JsonRpcResponse<
	'anvil_dealErc20',
	SerializeToJson<AnvilDealErc20Result>,
	AnvilError
>
// anvil_setErc20Allowance
/**
 * JSON-RPC response for `anvil_setErc20Allowance` procedure
 */
export type AnvilSetErc20AllowanceJsonRpcResponse = JsonRpcResponse<
	'anvil_setErc20Allowance',
	SerializeToJson<AnvilSetErc20AllowanceResult>,
	AnvilError
>
// anvil_dropAllTransactions
/**
 * JSON-RPC response for `anvil_dropAllTransactions` procedure
 */
export type AnvilDropAllTransactionsJsonRpcResponse = JsonRpcResponse<
	'anvil_dropAllTransactions',
	SerializeToJson<AnvilDropAllTransactionsResult>,
	AnvilError
>
// anvil_removePoolTransactions
/**
 * JSON-RPC response for `anvil_removePoolTransactions` procedure
 */
export type AnvilRemovePoolTransactionsJsonRpcResponse = JsonRpcResponse<
	'anvil_removePoolTransactions',
	SerializeToJson<AnvilRemovePoolTransactionsResult>,
	AnvilError
>
// anvil_setBlockGasLimit
/**
 * JSON-RPC response for `anvil_setBlockGasLimit` procedure
 */
export type AnvilSetBlockGasLimitJsonRpcResponse = JsonRpcResponse<
	'anvil_setBlockGasLimit',
	SerializeToJson<AnvilSetBlockGasLimitResult>,
	AnvilError
>
// anvil_setNextBlockBaseFeePerGas
/**
 * JSON-RPC response for `anvil_setNextBlockBaseFeePerGas` procedure
 */
export type AnvilSetNextBlockBaseFeePerGasJsonRpcResponse = JsonRpcResponse<
	'anvil_setNextBlockBaseFeePerGas',
	SerializeToJson<AnvilSetNextBlockBaseFeePerGasResult>,
	AnvilError
>
// anvil_setMinGasPrice
/**
 * JSON-RPC response for `anvil_setMinGasPrice` procedure
 */
export type AnvilSetMinGasPriceJsonRpcResponse = JsonRpcResponse<
	'anvil_setMinGasPrice',
	SerializeToJson<AnvilSetMinGasPriceResult>,
	AnvilError
>
// anvil_nodeInfo
/**
 * JSON-RPC response for `anvil_nodeInfo` procedure
 */
export type AnvilNodeInfoJsonRpcResponse = JsonRpcResponse<
	'anvil_nodeInfo',
	SerializeToJson<AnvilNodeInfoResult>,
	AnvilError
>
// anvil_metadata
/**
 * JSON-RPC response for `anvil_metadata` procedure
 */
export type AnvilMetadataJsonRpcResponse = JsonRpcResponse<
	'anvil_metadata',
	SerializeToJson<AnvilMetadataResult>,
	AnvilError
>
// anvil_setRpcUrl
/**
 * JSON-RPC response for `anvil_setRpcUrl` procedure
 */
export type AnvilSetRpcUrlJsonRpcResponse = JsonRpcResponse<'anvil_setRpcUrl', null, AnvilError>
// anvil_setLoggingEnabled
/**
 * JSON-RPC response for `anvil_setLoggingEnabled` procedure
 */
export type AnvilSetLoggingEnabledJsonRpcResponse = JsonRpcResponse<'anvil_setLoggingEnabled', null, AnvilError>
// anvil_addBalance
/**
 * JSON-RPC response for `anvil_addBalance` procedure
 */
export type AnvilAddBalanceJsonRpcResponse = JsonRpcResponse<'anvil_addBalance', null, AnvilError>
// anvil_snapshot
/**
 * JSON-RPC response for `anvil_snapshot` procedure
 */
export type AnvilSnapshotJsonRpcResponse = JsonRpcResponse<
	'anvil_snapshot',
	SerializeToJson<AnvilSnapshotResult>,
	AnvilError
>
// anvil_revert
/**
 * JSON-RPC response for `anvil_revert` procedure
 */
export type AnvilRevertJsonRpcResponse = JsonRpcResponse<'anvil_revert', SerializeToJson<AnvilRevertResult>, AnvilError>
// anvil_increaseTime
/**
 * JSON-RPC response for `anvil_increaseTime` procedure
 */
export type AnvilIncreaseTimeJsonRpcResponse = JsonRpcResponse<
	'anvil_increaseTime',
	SerializeToJson<AnvilIncreaseTimeResult>,
	AnvilError
>
// anvil_setNextBlockTimestamp
/**
 * JSON-RPC response for `anvil_setNextBlockTimestamp` procedure
 */
export type AnvilSetNextBlockTimestampJsonRpcResponse = JsonRpcResponse<
	'anvil_setNextBlockTimestamp',
	SerializeToJson<AnvilSetNextBlockTimestampResult>,
	AnvilError
>
// anvil_setTime
/**
 * JSON-RPC response for `anvil_setTime` procedure
 */
export type AnvilSetTimeJsonRpcResponse = JsonRpcResponse<
	'anvil_setTime',
	SerializeToJson<AnvilSetTimeResult>,
	AnvilError
>
// anvil_setBlockTimestampInterval
/**
 * JSON-RPC response for `anvil_setBlockTimestampInterval` procedure
 */
export type AnvilSetBlockTimestampIntervalJsonRpcResponse = JsonRpcResponse<
	'anvil_setBlockTimestampInterval',
	SerializeToJson<AnvilSetBlockTimestampIntervalResult>,
	AnvilError
>
// anvil_removeBlockTimestampInterval
/**
 * JSON-RPC response for `anvil_removeBlockTimestampInterval` procedure
 */
export type AnvilRemoveBlockTimestampIntervalJsonRpcResponse = JsonRpcResponse<
	'anvil_removeBlockTimestampInterval',
	SerializeToJson<AnvilRemoveBlockTimestampIntervalResult>,
	AnvilError
>
