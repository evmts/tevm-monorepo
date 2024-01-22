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
} from '../requests/AnvilJsonRpcRequest.js'
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
} from '../responses/AnvilJsonRpcResponse.js'

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
 * Not included atm because tevm_call supports it and i was getting methodNotFound errors trying it in anvil
 */
// anvil_getAutomine
/**
 * JSON-RPC procedure for `anvil_getAutomine`
 */
export type AnvilGetAutomineProcedure = (
	request: AnvilGetAutomineJsonRpcRequest,
) => Promise<AnvilGetAutomineJsonRpcResponse>
// anvil_mine
/**
 * JSON-RPC procedure for `anvil_mine`
 */
export type AnvilMineProcedure = (
	request: AnvilMineJsonRpcRequest,
) => Promise<AnvilMineJsonRpcResponse>
// anvil_reset
/**
 * JSON-RPC procedure for `anvil_reset`
 */
export type AnvilResetProcedure = (
	request: AnvilResetJsonRpcRequest,
) => Promise<AnvilResetJsonRpcResponse>
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
export type AnvilSetCodeProcedure = (
	request: AnvilSetCodeJsonRpcRequest,
) => Promise<AnvilSetCodeJsonRpcResponse>
// anvil_setNonce
/**
 * JSON-RPC procedure for `anvil_setNonce`
 */
export type AnvilSetNonceProcedure = (
	request: AnvilSetNonceJsonRpcRequest,
) => Promise<AnvilSetNonceJsonRpcResponse>
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
export type AnvilDumpStateProcedure = (
	request: AnvilDumpStateJsonRpcRequest,
) => Promise<AnvilDumpStateJsonRpcResponse>
// TODO make this the same as our load state
// anvil_loadState
/**
 * JSON-RPC procedure for `anvil_loadState`
 */
export type AnvilLoadStateProcedure = (
	request: AnvilLoadStateJsonRpcRequest,
) => Promise<AnvilLoadStateJsonRpcResponse>
