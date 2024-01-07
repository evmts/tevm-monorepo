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

export type TevmJsonRpcRequestHandler = <TRequest extends TevmJsonRpcRequest>(
	request: TRequest,
) => Promise<ReturnType<TRequest>>
