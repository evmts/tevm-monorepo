import type { JsonRpcRequest } from './JsonRpcRequest.js'
import type { JsonRpcResponse } from './JsonRpcResponse.js'

export type JsonRpcProcedure<
	TMethod extends string,
	TParams,
	TResult,
	TErrorCode extends string,
> = (
	request: JsonRpcRequest<TMethod, TParams>,
) => Promise<JsonRpcResponse<TMethod, TResult, TErrorCode>>
