import type { TevmJsonRpcRequest } from './index.js'
import type { JsonRpcResponseFromRequest } from './responses/JsonRpcResponseFromRequest.js'

export type TevmJsonRpcRequestHandler = <TRequest extends TevmJsonRpcRequest>(
	request: TRequest,
) => Promise<JsonRpcResponseFromRequest<TRequest>>
