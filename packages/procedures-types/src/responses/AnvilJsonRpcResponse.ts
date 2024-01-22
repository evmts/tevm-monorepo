// debug_traceTransaction

import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type {
	AnvilDropTransactionResult,
	AnvilDumpStateResult,
	AnvilGetAutomineResult,
	AnvilImpersonateAccountResult,
	AnvilLoadStateResult,
	AnvilMineResult,
	AnvilResetResult,
	AnvilSetBalanceResult,
	AnvilSetChainIdResult,
	AnvilSetCodeResult,
	AnvilSetNonceResult,
	AnvilSetStorageAtResult,
	AnvilStopImpersonatingAccountResult,
} from '@tevm/actions-types'
import type { JsonRpcResponse } from '@tevm/jsonrpc'

// TODO type the errors strongly
type AnvilError = string

// anvil_impersonateAccount
/**
 * JSON-RPC response for `anvil_impersonateAccount` procedure
 */
export type AnvilImpersonateAccountJsonRpcResponse = JsonRpcResponse<
	'anvil_impersonateAccount',
	SerializeToJson<AnvilImpersonateAccountResult>,
	AnvilError
>
// anvil_stopImpersonatingAccount
/**
 * JSON-RPC response for `anvil_stopImpersonatingAccount` procedure
 */
export type AnvilStopImpersonatingAccountJsonRpcResponse = JsonRpcResponse<
	'anvil_stopImpersonatingAccount',
	SerializeToJson<AnvilStopImpersonatingAccountResult>,
	AnvilError
>
// anvil_autoImpersonateAccount
/**
 * JSON-RPC response for `anvil_autoImpersonateAccount` procedure
 * Not included atm because tevm_call supports it and i was getting methodNotFound errors trying it in anvil
 */
// export type AnvilAutoImpersonateAccountJsonRpcResponse = JsonRpcResponse<
// anvil_getAutomine
/**
 * JSON-RPC response for `anvil_getAutomine` procedure
 */
export type AnvilGetAutomineJsonRpcResponse = JsonRpcResponse<
	'anvil_getAutomine',
	SerializeToJson<AnvilGetAutomineResult>,
	AnvilError
>
// anvil_mine
/**
 * JSON-RPC response for `anvil_mine` procedure
 */
export type AnvilMineJsonRpcResponse = JsonRpcResponse<
	'anvil_mine',
	SerializeToJson<AnvilMineResult>,
	AnvilError
>
// anvil_reset
/**
 * JSON-RPC response for `anvil_reset` procedure
 */
export type AnvilResetJsonRpcResponse = JsonRpcResponse<
	'anvil_reset',
	SerializeToJson<AnvilResetResult>,
	AnvilError
>
// anvil_dropTransaction
/**
 * JSON-RPC response for `anvil_dropTransaction` procedure
 */
export type AnvilDropTransactionJsonRpcResponse = JsonRpcResponse<
	'anvil_dropTransaction',
	SerializeToJson<AnvilDropTransactionResult>,
	AnvilError
>
// anvil_setBalance
/**
 * JSON-RPC response for `anvil_setBalance` procedure
 */
export type AnvilSetBalanceJsonRpcResponse = JsonRpcResponse<
	'anvil_setBalance',
	SerializeToJson<AnvilSetBalanceResult>,
	AnvilError
>
// anvil_setCode
/**
 * JSON-RPC response for `anvil_setCode` procedure
 */
export type AnvilSetCodeJsonRpcResponse = JsonRpcResponse<
	'anvil_setCode',
	SerializeToJson<AnvilSetCodeResult>,
	AnvilError
>
// anvil_setNonce
/**
 * JSON-RPC response for `anvil_setNonce` procedure
 */
export type AnvilSetNonceJsonRpcResponse = JsonRpcResponse<
	'anvil_setNonce',
	SerializeToJson<AnvilSetNonceResult>,
	AnvilError
>
// anvil_setStorageAt
/**
 * JSON-RPC response for `anvil_setStorageAt` procedure
 */
export type AnvilSetStorageAtJsonRpcResponse = JsonRpcResponse<
	'anvil_setStorageAt',
	SerializeToJson<AnvilSetStorageAtResult>,
	AnvilError
>
// anvil_setChainId
/**
 * JSON-RPC response for `anvil_setChainId` procedure
 */
export type AnvilSetChainIdJsonRpcResponse = JsonRpcResponse<
	'anvil_setChainId',
	SerializeToJson<AnvilSetChainIdResult>,
	AnvilError
>
// TODO make this the same as our dump state
// anvil_dumpState
/**
 * JSON-RPC response for `anvil_dumpState` procedure
 */
export type AnvilDumpStateJsonRpcResponse = JsonRpcResponse<
	'anvil_dumpState',
	SerializeToJson<AnvilDumpStateResult>,
	AnvilError
>
// TODO make this the same as our load state
// anvil_loadState
/**
 * JSON-RPC response for `anvil_loadState` procedure
 */
export type AnvilLoadStateJsonRpcResponse = JsonRpcResponse<
	'anvil_loadState',
	SerializeToJson<AnvilLoadStateResult>,
	AnvilError
>
