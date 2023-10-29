import {
	HttpRequestError,
	TimeoutError,
	WebSocketRequestError,
} from '../errors/request.js'
import { createBatchScheduler } from './promise/createBatchScheduler.js'
import { withTimeout } from './promise/withTimeout.js'
import { stringify } from './stringify.js'
import { WebSocket } from 'unws'
let id = 0
async function http(url, { body, fetchOptions = {}, timeout = 10000 }) {
	const { headers, method, signal: signal_ } = fetchOptions
	try {
		const response = await withTimeout(
			async ({ signal }) => {
				const response = await fetch(url, {
					...fetchOptions,
					body: Array.isArray(body)
						? stringify(
								body.map((body) => ({
									jsonrpc: '2.0',
									id: body.id ?? id++,
									...body,
								})),
						  )
						: stringify({ jsonrpc: '2.0', id: body.id ?? id++, ...body }),
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
				errorInstance: new TimeoutError({ body, url }),
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
			throw new HttpRequestError({
				body,
				details: stringify(data.error) || response.statusText,
				headers: response.headers,
				status: response.status,
				url,
			})
		}
		return data
	} catch (err) {
		if (err instanceof HttpRequestError) throw err
		if (err instanceof TimeoutError) throw err
		throw new HttpRequestError({
			body,
			details: err.message,
			url,
		})
	}
}
export const socketsCache = /*#__PURE__*/ new Map()
export async function getSocket(url) {
	let socket = socketsCache.get(url)
	// If the socket already exists, return it.
	if (socket) return socket
	const { schedule } = createBatchScheduler({
		id: url,
		fn: async () => {
			const webSocket = new WebSocket(url)
			// Set up a cache for incoming "synchronous" requests.
			const requests = new Map()
			// Set up a cache for subscriptions (eth_subscribe).
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
				socketsCache.delete(url)
				webSocket.removeEventListener('close', onClose)
				webSocket.removeEventListener('message', onMessage)
			}
			// Setup event listeners for RPC & subscription responses.
			webSocket.addEventListener('close', onClose)
			webSocket.addEventListener('message', onMessage)
			// Wait for the socket to open.
			if (webSocket.readyState === WebSocket.CONNECTING) {
				await new Promise((resolve, reject) => {
					if (!webSocket) return
					webSocket.onopen = resolve
					webSocket.onerror = reject
				})
			}
			// Create a new socket instance.
			socket = Object.assign(webSocket, {
				requests,
				subscriptions,
			})
			socketsCache.set(url, socket)
			return [socket]
		},
	})
	const [_, [socket_]] = await schedule()
	return socket_
}
function webSocket(socket, { body, onResponse }) {
	if (
		socket.readyState === socket.CLOSED ||
		socket.readyState === socket.CLOSING
	)
		throw new WebSocketRequestError({
			body,
			url: socket.url,
			details: 'Socket is closed.',
		})
	const id_ = id++
	const callback = ({ data }) => {
		const message = JSON.parse(data)
		if (typeof message.id === 'number' && id_ !== message.id) return
		onResponse?.(message)
		// If we are subscribing to a topic, we want to set up a listener for incoming
		// messages.
		if (body.method === 'eth_subscribe' && typeof message.result === 'string') {
			socket.subscriptions.set(message.result, callback)
		}
		// If we are unsubscribing from a topic, we want to remove the listener.
		if (body.method === 'eth_unsubscribe') {
			socket.subscriptions.delete(body.params?.[0])
		}
	}
	socket.requests.set(id_, callback)
	socket.send(JSON.stringify({ jsonrpc: '2.0', ...body, id: id_ }))
	return socket
}
async function webSocketAsync(socket, { body, timeout = 10000 }) {
	return withTimeout(
		() =>
			new Promise((onResponse) =>
				rpc.webSocket(socket, {
					body,
					onResponse,
				}),
			),
		{
			errorInstance: new TimeoutError({ body, url: socket.url }),
			timeout,
		},
	)
}
///////////////////////////////////////////////////
export const rpc = {
	http,
	webSocket,
	webSocketAsync,
}
//# sourceMappingURL=rpc.js.map
