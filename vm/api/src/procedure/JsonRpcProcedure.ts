import type { JsonRpcRequest, JsonRpcResponse } from '../index.js'

export type JsonRpcProcedure<
	TMethod extends string,
	TParams,
	TResult,
	TErrorCode extends string,
	TRequest extends JsonRpcRequest<TMethod, TParams> = JsonRpcRequest<
		TMethod,
		TParams
	>,
	TResponse extends JsonRpcResponse<
		TMethod,
		TResult,
		TErrorCode
	> = JsonRpcResponse<TMethod, TResult, TErrorCode>,
> = (request: TRequest) => Promise<TResponse>
