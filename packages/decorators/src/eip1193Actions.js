import { createEventEmitter } from './createEventEmitter.js'

/**
 * @returns {import('@tevm/base-client').Extension<import('./providers/BaseProvider.js').BaseProvider>}
 */
export const eip1993Actions = () => (client) => {
	const eventEmitter = createEventEmitter()

	const requestHandlers = {
		tevm_mode: () => client.mode,
		eth_chainId: () => client.chainId
	}

	/**
	 * @type {import('./providers/BaseProvider.js').BaseProvider}
	 */
	const decoratedClient = {
		request(args) {
			const handler = requestHandlers[args.method]
			if (!handler && 'request' in client && typeof client.request === 'function') {
				return client.request(args)
			}
			if (!handler) {
				throw new Error(`Method ${args.method} not supported`)
			}
			return /** @type any*/(handler())
		},
		on(eventName, listener) {
			eventEmitter.on(eventName, listener)
			return decoratedClient
		},
		removeListener(eventName, listener) {
			eventEmitter.removeListener(eventName, listener)
			return decoratedClient
		},
	}

	setTimeout(() => {
		eventEmitter.emit('connect')
	}, 0)

	return decoratedClient
}
