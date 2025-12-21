import type { JsonRpcRequest } from '@tevm/jsonrpc'
import type { Address, Hex } from '@tevm/utils'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { AnvilDealParams } from './AnvilParams.js'
import type {
	AnvilDropTransactionParams,
	AnvilDumpStateParams,
	AnvilGetAutomineParams,
	AnvilGetIntervalMiningParams,
	AnvilLoadStateParams,
} from './index.js'

// anvil_impersonateAccount
/**
 * JSON-RPC request for `anvil_impersonateAccount` method
 */
export type AnvilImpersonateAccountJsonRpcRequest = JsonRpcRequest<'anvil_impersonateAccount', readonly [Address]>
// anvil_stopImpersonatingAccount
/**
 * JSON-RPC request for `anvil_stopImpersonatingAccount` method
 */
export type AnvilStopImpersonatingAccountJsonRpcRequest = JsonRpcRequest<
	'anvil_stopImpersonatingAccount',
	readonly [Address]
>
// anvil_autoImpersonateAccount
/**
 * JSON-RPC request for `anvil_autoImpersonateAccount` method
 */
export type AnvilAutoImpersonateAccountJsonRpcRequest = JsonRpcRequest<
	'anvil_autoImpersonateAccount',
	readonly [boolean]
>
// anvil_getAutomine
/**
 * JSON-RPC request for `anvil_getAutomine` method
 */
export type AnvilGetAutomineJsonRpcRequest = JsonRpcRequest<
	'anvil_getAutomine',
	[SerializeToJson<AnvilGetAutomineParams>]
>
// anvil_setAutomine
/**
 * JSON-RPC request for `anvil_setAutomine` method
 */
export type AnvilSetAutomineJsonRpcRequest = JsonRpcRequest<'anvil_setAutomine', readonly [boolean]>
// anvil_setIntervalMining
/**
 * JSON-RPC request for `anvil_setIntervalMining` method
 */
export type AnvilSetIntervalMiningJsonRpcRequest = JsonRpcRequest<'anvil_setIntervalMining', readonly [number]>
// anvil_getIntervalMining
/**
 * JSON-RPC request for `anvil_getIntervalMining` method
 */
export type AnvilGetIntervalMiningJsonRpcRequest = JsonRpcRequest<
	'anvil_getIntervalMining',
	[SerializeToJson<AnvilGetIntervalMiningParams>]
>
// anvil_setCoinbase
/**
 * JSON-RPC request for `anvil_setCoinbase` method
 * Not included atm because tevm_call supports it and i was getting methodNotFound errors trying it in anvil
 */
export type AnvilSetCoinbaseJsonRpcRequest = JsonRpcRequest<'anvil_setCoinbase', readonly [Address]>
// anvil_mine
/**
 * JSON-RPC request for `anvil_mine` method
 */
export type AnvilMineJsonRpcRequest = JsonRpcRequest<'anvil_mine', readonly [blockCount: Hex, interval: Hex]>
// anvil_reset
/**
 * JSON-RPC request for `anvil_reset` method
 */
export type AnvilResetJsonRpcRequest = JsonRpcRequest<'anvil_reset', readonly []>
// anvil_dropTransaction
/**
 * JSON-RPC request for `anvil_dropTransaction` method
 */
export type AnvilDropTransactionJsonRpcRequest = JsonRpcRequest<
	'anvil_dropTransaction',
	[SerializeToJson<AnvilDropTransactionParams>]
>
// anvil_setBalance
/**
 * JSON-RPC request for `anvil_setBalance` method
 */
export type AnvilSetBalanceJsonRpcRequest = JsonRpcRequest<
	'anvil_setBalance',
	readonly [address: Address, balance: Hex]
>
// anvil_setCode
/**
 * JSON-RPC request for `anvil_setCode` method
 */
export type AnvilSetCodeJsonRpcRequest = JsonRpcRequest<
	'anvil_setCode',
	readonly [account: Address, deployedBytecode: Hex]
>
// anvil_setNonce
/**
 * JSON-RPC request for `anvil_setNonce` method
 */
export type AnvilSetNonceJsonRpcRequest = JsonRpcRequest<'anvil_setNonce', readonly [address: Address, nonce: Hex]>
// anvil_setStorageAt
/**
 * JSON-RPC request for `anvil_setStorageAt` method
 */
export type AnvilSetStorageAtJsonRpcRequest = JsonRpcRequest<
	'anvil_setStorageAt',
	[address: Address, slot: Hex, value: Hex]
>
// anvil_setChainId
/**
 * JSON-RPC request for `anvil_setChainId` method
 */
export type AnvilSetChainIdJsonRpcRequest = JsonRpcRequest<'anvil_setChainId', readonly [Hex]>
// TODO make this the same as our dump state
// anvil_dumpState
/**
 * JSON-RPC request for `anvil_dumpState` method
 */
export type AnvilDumpStateJsonRpcRequest = JsonRpcRequest<
	'anvil_dumpState',
	readonly [SerializeToJson<AnvilDumpStateParams>]
>
// TODO make this the same as our load state
// anvil_loadState
/**
 * JSON-RPC request for `anvil_loadState` method
 */
export type AnvilLoadStateJsonRpcRequest = JsonRpcRequest<
	'anvil_loadState',
	readonly [SerializeToJson<AnvilLoadStateParams>]
>
// anvil_deal
/**
 * JSON-RPC request for `anvil_deal` method
 */
export type AnvilDealJsonRpcRequest = JsonRpcRequest<'anvil_deal', [SerializeToJson<AnvilDealParams>]>
// anvil_dealErc20
/**
 * JSON-RPC request for `anvil_dealErc20` method
 */
export type AnvilDealErc20JsonRpcRequest = JsonRpcRequest<
	'anvil_dealErc20',
	readonly [
		{
			erc20: Address
			account: Address
			amount: Hex
		},
	]
>
// anvil_setErc20Allowance
/**
 * JSON-RPC request for `anvil_setErc20Allowance` method
 */
export type AnvilSetErc20AllowanceJsonRpcRequest = JsonRpcRequest<
	'anvil_setErc20Allowance',
	readonly [
		{
			erc20: Address
			owner: Address
			spender: Address
			amount: Hex
		},
	]
>
// anvil_dropAllTransactions
/**
 * JSON-RPC request for `anvil_dropAllTransactions` method
 */
export type AnvilDropAllTransactionsJsonRpcRequest = JsonRpcRequest<'anvil_dropAllTransactions', readonly []>
// anvil_removePoolTransactions
/**
 * JSON-RPC request for `anvil_removePoolTransactions` method
 */
export type AnvilRemovePoolTransactionsJsonRpcRequest = JsonRpcRequest<
	'anvil_removePoolTransactions',
	readonly [Address]
>
// anvil_nodeInfo
/**
 * JSON-RPC request for `anvil_nodeInfo` method
 */
export type AnvilNodeInfoJsonRpcRequest = JsonRpcRequest<'anvil_nodeInfo', []>
// anvil_metadata
/**
 * JSON-RPC request for `anvil_metadata` method
 */
export type AnvilMetadataJsonRpcRequest = JsonRpcRequest<'anvil_metadata', []>
// anvil_setRpcUrl
/**
 * JSON-RPC request for `anvil_setRpcUrl` method
 */
export type AnvilSetRpcUrlJsonRpcRequest = JsonRpcRequest<'anvil_setRpcUrl', readonly [url: string]>
// anvil_setLoggingEnabled
/**
 * JSON-RPC request for `anvil_setLoggingEnabled` method
 */
export type AnvilSetLoggingEnabledJsonRpcRequest = JsonRpcRequest<
	'anvil_setLoggingEnabled',
	readonly [enabled: boolean]
>
// anvil_addBalance
/**
 * JSON-RPC request for `anvil_addBalance` method
 */
export type AnvilAddBalanceJsonRpcRequest = JsonRpcRequest<'anvil_addBalance', readonly [address: Address, amount: Hex]>
// anvil_setBlockGasLimit
/**
 * JSON-RPC request for `anvil_setBlockGasLimit` method
 */
export type AnvilSetBlockGasLimitJsonRpcRequest = JsonRpcRequest<'anvil_setBlockGasLimit', readonly [gasLimit: Hex]>
// anvil_setNextBlockBaseFeePerGas
/**
 * JSON-RPC request for `anvil_setNextBlockBaseFeePerGas` method
 */
export type AnvilSetNextBlockBaseFeePerGasJsonRpcRequest = JsonRpcRequest<
	'anvil_setNextBlockBaseFeePerGas',
	readonly [baseFeePerGas: Hex]
>
// anvil_setMinGasPrice
/**
 * JSON-RPC request for `anvil_setMinGasPrice` method
 */
export type AnvilSetMinGasPriceJsonRpcRequest = JsonRpcRequest<'anvil_setMinGasPrice', readonly [minGasPrice: Hex]>
// anvil_snapshot
/**
 * JSON-RPC request for `anvil_snapshot` method
 */
export type AnvilSnapshotJsonRpcRequest = JsonRpcRequest<'anvil_snapshot', readonly []>
// anvil_revert
/**
 * JSON-RPC request for `anvil_revert` method
 */
export type AnvilRevertJsonRpcRequest = JsonRpcRequest<'anvil_revert', readonly [snapshotId: Hex]>
// anvil_increaseTime
/**
 * JSON-RPC request for `anvil_increaseTime` method
 */
export type AnvilIncreaseTimeJsonRpcRequest = JsonRpcRequest<'anvil_increaseTime', readonly [seconds: Hex]>
// anvil_setNextBlockTimestamp
/**
 * JSON-RPC request for `anvil_setNextBlockTimestamp` method
 */
export type AnvilSetNextBlockTimestampJsonRpcRequest = JsonRpcRequest<
	'anvil_setNextBlockTimestamp',
	readonly [timestamp: Hex]
>
// anvil_setTime
/**
 * JSON-RPC request for `anvil_setTime` method
 */
export type AnvilSetTimeJsonRpcRequest = JsonRpcRequest<'anvil_setTime', readonly [timestamp: Hex]>
// anvil_setBlockTimestampInterval
/**
 * JSON-RPC request for `anvil_setBlockTimestampInterval` method
 */
export type AnvilSetBlockTimestampIntervalJsonRpcRequest = JsonRpcRequest<
	'anvil_setBlockTimestampInterval',
	readonly [interval: Hex]
>
// anvil_removeBlockTimestampInterval
/**
 * JSON-RPC request for `anvil_removeBlockTimestampInterval` method
 */
export type AnvilRemoveBlockTimestampIntervalJsonRpcRequest = JsonRpcRequest<
	'anvil_removeBlockTimestampInterval',
	readonly []
>

export type AnvilJsonRpcRequest =
	| AnvilImpersonateAccountJsonRpcRequest
	| AnvilStopImpersonatingAccountJsonRpcRequest
	| AnvilAutoImpersonateAccountJsonRpcRequest
	| AnvilGetAutomineJsonRpcRequest
	| AnvilSetAutomineJsonRpcRequest
	| AnvilSetIntervalMiningJsonRpcRequest
	| AnvilGetIntervalMiningJsonRpcRequest
	| AnvilMineJsonRpcRequest
	| AnvilResetJsonRpcRequest
	| AnvilDropTransactionJsonRpcRequest
	| AnvilSetBalanceJsonRpcRequest
	| AnvilSetCodeJsonRpcRequest
	| AnvilSetNonceJsonRpcRequest
	| AnvilSetStorageAtJsonRpcRequest
	| AnvilSetChainIdJsonRpcRequest
	| AnvilDumpStateJsonRpcRequest
	| AnvilLoadStateJsonRpcRequest
	| AnvilSetCoinbaseJsonRpcRequest
	| AnvilDealJsonRpcRequest
	| AnvilDealErc20JsonRpcRequest
	| AnvilSetErc20AllowanceJsonRpcRequest
	| AnvilDropAllTransactionsJsonRpcRequest
	| AnvilRemovePoolTransactionsJsonRpcRequest
	| AnvilNodeInfoJsonRpcRequest
	| AnvilMetadataJsonRpcRequest
	| AnvilSetRpcUrlJsonRpcRequest
	| AnvilSetLoggingEnabledJsonRpcRequest
	| AnvilAddBalanceJsonRpcRequest
	| AnvilSetBlockGasLimitJsonRpcRequest
	| AnvilSetNextBlockBaseFeePerGasJsonRpcRequest
	| AnvilSetMinGasPriceJsonRpcRequest
	| AnvilSnapshotJsonRpcRequest
	| AnvilRevertJsonRpcRequest
	| AnvilIncreaseTimeJsonRpcRequest
	| AnvilSetNextBlockTimestampJsonRpcRequest
	| AnvilSetTimeJsonRpcRequest
	| AnvilSetBlockTimestampIntervalJsonRpcRequest
	| AnvilRemoveBlockTimestampIntervalJsonRpcRequest
