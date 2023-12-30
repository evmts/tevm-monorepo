'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.webSocket = void 0
const request_js_1 = require('../../errors/request.js')
const transport_js_1 = require('../../errors/transport.js')
const rpc_js_1 = require('../../utils/rpc.js')
const createTransport_js_1 = require('./createTransport.js')
function webSocket(url, config = {}) {
	const { key = 'webSocket', name = 'WebSocket JSON-RPC', retryDelay } = config
	return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
		const retryCount = config.retryCount ?? retryCount_
		const timeout = timeout_ ?? config.timeout ?? 10000
		const url_ = url || chain?.rpcUrls.default.webSocket?.[0]
		if (!url_) throw new transport_js_1.UrlRequiredError()
		return (0, createTransport_js_1.createTransport)(
			{
				key,
				name,
				async request({ method, params }) {
					const body = { method, params }
					const socket = await (0, rpc_js_1.getSocket)(url_)
					const { error, result } = await rpc_js_1.rpc.webSocketAsync(socket, {
						body,
						timeout,
					})
					if (error)
						throw new request_js_1.RpcRequestError({
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
					return (0, rpc_js_1.getSocket)(url_)
				},
				async subscribe({ params, onData, onError }) {
					const socket = await (0, rpc_js_1.getSocket)(url_)
					const { result: subscriptionId } = await new Promise(
						(resolve, reject) =>
							rpc_js_1.rpc.webSocket(socket, {
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
								rpc_js_1.rpc.webSocket(socket, {
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
exports.webSocket = webSocket
//# sourceMappingURL=webSocket.js.map
