/**
 * Helper type for creating JSON-RPC request types
 */
export type JsonRpcRequest<TMethod extends string, TParams> = {
	params: TParams
	jsonrpc: '2.0'
	method: TMethod
	id?: string | number | null
}
