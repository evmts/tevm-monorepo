import type { AccountJsonRpcRequest } from './AccountJsonRpcRequest.js'
import type { CallJsonRpcRequest } from './CallJsonRpcRequest.js'
import type { ContractJsonRpcRequest } from './ContractJsonRpcRequest.js'
import type { ScriptJsonRpcRequest } from './ScriptJsonRpcRequest.js'

/**
 * Any valid tevm jsonrpc request
 */
export type TevmJsonRpcRequest =
	| AccountJsonRpcRequest
	| CallJsonRpcRequest
	| ContractJsonRpcRequest
	| ScriptJsonRpcRequest
