/**
 * Helper type for creating JSON-RPC request types
 */
export type JsonRpcRequest<TMethod extends string, TParams> = {
	readonly jsonrpc: '2.0'
	readonly method: TMethod
	readonly id?: string | number | null
} & (TParams extends readonly []
	? { readonly params?: TParams }
	: { readonly params: TParams })
