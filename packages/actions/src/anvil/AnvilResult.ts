import type { Hex } from '../common/index.js'

// anvil_impersonateAccount
export type AnvilImpersonateAccountResult = null
// anvil_stopImpersonatingAccount
export type AnvilStopImpersonatingAccountResult = null
// anvil_autoImpersonateAccount
export type AnvilAutoImpersonateAccountResult = null
// anvil_getAutomine
export type AnvilGetAutomineResult = boolean
// anvil_setAutomine
export type AnvilSetAutomineResult = null
// anvil_setIntervalMining
export type AnvilSetIntervalMiningResult = null
// anvil_getIntervalMining
export type AnvilGetIntervalMiningResult = number
// anvil_mine
export type AnvilMineResult = null
// anvil_reset
export type AnvilResetResult = null
// anvil_dropTransaction
export type AnvilDropTransactionResult = null
// anvil_setBalance
export type AnvilSetBalanceResult = null
// anvil_setCode
export type AnvilSetCodeResult = null
// anvil_setNonce
export type AnvilSetNonceResult = null
// anvil_setStorageAt
export type AnvilSetStorageAtResult = null
// anvil_setChainId
export type AnvilSetChainIdResult = null
// TODO make this the same as our dump state
// anvil_dumpState
export type AnvilDumpStateResult = Hex
// TODO make this the same as our load state
// anvil_loadState tf
export type AnvilLoadStateResult = null
// anvil_deal
export type AnvilDealResult = {
	errors?: Error[]
}
// anvil_dealErc20
export type AnvilDealErc20Result = {
	errors?: Error[]
} | null
// anvil_setErc20Allowance
export type AnvilSetErc20AllowanceResult = {
	errors?: Error[]
} | null
// anvil_dropAllTransactions
export type AnvilDropAllTransactionsResult = null
// anvil_removePoolTransactions
export type AnvilRemovePoolTransactionsResult = null
// anvil_nodeInfo
export type AnvilNodeInfoResult = {
	/** The current environment (production, staging, etc.) */
	currentBlockNumber: number
	/** The current block timestamp */
	currentBlockTimestamp: number
	/** Whether the node is in fork mode */
	forkUrl?: string
	/** The chain ID */
	chainId: number
	/** The hardfork */
	hardfork: string
	/** The mining configuration */
	miningMode: 'auto' | 'manual'
}
// anvil_metadata
export type AnvilMetadataResult = {
	/** Client version (e.g., "tevm/1.0.0") */
	clientVersion: string
	/** Chain ID */
	chainId: number
	/** Whether the node is in fork mode */
	forked?: {
		/** The URL being forked */
		url: string
		/** The block number the fork was created from */
		blockNumber: number
	}
	/** Snapshots taken (for evm_snapshot/evm_revert) */
	snapshots: Record<string, string>
}
// anvil_setRpcUrl
export type AnvilSetRpcUrlResult = null
// anvil_setLoggingEnabled
export type AnvilSetLoggingEnabledResult = null
// anvil_addBalance
export type AnvilAddBalanceResult = null
// anvil_snapshot
export type AnvilSnapshotResult = Hex
// anvil_revert
export type AnvilRevertResult = boolean
// anvil_setBlockGasLimit
export type AnvilSetBlockGasLimitResult = null
// anvil_setNextBlockBaseFeePerGas
export type AnvilSetNextBlockBaseFeePerGasResult = null
// anvil_setMinGasPrice
export type AnvilSetMinGasPriceResult = null
// anvil_increaseTime
export type AnvilIncreaseTimeResult = Hex
// anvil_setNextBlockTimestamp
export type AnvilSetNextBlockTimestampResult = null
// anvil_setTime
export type AnvilSetTimeResult = Hex
// anvil_setBlockTimestampInterval
export type AnvilSetBlockTimestampIntervalResult = null
// anvil_removeBlockTimestampInterval
export type AnvilRemoveBlockTimestampIntervalResult = boolean
