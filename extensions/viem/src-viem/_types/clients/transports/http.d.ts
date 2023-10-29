import { type HttpOptions } from '../../utils/rpc.js'
import { type Transport, type TransportConfig } from './createTransport.js'
export type BatchOptions = {
	/** The maximum number of JSON-RPC requests to send in a batch. @default 1_000 */
	batchSize?: number
	/** The maximum number of milliseconds to wait before sending a batch. @default 0 */
	wait?: number
}
export type HttpTransportConfig = {
	/**
	 * Whether to enable Batch JSON-RPC.
	 * @link https://www.jsonrpc.org/specification#batch
	 */
	batch?: boolean | BatchOptions
	/**
	 * Request configuration to pass to `fetch`.
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/fetch
	 */
	fetchOptions?: HttpOptions['fetchOptions']
	/** The key of the HTTP transport. */
	key?: TransportConfig['key']
	/** The name of the HTTP transport. */
	name?: TransportConfig['name']
	/** The max number of times to retry. */
	retryCount?: TransportConfig['retryCount']
	/** The base delay (in ms) between retries. */
	retryDelay?: TransportConfig['retryDelay']
	/** The timeout (in ms) for the HTTP request. Default: 10_000 */
	timeout?: TransportConfig['timeout']
}
export type HttpTransport = Transport<
	'http',
	{
		url?: string
	}
>
/**
 * @description Creates a HTTP transport that connects to a JSON-RPC API.
 */
export declare function http(
	/** URL of the JSON-RPC API. Defaults to the chain's public RPC URL. */
	url?: string,
	config?: HttpTransportConfig,
): HttpTransport
//# sourceMappingURL=http.d.ts.map
