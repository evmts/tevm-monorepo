/***
 * TODO I didn't update any of these jsdocs
 */
import type { Address } from 'abitype'
import type { BlockTag, CallParameters, Chain, Hex } from 'viem'

/**
 * Config params for trace calls
 */
export type TraceParams = {
	/**
	 * The type of tracer
	 * Currently only callTracer supported
	 */
	readonly tracer: 'callTracer' | 'prestateTracer'
	/**
	 * A duration string of decimal numbers that overrides the default timeout of 5 seconds for JavaScript-based tracing calls. Max timeout is "10s". Valid time units are "ns", "us", "ms", "s" each with optional fraction, such as "300ms" or "2s45ms".
	 * @example "10s"
	 */
	readonly timeout?: string
	/**
	 * object to specify configurations for the tracer
	 */
	readonly tracerConfig?: {
		/**
		 * boolean Setting this to true will only trace the main (top-level) call and none of the sub-calls. This avoids extra processing for each call frame if only the top-level call info are required (useful for getting revertReason).
		 */
		readonly onlyTopCall?: boolean
		/**
		 * boolean Setting this to true will disable storage capture. This avoids extra processing for each call frame if storage is not required.
		 */
		readonly disableStorage?: boolean
		/**
		 *
		 */
		readonly enableMemory?: boolean
		/**
		 * boolean Setting this to true will disable stack capture. This avoids extra processing for each call frame if stack is not required.
		 */
		readonly disableStack?: boolean
	}
}

// debug_traceTransaction
/**
 * Params taken by `debug_traceTransaction` handler
 */
export type DebugTraceTransactionParams = TraceParams & {
	/**
	 * The transaction hash
	 */
	transactionHash: Hex
}

// debug_traceCall
/**
 * Params taken by `debug_traceCall` handler
 */
export type DebugTraceCallParams<
	TChain extends Chain | undefined = Chain | undefined,
> = TraceParams & {
	/**
	 * The transaction to debug
	 */
	transaction: CallParameters<TChain>
	/**
	 * Block information
	 */
	block?: BlockTag | Hex | BigInt
}

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
