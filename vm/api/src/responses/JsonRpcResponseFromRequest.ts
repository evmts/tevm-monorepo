import type {
	AccountJsonRpcRequest,
	AccountJsonRpcResponse,
	CallJsonRpcRequest,
	CallJsonRpcResponse,
	ContractJsonRpcRequest,
	ContractJsonRpcResponse,
	ScriptJsonRpcRequest,
	ScriptJsonRpcResponse,
	TevmJsonRpcRequest,
} from '../index.js'

/**
 * Correctly types a JSON-RPC response based on the request.
 */
export type JsonRpcResponseFromRequest<T extends TevmJsonRpcRequest> =
	T extends Pick<CallJsonRpcRequest, 'method'>
		? CallJsonRpcResponse
		: T extends Pick<ContractJsonRpcRequest, 'method'>
		? ContractJsonRpcResponse<
				T['params']['abi'],
				T['params']['functionName'] & string
		  >
		: T extends Pick<AccountJsonRpcRequest, 'method'>
		? AccountJsonRpcResponse
		: T extends Pick<ScriptJsonRpcRequest, 'method'>
		? ScriptJsonRpcResponse<
				T['params']['abi'],
				T['params']['functionName'] & string
		  >
		: never
