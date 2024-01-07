import type { JsonRpcRequest, JsonRpcResponse } from '@tevm/api'

export type JsonRpcClient = {
	url: string
	request: (
		request: JsonRpcRequest<any, any>,
	) => Promise<JsonRpcResponse<any, any, any>>
}
