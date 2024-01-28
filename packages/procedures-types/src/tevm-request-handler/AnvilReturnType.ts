import type {
	AnvilDropTransactionJsonRpcResponse,
	AnvilDumpStateJsonRpcResponse,
	AnvilGetAutomineJsonRpcResponse,
	AnvilImpersonateAccountJsonRpcResponse,
	AnvilLoadStateJsonRpcResponse,
	AnvilMineJsonRpcResponse,
	AnvilResetJsonRpcResponse,
	AnvilSetBalanceJsonRpcResponse,
	AnvilSetChainIdJsonRpcResponse,
	AnvilSetCodeJsonRpcResponse,
	AnvilSetNonceJsonRpcResponse,
	AnvilSetStorageAtJsonRpcResponse,
	AnvilStopImpersonatingAccountJsonRpcResponse,
} from '../index.js'

/**
 * A mapping of `anvil_*` method names to their return type
 */
export type AnvilReturnType = {
	anvil_impersonateAccount: AnvilImpersonateAccountJsonRpcResponse
	anvil_stopImpersonatingAccount: AnvilStopImpersonatingAccountJsonRpcResponse
	// anvil_autoImpersonateAccount: AnvilAutoImpersonateAccountJsonRpcResponse,
	anvil_getAutomine: AnvilGetAutomineJsonRpcResponse
	anvil_mine: AnvilMineJsonRpcResponse
	anvil_reset: AnvilResetJsonRpcResponse
	anvil_dropTransaction: AnvilDropTransactionJsonRpcResponse
	anvil_setBalance: AnvilSetBalanceJsonRpcResponse
	anvil_setCode: AnvilSetCodeJsonRpcResponse
	anvil_setNonce: AnvilSetNonceJsonRpcResponse
	anvil_setStorageAt: AnvilSetStorageAtJsonRpcResponse
	anvil_setChainId: AnvilSetChainIdJsonRpcResponse
	anvil_dumpState: AnvilDumpStateJsonRpcResponse
	anvil_loadState: AnvilLoadStateJsonRpcResponse
}
