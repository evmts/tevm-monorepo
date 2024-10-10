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
 * Not included atm because tevm_call supports it and i was getting methodNotFound errors trying it in anvil
 */
// export type AnvilAutoImpersonateAccountParams = {} | undefined | never

// anvil_getAutomine
/**
 * Params for `anvil_getAutomine` handler
 */
export type AnvilGetAutomineParams = {} | undefined | never

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
