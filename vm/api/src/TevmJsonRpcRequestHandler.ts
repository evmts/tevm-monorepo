import type {
	AccountJsonRpcResponse,
	CallJsonRpcResponse,
	ScriptJsonRpcResponse,
	TevmJsonRpcRequest,
} from './index.js'

type ReturnType<TRequest extends TevmJsonRpcRequest> = {
	tevm_call: CallJsonRpcResponse
	tevm_script: ScriptJsonRpcResponse
	tevm_account: AccountJsonRpcResponse
}[TRequest['method']]

/**
 * Type of a JSON-RPC request handler for tevm procedures
 * Generic and returns the correct response type for a given request
 */
export type TevmJsonRpcRequestHandler = <TRequest extends TevmJsonRpcRequest>(
	request: TRequest,
) => Promise<ReturnType<TRequest>>
