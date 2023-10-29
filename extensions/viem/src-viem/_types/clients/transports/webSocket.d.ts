import type { Hash } from '../../types/misc.js'
import { type RpcResponse } from '../../utils/rpc.js'
import { type Transport, type TransportConfig } from './createTransport.js'
import type { WebSocket } from 'unws'
type WebSocketTransportSubscribeParameters = {
	onData: (data: RpcResponse) => void
	onError?: (error: any) => void
}
type WebSocketTransportSubscribeReturnType = {
	subscriptionId: Hash
	unsubscribe: () => Promise<RpcResponse<boolean>>
}
type WebSocketTransportSubscribe = {
	subscribe(
		args: WebSocketTransportSubscribeParameters & {
			/**
			 * @description Add information about compiled contracts
			 * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_addcompilationresult
			 */
			params: ['newHeads']
		},
	): Promise<WebSocketTransportSubscribeReturnType>
}
export type WebSocketTransportConfig = {
	/** The key of the WebSocket transport. */
	key?: TransportConfig['key']
	/** The name of the WebSocket transport. */
	name?: TransportConfig['name']
	/** The max number of times to retry. */
	retryCount?: TransportConfig['retryCount']
	/** The base delay (in ms) between retries. */
	retryDelay?: TransportConfig['retryDelay']
	/** The timeout (in ms) for async WebSocket requests. Default: 10_000 */
	timeout?: TransportConfig['timeout']
}
export type WebSocketTransport = Transport<
	'webSocket',
	{
		getSocket(): Promise<WebSocket>
		subscribe: WebSocketTransportSubscribe['subscribe']
	}
>
/**
 * @description Creates a WebSocket transport that connects to a JSON-RPC API.
 */
export declare function webSocket(
	/** URL of the JSON-RPC API. Defaults to the chain's public RPC URL. */
	url?: string,
	config?: WebSocketTransportConfig,
): WebSocketTransport
export {}
//# sourceMappingURL=webSocket.d.ts.map
