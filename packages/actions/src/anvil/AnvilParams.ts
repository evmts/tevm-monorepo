/***
 * TODO I didn't update any of these jsdocs
 */
import type { Address, Hex } from '../common/index.js'

// anvil_impersonateAccount
/**
 * Params fro `anvil_impersonateAccount` handler
 */
export type AnvilImpersonateAccountParams = {
	/**
	 * The address to impersonate
	 */
	readonly address: Address
}

// anvil_stopImpersonatingAccount
/**
 * Params for `anvil_stopImpersonatingAccount` handler
 */
export type AnvilStopImpersonatingAccountParams = {
	/**
	 * The address to stop impersonating
	 */
	readonly address: Address
}

// anvil_autoImpersonateAccount
/**
 * Params for `anvil_autoImpersonateAccount` handler
 */
export type AnvilAutoImpersonateAccountParams = {
	/**
	 * Whether to enable automatic impersonation of accounts.
	 * When true, all transactions will have their sender automatically impersonated.
	 */
	readonly enabled: boolean
}

// anvil_getAutomine
/**
 * Params for `anvil_getAutomine` handler
 */
export type AnvilGetAutomineParams = {} | undefined | never

// anvil_setAutomine
/**
 * Params for `anvil_setAutomine` handler
 */
export type AnvilSetAutomineParams = {
	/**
	 * Whether to enable or disable automine
	 */
	readonly enabled: boolean
}

// anvil_setIntervalMining
/**
 * Params for `anvil_setIntervalMining` handler
 */
export type AnvilSetIntervalMiningParams = {
	/**
	 * The mining interval in seconds. Set to 0 to disable interval mining.
	 */
	readonly interval: number
}

// anvil_getIntervalMining
/**
 * Params for `anvil_getIntervalMining` handler
 */
export type AnvilGetIntervalMiningParams = {} | undefined | never

// anvil_mine
/**
 * Params for `anvil_mine` handler
 */
export type AnvilMineParams = {
	/**
	 * Number of blocks to mine. Defaults to 1
	 */
	readonly blockCount?: number
	/**
	 * mineing interval
	 */
	readonly interval?: number
}

// anvil_reset
/**
 * Params for `anvil_reset` handler
 */
export type AnvilResetParams = {}

// anvil_dropTransaction
/**
 * Params for `anvil_dropTransaction` handler
 */
export type AnvilDropTransactionParams = {
	/**
	 * The transaction hash
	 */
	readonly transactionHash: Hex
}

// anvil_setBalance
/**
 * Params for `anvil_setBalance` handler
 */
export type AnvilSetBalanceParams = {
	/**
	 * The address to set the balance for
	 */
	readonly address: Address
	/**
	 * The balance to set
	 */
	readonly balance: Hex | BigInt
}

// anvil_setCode
/**
 * Params for `anvil_setCode` handler
 */
export type AnvilSetCodeParams = {
	/**
	 * The address to set the code for
	 */
	readonly address: Address
	/**
	 * The code to set
	 */
	readonly code: Hex
}

// anvil_setNonce
/**
 * Params for `anvil_setNonce` handler
 */
export type AnvilSetNonceParams = {
	/**
	 * The address to set the nonce for
	 */
	readonly address: Address
	/**
	 * The nonce to set
	 */
	readonly nonce: BigInt
}

// anvil_setStorageAt
/**
 * Params for `anvil_setStorageAt` handler
 */
export type AnvilSetStorageAtParams = {
	/**
	 * The address to set the storage for
	 */
	readonly address: Address
	/**
	 * The position in storage to set
	 */
	readonly position: Hex | BigInt
	/**
	 * The value to set
	 */
	readonly value: Hex | BigInt
}

// anvil_setChainId
/**
 * Params for `anvil_setChainId` handler
 */
export type AnvilSetChainIdParams = {
	/**
	 * The chain id to set
	 */
	readonly chainId: number
}

// TODO make this the same as our dump state
// anvil_dumpState
/**
 * Params for `anvil_dumpState` handler
 */
export type AnvilDumpStateParams = {} | undefined | never

// TODO make this the same as our load state
// anvil_loadState
/**
 * Params for `anvil_loadState` handler
 */
export type AnvilLoadStateParams = {
	/**
	 * The state to load
	 */
	readonly state: Record<Hex, Hex>
}

export type AnvilDealParams = {
	/** The address of the ERC20 token to deal */
	erc20?: Address
	/** The owner of the dealt tokens */
	account: Address
	/** The amount of tokens to deal */
	amount: bigint
}

// anvil_dealErc20
/**
 * Params for `anvil_dealErc20` handler
 */
export type AnvilDealErc20Params = {
	/**
	 * The address of the ERC20 token
	 */
	readonly erc20: Address
	/**
	 * The account to set the balance for
	 */
	readonly account: Address
	/**
	 * The amount of tokens to set
	 */
	readonly amount: bigint
}

// anvil_setErc20Allowance
/**
 * Params for `anvil_setErc20Allowance` handler
 */
export type AnvilSetErc20AllowanceParams = {
	/**
	 * The address of the ERC20 token
	 */
	readonly erc20: Address
	/**
	 * The owner of the tokens
	 */
	readonly owner: Address
	/**
	 * The spender to set the allowance for
	 */
	readonly spender: Address
	/**
	 * The allowance amount to set
	 */
	readonly amount: bigint
}

// anvil_nodeInfo
/**
 * Params for `anvil_nodeInfo` handler
 */
export type AnvilNodeInfoParams = {} | undefined | never

// anvil_metadata
/**
 * Params for `anvil_metadata` handler
 */
export type AnvilMetadataParams = {} | undefined | never

// anvil_setRpcUrl
/**
 * Params for `anvil_setRpcUrl` handler
 */
export type AnvilSetRpcUrlParams = {
	/**
	 * The new RPC URL to use for forking
	 */
	readonly url: string
}

// anvil_setLoggingEnabled
/**
 * Params for `anvil_setLoggingEnabled` handler
 */
export type AnvilSetLoggingEnabledParams = {
	/**
	 * Whether to enable logging
	 */
	readonly enabled: boolean
}

// anvil_addBalance
/**
 * Params for `anvil_addBalance` handler
 */
export type AnvilAddBalanceParams = {
	/**
	 * The address to add balance to
	 */
	readonly address: Address
	/**
	 * The amount to add to the balance
	 */
	readonly amount: Hex | BigInt
}

// anvil_dropAllTransactions
/**
 * Params for `anvil_dropAllTransactions` handler
 */
export type AnvilDropAllTransactionsParams = {} | undefined | never

// anvil_removePoolTransactions
/**
 * Params for `anvil_removePoolTransactions` handler
 */
export type AnvilRemovePoolTransactionsParams = {
	/**
	 * The address whose transactions should be removed from the pool
	 */
	readonly address: Address
}

// anvil_snapshot
/**
 * Params for `anvil_snapshot` handler
 */
export type AnvilSnapshotParams = {} | undefined | never

// anvil_revert
/**
 * Params for `anvil_revert` handler
 */
export type AnvilRevertParams = {
	/**
	 * The snapshot ID to revert to
	 */
	readonly snapshotId: Hex
}

// anvil_setBlockGasLimit
/**
 * Params for `anvil_setBlockGasLimit` handler
 */
export type AnvilSetBlockGasLimitParams = {
	/**
	 * The gas limit to set for subsequent blocks
	 */
	readonly gasLimit: bigint
}

// anvil_setNextBlockBaseFeePerGas
/**
 * Params for `anvil_setNextBlockBaseFeePerGas` handler
 */
export type AnvilSetNextBlockBaseFeePerGasParams = {
	/**
	 * The base fee per gas to set for the next block (in wei)
	 * This is only used for EIP-1559 transactions
	 */
	readonly baseFeePerGas: bigint
}

// anvil_setMinGasPrice
/**
 * Params for `anvil_setMinGasPrice` handler
 */
export type AnvilSetMinGasPriceParams = {
	/**
	 * The minimum gas price to accept for transactions (in wei)
	 * Transactions with a gas price below this value will be rejected
	 */
	readonly minGasPrice: bigint
}

// anvil_increaseTime
/**
 * Params for `anvil_increaseTime` handler
 */
export type AnvilIncreaseTimeParams = {
	/**
	 * The number of seconds to increase time by
	 */
	readonly seconds: bigint
}

// anvil_setNextBlockTimestamp
/**
 * Params for `anvil_setNextBlockTimestamp` handler
 */
export type AnvilSetNextBlockTimestampParams = {
	/**
	 * The timestamp to set for the next block
	 */
	readonly timestamp: bigint
}

// anvil_setTime
/**
 * Params for `anvil_setTime` handler
 */
export type AnvilSetTimeParams = {
	/**
	 * The timestamp to set
	 */
	readonly timestamp: bigint
}

// anvil_setBlockTimestampInterval
/**
 * Params for `anvil_setBlockTimestampInterval` handler
 */
export type AnvilSetBlockTimestampIntervalParams = {
	/**
	 * The interval in seconds to add between blocks
	 */
	readonly interval: bigint
}

// anvil_removeBlockTimestampInterval
/**
 * Params for `anvil_removeBlockTimestampInterval` handler
 */
export type AnvilRemoveBlockTimestampIntervalParams = {} | undefined | never
