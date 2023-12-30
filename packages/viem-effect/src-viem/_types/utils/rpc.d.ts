import { WebSocket } from 'unws'
type SuccessResult<T> = {
	method?: never
	result: T
	error?: never
}
type ErrorResult<T> = {
	method?: never
	result?: never
	error: T
}
type Subscription<TResult, TError> = {
	method: 'eth_subscription'
	error?: never
	result?: never
	params: {
		subscription: string
	} & (
		| {
				result: TResult
				error?: never
		  }
		| {
				result?: never
				error: TError
		  }
	)
}
export type RpcRequest = {
	method: string
	params?: any
	id?: number
}
export type RpcResponse<TResult = any, TError = any> = {
	jsonrpc: `${number}`
	id: number
} & (
	| SuccessResult<TResult>
	| ErrorResult<TError>
	| Subscription<TResult, TError>
)
export type HttpOptions<TBody extends RpcRequest | RpcRequest[] = RpcRequest> =
	{
		body: TBody
		fetchOptions?: Omit<RequestInit, 'body'>
		timeout?: number
	}
export type HttpReturnType<
	TBody extends RpcRequest | RpcRequest[] = RpcRequest,
> = TBody extends RpcRequest[] ? RpcResponse[] : RpcResponse
declare function http<TBody extends RpcRequest | RpcRequest[]>(
	url: string,
	{ body, fetchOptions, timeout }: HttpOptions<TBody>,
): Promise<HttpReturnType<TBody>>
type Id = string | number
type CallbackFn = (message: any) => void
type CallbackMap = Map<Id, CallbackFn>
export type Socket = WebSocket & {
	requests: CallbackMap
	subscriptions: CallbackMap
}
export declare const socketsCache: Map<string, Socket>
export declare function getSocket(url: string): Promise<Socket>
export type WebSocketOptions = {
	/** The RPC request body. */
	body: RpcRequest
	/** The callback to invoke on response. */
	onResponse?: (message: RpcResponse) => void
}
export type WebSocketReturnType = Socket
declare function webSocket(
	socket: Socket,
	{ body, onResponse }: WebSocketOptions,
): WebSocketReturnType
export type WebSocketAsyncOptions = {
	/** The RPC request body. */
	body: RpcRequest
	/** The timeout (in ms) for the request. */
	timeout?: number
}
export type WebSocketAsyncReturnType = RpcResponse
declare function webSocketAsync(
	socket: Socket,
	{ body, timeout }: WebSocketAsyncOptions,
): Promise<WebSocketAsyncReturnType>
export declare const rpc: {
	http: typeof http
	webSocket: typeof webSocket
	webSocketAsync: typeof webSocketAsync
}
export {}
//# sourceMappingURL=rpc.d.ts.map
