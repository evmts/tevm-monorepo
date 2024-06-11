import type {
	CallJsonRpcResponse,
	GetAccountJsonRpcResponse,
	LoadStateJsonRpcResponse,
	ScriptJsonRpcResponse,
	SetAccountJsonRpcResponse,
} from '../index.js'
import type { DumpStateJsonRpcResponse } from '../responses/DumpStateJsonRpcResponse.js'
import type { MineJsonRpcResponse } from '../responses/MineJsonRpcResponse.js'

/**
 * A mapping of `tevm_*` method names to their return type
 */
export type TevmReturnType = {
	tevm_call: CallJsonRpcResponse
	tevm_script: ScriptJsonRpcResponse
	tevm_loadState: LoadStateJsonRpcResponse
	tevm_dumpState: DumpStateJsonRpcResponse
	tevm_getAccount: GetAccountJsonRpcResponse
	tevm_setAccount: SetAccountJsonRpcResponse
	tevm_mine: MineJsonRpcResponse
}
