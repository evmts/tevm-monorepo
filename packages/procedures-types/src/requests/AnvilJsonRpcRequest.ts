import type { SerializeToJson } from '../utils/index.js'
import type {
	AnvilDropTransactionParams,
	AnvilDumpStateParams,
	AnvilGetAutomineParams,
	AnvilImpersonateAccountParams,
	AnvilLoadStateParams,
	AnvilMineParams,
	AnvilResetParams,
	AnvilSetBalanceParams,
	AnvilSetChainIdParams,
	AnvilSetCodeParams,
	AnvilSetNonceParams,
	AnvilSetStorageAtParams,
	AnvilStopImpersonatingAccountParams,
} from '@tevm/actions-types'
import type { JsonRpcRequest } from '@tevm/jsonrpc'

// anvil_impersonateAccount
/**
 * JSON-RPC request for `anvil_impersonateAccount` method
 */
export type AnvilImpersonateAccountJsonRpcRequest = JsonRpcRequest<
	'anvil_impersonateAccount',
	[SerializeToJson<AnvilImpersonateAccountParams>]
>
// anvil_stopImpersonatingAccount
/**
 * JSON-RPC request for `anvil_stopImpersonatingAccount` method
 */
export type AnvilStopImpersonatingAccountJsonRpcRequest = JsonRpcRequest<
	'anvil_stopImpersonatingAccount',
	[SerializeToJson<AnvilStopImpersonatingAccountParams>]
>
// anvil_autoImpersonateAccount
/**
 * JSON-RPC request for `anvil_autoImpersonateAccount` method
 * Not included atm because tevm_call supports it and i was getting methodNotFound errors trying it in anvil
 */
// export type AnvilAutoImpersonateAccountJsonRpcRequest = JsonRpcRequest<
// anvil_getAutomine
/**
 * JSON-RPC request for `anvil_getAutomine` method
 */
export type AnvilGetAutomineJsonRpcRequest = JsonRpcRequest<
	'anvil_getAutomine',
	[SerializeToJson<AnvilGetAutomineParams>]
>
// anvil_mine
/**
 * JSON-RPC request for `anvil_mine` method
 */
export type AnvilMineJsonRpcRequest = JsonRpcRequest<
	'anvil_mine',
	[SerializeToJson<AnvilMineParams>]
>
// anvil_reset
/**
 * JSON-RPC request for `anvil_reset` method
 */
export type AnvilResetJsonRpcRequest = JsonRpcRequest<
	'anvil_reset',
	[SerializeToJson<AnvilResetParams>]
>
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
	[SerializeToJson<AnvilSetBalanceParams>]
>
// anvil_setCode
/**
 * JSON-RPC request for `anvil_setCode` method
 */
export type AnvilSetCodeJsonRpcRequest = JsonRpcRequest<
	'anvil_setCode',
	[SerializeToJson<AnvilSetCodeParams>]
>
// anvil_setNonce
/**
 * JSON-RPC request for `anvil_setNonce` method
 */
export type AnvilSetNonceJsonRpcRequest = JsonRpcRequest<
	'anvil_setNonce',
	[SerializeToJson<AnvilSetNonceParams>]
>
// anvil_setStorageAt
/**
 * JSON-RPC request for `anvil_setStorageAt` method
 */
export type AnvilSetStorageAtJsonRpcRequest = JsonRpcRequest<
	'anvil_setStorageAt',
	[SerializeToJson<AnvilSetStorageAtParams>]
>
// anvil_setChainId
/**
 * JSON-RPC request for `anvil_setChainId` method
 */
export type AnvilSetChainIdJsonRpcRequest = JsonRpcRequest<
	'anvil_setChainId',
	[SerializeToJson<AnvilSetChainIdParams>]
>
// TODO make this the same as our dump state
// anvil_dumpState
/**
 * JSON-RPC request for `anvil_dumpState` method
 */
export type AnvilDumpStateJsonRpcRequest = JsonRpcRequest<
	'anvil_dumpState',
	[SerializeToJson<AnvilDumpStateParams>]
>
// TODO make this the same as our load state
// anvil_loadState
/**
 * JSON-RPC request for `anvil_loadState` method
 */
export type AnvilLoadStateJsonRpcRequest = JsonRpcRequest<
	'anvil_loadState',
	[SerializeToJson<AnvilLoadStateParams>]
>

export type AnvilJsonRpcRequest =
	| AnvilImpersonateAccountJsonRpcRequest
	| AnvilStopImpersonatingAccountJsonRpcRequest
	| AnvilGetAutomineJsonRpcRequest
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
