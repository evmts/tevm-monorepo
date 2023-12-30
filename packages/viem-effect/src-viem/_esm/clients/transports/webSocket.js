import { RpcRequestError } from '../../errors/request.js'
import { UrlRequiredError } from '../../errors/transport.js'
import { getSocket, rpc } from '../../utils/rpc.js'
import { createTransport } from './createTransport.js'
/**
 * @description Creates a WebSocket transport that connects to a JSON-RPC API.
 */
export function webSocket(
	/** URL of the JSON-RPC API. Defaults to the chain's public RPC URL. */
	url,
	config = {},
) {
	const { key = 'webSocket', name = 'WebSocket JSON-RPC', retryDelay } = config
	return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
		const retryCount = config.retryCount ?? retryCount_
		const timeout = timeout_ ?? config.timeout ?? 10000
		const url_ = url || chain?.rpcUrls.default.webSocket?.[0]
		if (!url_) throw new UrlRequiredError()
		return createTransport(
			{
				key,
				name,
				async request({ method, params }) {
					const body = { method, params }
					const socket = await getSocket(url_)
					const { error, result } = await rpc.webSocketAsync(socket, {
						body,
						timeout,
					})
					if (error)
						throw new RpcRequestError({
							body,
							error,
							url: url_,
						})
					return result
				},
				retryCount,
				retryDelay,
				timeout,
				type: 'webSocket',
			},
			{
				getSocket() {
					return getSocket(url_)
				},
				async subscribe({ params, onData, onError }) {
					const socket = await getSocket(url_)
					const { result: subscriptionId } = await new Promise(
						(resolve, reject) =>
							rpc.webSocket(socket, {
								body: {
									method: 'eth_subscribe',
									params,
								},
								onResponse(response) {
									if (response.error) {
										reject(response.error)
										onError?.(response.error)
										return
									}
									if (typeof response.id === 'number') {
										resolve(response)
										return
									}
									if (response.method !== 'eth_subscription') return
									onData(response.params)
								},
							}),
					)
					return {
						subscriptionId,
						async unsubscribe() {
							return new Promise((resolve) =>
								rpc.webSocket(socket, {
									body: {
										method: 'eth_unsubscribe',
										params: [subscriptionId],
									},
									onResponse: resolve,
								}),
							)
						},
					}
				},
			},
		)
	}
}
//# sourceMappingURL=webSocket.js.map
