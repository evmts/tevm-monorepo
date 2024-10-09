import type { JsonRpcRequest } from '@tevm/jsonrpc'
import type { Address, Hex } from '@tevm/utils'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type {
	AnvilDropTransactionParams,
	AnvilDumpStateParams,
	AnvilGetAutomineParams,
	AnvilLoadStateParams,
	AnvilResetParams,
} from './index.js'

// anvil_impersonateAccount
/**
 * JSON-RPC request for `anvil_impersonateAccount` method
 */
export type AnvilImpersonateAccountJsonRpcRequest = JsonRpcRequest<'anvil_impersonateAccount', readonly [Address]>
// anvil_stopImpersonatingAccount
/**
 * JSON-RPC request for `anvil_stopImpersonatingAccount` method
 */
export type AnvilStopImpersonatingAccountJsonRpcRequest = JsonRpcRequest<
	'anvil_stopImpersonatingAccount',
	readonly [Address]
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
// anvil_setCoinbase
/**
 * JSON-RPC request for `anvil_setCoinbase` method
 * Not included atm because tevm_call supports it and i was getting methodNotFound errors trying it in anvil
 */
export type AnvilSetCoinbaseJsonRpcRequest = JsonRpcRequest<'anvil_setCoinbase', readonly [Address]>
// anvil_mine
/**
 * JSON-RPC request for `anvil_mine` method
 */
export type AnvilMineJsonRpcRequest = JsonRpcRequest<'anvil_mine', readonly [blockCount: Hex, interval: Hex]>
// anvil_reset
/**
 * JSON-RPC request for `anvil_reset` method
 */
export type AnvilResetJsonRpcRequest = JsonRpcRequest<'anvil_reset', readonly []>
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
	readonly [address: Address, balance: Hex]
>
// anvil_setCode
/**
 * JSON-RPC request for `anvil_setCode` method
 */
export type AnvilSetCodeJsonRpcRequest = JsonRpcRequest<
	'anvil_setCode',
	readonly [account: Address, deployedBytecode: Hex]
>
// anvil_setNonce
/**
 * JSON-RPC request for `anvil_setNonce` method
 */
export type AnvilSetNonceJsonRpcRequest = JsonRpcRequest<'anvil_setNonce', readonly [address: Address, nonce: Hex]>
// anvil_setStorageAt
/**
 * JSON-RPC request for `anvil_setStorageAt` method
 */
export type AnvilSetStorageAtJsonRpcRequest = JsonRpcRequest<
	'anvil_setStorageAt',
	[address: Address, slot: Hex, value: Hex]
>
// anvil_setChainId
/**
 * JSON-RPC request for `anvil_setChainId` method
 */
export type AnvilSetChainIdJsonRpcRequest = JsonRpcRequest<'anvil_setChainId', readonly [Hex]>
// TODO make this the same as our dump state
// anvil_dumpState
/**
 * JSON-RPC request for `anvil_dumpState` method
 */
export type AnvilDumpStateJsonRpcRequest = JsonRpcRequest<
	'anvil_dumpState',
	readonly [SerializeToJson<AnvilDumpStateParams>]
>
// TODO make this the same as our load state
// anvil_loadState
/**
 * JSON-RPC request for `anvil_loadState` method
 */
export type AnvilLoadStateJsonRpcRequest = JsonRpcRequest<
	'anvil_loadState',
	readonly [SerializeToJson<AnvilLoadStateParams>]
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
	| AnvilSetCoinbaseJsonRpcRequest
