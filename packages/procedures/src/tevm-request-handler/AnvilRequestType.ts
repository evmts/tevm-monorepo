import type {
	AnvilDropTransactionJsonRpcRequest,
	AnvilDumpStateJsonRpcRequest,
	AnvilGetAutomineJsonRpcRequest,
	AnvilImpersonateAccountJsonRpcRequest,
	AnvilLoadStateJsonRpcRequest,
	AnvilMineJsonRpcRequest,
	AnvilResetJsonRpcRequest,
	AnvilSetBalanceJsonRpcRequest,
	AnvilSetChainIdJsonRpcRequest,
	AnvilSetCodeJsonRpcRequest,
	AnvilSetNonceJsonRpcRequest,
	AnvilSetStorageAtJsonRpcRequest,
	AnvilStopImpersonatingAccountJsonRpcRequest,
} from '../requests/index.js'
/**
 * A mapping of `anvil_*` method names to their request type
 */
export type AnvilRequestType = {
	anvil_impersonateAccount: AnvilImpersonateAccountJsonRpcRequest
	anvil_stopImpersonatingAccount: AnvilStopImpersonatingAccountJsonRpcRequest
	// anvil_autoImpersonateAccount: AnviAnvilImpersonateAccountJsonRpcRequest,
	anvil_getAutomine: AnvilGetAutomineJsonRpcRequest
	anvil_mine: AnvilMineJsonRpcRequest
	anvil_reset: AnvilResetJsonRpcRequest
	anvil_dropTransaction: AnvilDropTransactionJsonRpcRequest
	anvil_setBalance: AnvilSetBalanceJsonRpcRequest
	anvil_setCode: AnvilSetCodeJsonRpcRequest
	anvil_setNonce: AnvilSetNonceJsonRpcRequest
	anvil_setStorageAt: AnvilSetStorageAtJsonRpcRequest
	anvil_setChainId: AnvilSetChainIdJsonRpcRequest
	anvil_dumpState: AnvilDumpStateJsonRpcRequest
	anvil_loadState: AnvilLoadStateJsonRpcRequest
}
