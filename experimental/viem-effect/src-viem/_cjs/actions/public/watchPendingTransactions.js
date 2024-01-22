'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.watchPendingTransactions = void 0
const observe_js_1 = require('../../utils/observe.js')
const poll_js_1 = require('../../utils/poll.js')
const stringify_js_1 = require('../../utils/stringify.js')
const createPendingTransactionFilter_js_1 = require('./createPendingTransactionFilter.js')
const getFilterChanges_js_1 = require('./getFilterChanges.js')
const uninstallFilter_js_1 = require('./uninstallFilter.js')
function watchPendingTransactions(
	client,
	{
		batch = true,
		onError,
		onTransactions,
		poll: poll_,
		pollingInterval = client.pollingInterval,
	},
) {
	const enablePolling =
		typeof poll_ !== 'undefined' ? poll_ : client.transport.type !== 'webSocket'
	const pollPendingTransactions = () => {
		const observerId = (0, stringify_js_1.stringify)([
			'watchPendingTransactions',
			client.uid,
			batch,
			pollingInterval,
		])
		return (0, observe_js_1.observe)(
			observerId,
			{ onTransactions, onError },
			(emit) => {
				let filter
				const unwatch = (0, poll_js_1.poll)(
					async () => {
						try {
							if (!filter) {
								try {
									filter = await (0,
									createPendingTransactionFilter_js_1.createPendingTransactionFilter)(
										client,
									)
									return
								} catch (err) {
									unwatch()
									throw err
								}
							}
							const hashes = await (0, getFilterChanges_js_1.getFilterChanges)(
								client,
								{ filter },
							)
							if (hashes.length === 0) return
							if (batch) emit.onTransactions(hashes)
							else hashes.forEach((hash) => emit.onTransactions([hash]))
						} catch (err) {
							emit.onError?.(err)
						}
					},
					{
						emitOnBegin: true,
						interval: pollingInterval,
					},
				)
				return async () => {
					if (filter)
						await (0, uninstallFilter_js_1.uninstallFilter)(client, { filter })
					unwatch()
				}
			},
		)
	}
	const subscribePendingTransactions = () => {
		const active = true
		let unsubscribe = () => active === false
		;(async () => {
			try {
				const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
					params: ['newPendingTransactions'],
					onData(data) {
						if (!active) return
						const transaction = data.result
						onTransactions([transaction])
					},
					onError(error) {
						onError?.(error)
					},
				})
				unsubscribe = unsubscribe_
				if (!active) unsubscribe()
			} catch (err) {
				onError?.(err)
			}
		})()
		return unsubscribe
	}
	return enablePolling
		? pollPendingTransactions()
		: subscribePendingTransactions()
}
exports.watchPendingTransactions = watchPendingTransactions
//# sourceMappingURL=watchPendingTransactions.js.map
