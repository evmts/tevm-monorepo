import type { CallJsonRpcRequest } from './call/CallJsonRpcRequest.js'
import type { DumpStateJsonRpcRequest } from './dumpstate/DumpStateJsonRpcRequest.js'
import type { GetAccountJsonRpcRequest } from './getaccount/GetAccountJsonRpcRequest.js'
import type { LoadStateJsonRpcRequest } from './loadstate/LoadStateJsonRpcRequest.js'
import type { MineJsonRpcRequest } from './mine/MineJsonRpcRequest.js'
import type { ScriptJsonRpcRequest } from './script/ScriptJsonRpcRequest.js'
import type { SetAccountJsonRpcRequest } from './setaccount/SetAccountJsonRpcRequest.js'

/**
 * A Tevm JSON-RPC request
 * `tevm_account`, `tevm_call`, `tevm_contract`, `tevm_script`
 */
export type TevmJsonRpcRequest =
	| GetAccountJsonRpcRequest
	| SetAccountJsonRpcRequest
	| CallJsonRpcRequest
	| ScriptJsonRpcRequest
	| LoadStateJsonRpcRequest
	| DumpStateJsonRpcRequest
	| MineJsonRpcRequest
