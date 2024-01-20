import type { CallJsonRpcRequest } from './CallJsonRpcRequest.js'
import type { ContractJsonRpcRequest } from './ContractJsonRpcRequest.js'
import type { DumpStateJsonRpcRequest } from './DumpStateJsonRpcRequest.js'
import type { GetAccountJsonRpcRequest } from './GetAccountJsonRpcRequest.js'
import type { LoadStateJsonRpcRequest } from './LoadStateJsonRpcRequest.js'
import type { ScriptJsonRpcRequest } from './ScriptJsonRpcRequest.js'
import type { SetAccountJsonRpcRequest } from './SetAccountJsonRpcRequest.js'

/**
 * A Tevm JSON-RPC request
 * `tevm_account`, `tevm_call`, `tevm_contract`, `tevm_script`
 */
export type TevmJsonRpcRequest =
	| GetAccountJsonRpcRequest
	| SetAccountJsonRpcRequest
	| CallJsonRpcRequest
	| ContractJsonRpcRequest
	| ScriptJsonRpcRequest
	| LoadStateJsonRpcRequest
	| DumpStateJsonRpcRequest
