/***
 * TODO I didn't update any of these jsdocs
 */
import type { Address, BlockTag, Hex } from '../common/index.js'

// anvil_impersonateAccount
/**
 * Params fro `anvil_impersonateAccount` handler
 */
export type AnvilImpersonateAccountParams = {
	/**
	 * The address to impersonate
	 */
	address: Address
}

// anvil_stopImpersonatingAccount
/**
 * Params for `anvil_stopImpersonatingAccount` handler
 */
export type AnvilStopImpersonatingAccountParams = {
	/**
	 * The address to stop impersonating
	 */
	address: Address
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
	blockCount?: number
	/**
	 * mineing interval
	 */
	interval?: number
}

// anvil_reset
/**
 * Params for `anvil_reset` handler
 */
export type AnvilResetParams = {
	fork: {
		/**
		 * The url to fork if forking
		 */
		url?: string
		/**
		 * The block number
		 */
		block?: BlockTag | Hex | BigInt
	}
}

// anvil_dropTransaction
/**
 * Params for `anvil_dropTransaction` handler
 */
export type AnvilDropTransactionParams = {
	/**
	 * The transaction hash
	 */
	transactionHash: Hex
}

// anvil_setBalance
/**
 * Params for `anvil_setBalance` handler
 */
export type AnvilSetBalanceParams = {
	/**
	 * The address to set the balance for
	 */
	address: Address
	/**
	 * The balance to set
	 */
	balance: Hex | BigInt
}

// anvil_setCode
/**
 * Params for `anvil_setCode` handler
 */
export type AnvilSetCodeParams = {
	/**
	 * The address to set the code for
	 */
	address: Address
	/**
	 * The code to set
	 */
	code: Hex
}

// anvil_setNonce
/**
 * Params for `anvil_setNonce` handler
 */
export type AnvilSetNonceParams = {
	/**
	 * The address to set the nonce for
	 */
	address: Address
	/**
	 * The nonce to set
	 */
	nonce: BigInt
}

// anvil_setStorageAt
/**
 * Params for `anvil_setStorageAt` handler
 */
export type AnvilSetStorageAtParams = {
	/**
	 * The address to set the storage for
	 */
	address: Address
	/**
	 * The position in storage to set
	 */
	position: Hex | BigInt
	/**
	 * The value to set
	 */
	value: Hex | BigInt
}

// anvil_setChainId
/**
 * Params for `anvil_setChainId` handler
 */
export type AnvilSetChainIdParams = {
	/**
	 * The chain id to set
	 */
	chainId: number
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
	state: Record<Hex, Hex>
}
