import type { CallJsonRpcRequest } from '../call/CallJsonRpcRequest.js'
import type { DumpStateJsonRpcRequest } from '../dumpstate/DumpStateJsonRpcRequest.js'
import type { GetAccountJsonRpcRequest } from '../getaccount/GetAccountJsonRpcRequest.js'
import type { LoadStateJsonRpcRequest } from '../loadstate/LoadStateJsonRpcRequest.js'
import type { MineJsonRpcRequest } from '../mine/MineJsonRpcRequest.js'
import type { ScriptJsonRpcRequest } from '../script/ScriptJsonRpcRequest.js'
import type { SetAccountJsonRpcRequest } from '../setaccount/SetAccountJsonRpcRequest.js'

/**
 * A mapping of `tevm_*` method names to their request type
 */
export type TevmRequestType = {
	tevm_call: CallJsonRpcRequest
	tevm_script: ScriptJsonRpcRequest
	tevm_loadState: LoadStateJsonRpcRequest
	tevm_dumpState: DumpStateJsonRpcRequest
	tevm_getAccount: GetAccountJsonRpcRequest
	tevm_setAccount: SetAccountJsonRpcRequest
	tevm_mine: MineJsonRpcRequest
}
