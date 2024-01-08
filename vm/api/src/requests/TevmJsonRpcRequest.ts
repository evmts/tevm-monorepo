import type { AccountJsonRpcRequest } from './AccountJsonRpcRequest.js'
import type { CallJsonRpcRequest } from './CallJsonRpcRequest.js'
import type { ContractJsonRpcRequest } from './ContractJsonRpcRequest.js'
import type { ScriptJsonRpcRequest } from './ScriptJsonRpcRequest.js'

/**
 * A Tevm JSON-RPC request
 * `tevm_account`, `tevm_call`, `tevm_contract`, `tevm_script`
 */
export type TevmJsonRpcRequest =
	| AccountJsonRpcRequest
	| CallJsonRpcRequest
	| ContractJsonRpcRequest
	| ScriptJsonRpcRequest
