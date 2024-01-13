/**
 * Helper type for creating JSON-RPC request types
 */
export type JsonRpcRequest<TMethod extends string, TParams> = {
	jsonrpc: '2.0'
	method: TMethod
	id?: string | number | null
} & (TParams extends readonly [] ? { params?: TParams } : { params: TParams })
