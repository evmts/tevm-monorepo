import type {
	ScriptJsonRpcRequest,
	ScriptJsonRpcResponse,
} from '../index.js'

export type ScriptJsonRpcProcedure = (request: ScriptJsonRpcRequest) => Promise<ScriptJsonRpcResponse>
