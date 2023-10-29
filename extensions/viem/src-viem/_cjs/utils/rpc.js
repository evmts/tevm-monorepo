'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.rpc = exports.getSocket = exports.socketsCache = void 0
const unws_1 = require('unws')
const request_js_1 = require('../errors/request.js')
const createBatchScheduler_js_1 = require('./promise/createBatchScheduler.js')
const withTimeout_js_1 = require('./promise/withTimeout.js')
const stringify_js_1 = require('./stringify.js')
let id = 0
async function http(url, { body, fetchOptions = {}, timeout = 10000 }) {
	const { headers, method, signal: signal_ } = fetchOptions
	try {
		const response = await (0, withTimeout_js_1.withTimeout)(
			async ({ signal }) => {
				const response = await fetch(url, {
					...fetchOptions,
					body: Array.isArray(body)
						? (0, stringify_js_1.stringify)(
								body.map((body) => ({
									jsonrpc: '2.0',
									id: body.id ?? id++,
									...body,
								})),
						  )
						: (0, stringify_js_1.stringify)({
								jsonrpc: '2.0',
								id: body.id ?? id++,
								...body,
						  }),
					headers: {
						...headers,
						'Content-Type': 'application/json',
					},
					method: method || 'POST',
					signal: signal_ || (timeout > 0 ? signal : undefined),
				})
				return response
			},
			{
				errorInstance: new request_js_1.TimeoutError({ body, url }),
				timeout,
				signal: true,
			},
		)
		let data
		if (response.headers.get('Content-Type')?.startsWith('application/json')) {
			data = await response.json()
		} else {
			data = await response.text()
		}
		if (!response.ok) {
			throw new request_js_1.HttpRequestError({
				body,
				details:
					(0, stringify_js_1.stringify)(data.error) || response.statusText,
				headers: response.headers,
				status: response.status,
				url,
			})
		}
		return data
	} catch (err) {
		if (err instanceof request_js_1.HttpRequestError) throw err
		if (err instanceof request_js_1.TimeoutError) throw err
		throw new request_js_1.HttpRequestError({
			body,
			details: err.message,
			url,
		})
	}
}
exports.socketsCache = new Map()
async function getSocket(url) {
	let socket = exports.socketsCache.get(url)
	if (socket) return socket
	const { schedule } = (0, createBatchScheduler_js_1.createBatchScheduler)({
		id: url,
		fn: async () => {
			const webSocket = new unws_1.WebSocket(url)
			const requests = new Map()
			const subscriptions = new Map()
			const onMessage = ({ data }) => {
				const message = JSON.parse(data)
				const isSubscription = message.method === 'eth_subscription'
				const id = isSubscription ? message.params.subscription : message.id
				const cache = isSubscription ? subscriptions : requests
				const callback = cache.get(id)
				if (callback) callback({ data })
				if (!isSubscription) cache.delete(id)
			}
			const onClose = () => {
				exports.socketsCache.delete(url)
				webSocket.removeEventListener('close', onClose)
				webSocket.removeEventListener('message', onMessage)
			}
			webSocket.addEventListener('close', onClose)
			webSocket.addEventListener('message', onMessage)
			if (webSocket.readyState === unws_1.WebSocket.CONNECTING) {
				await new Promise((resolve, reject) => {
					if (!webSocket) return
					webSocket.onopen = resolve
					webSocket.onerror = reject
				})
			}
			socket = Object.assign(webSocket, {
				requests,
				subscriptions,
			})
			exports.socketsCache.set(url, socket)
			return [socket]
		},
	})
	const [_, [socket_]] = await schedule()
	return socket_
}
exports.getSocket = getSocket
function webSocket(socket, { body, onResponse }) {
	if (
		socket.readyState === socket.CLOSED ||
		socket.readyState === socket.CLOSING
	)
		throw new request_js_1.WebSocketRequestError({
			body,
			url: socket.url,
			details: 'Socket is closed.',
		})
	const id_ = id++
	const callback = ({ data }) => {
		const message = JSON.parse(data)
		if (typeof message.id === 'number' && id_ !== message.id) return
		onResponse?.(message)
		if (body.method === 'eth_subscribe' && typeof message.result === 'string') {
			socket.subscriptions.set(message.result, callback)
		}
		if (body.method === 'eth_unsubscribe') {
			socket.subscriptions.delete(body.params?.[0])
		}
	}
	socket.requests.set(id_, callback)
	socket.send(JSON.stringify({ jsonrpc: '2.0', ...body, id: id_ }))
	return socket
}
async function webSocketAsync(socket, { body, timeout = 10000 }) {
	return (0, withTimeout_js_1.withTimeout)(
		() =>
			new Promise((onResponse) =>
				exports.rpc.webSocket(socket, {
					body,
					onResponse,
				}),
			),
		{
			errorInstance: new request_js_1.TimeoutError({ body, url: socket.url }),
			timeout,
		},
	)
}
exports.rpc = {
	http,
	webSocket,
	webSocketAsync,
}
//# sourceMappingURL=rpc.js.map
