import type { CallJsonRpcResponse } from '../call/CallJsonRpcResponse.js'
import type { DumpStateJsonRpcResponse } from '../dumpstate/DumpStateJsonRpcResponse.js'
import type { GetAccountJsonRpcResponse } from '../getaccount/GetAccountJsonRpcResponse.js'
import type { LoadStateJsonRpcResponse } from '../loadstate/LoadStateJsonRpcResponse.js'
import type { MineJsonRpcResponse } from '../mine/MineJsonRpcResponse.js'
import type { ScriptJsonRpcResponse } from '../script/ScriptJsonRpcResponse.js'
import type { SetAccountJsonRpcResponse } from '../setaccount/SetAccountJsonRpcResponse.js'

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
