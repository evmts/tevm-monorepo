import type {
	CallJsonRpcRequest,
	DumpStateJsonRpcRequest,
	GetAccountJsonRpcRequest,
	LoadStateJsonRpcRequest,
	ScriptJsonRpcRequest,
	SetAccountJsonRpcRequest,
} from '../requests/index.js'

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
}
