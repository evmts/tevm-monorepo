'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.watchEvent = void 0
const observe_js_1 = require('../../utils/observe.js')
const poll_js_1 = require('../../utils/poll.js')
const stringify_js_1 = require('../../utils/stringify.js')
const abi_js_1 = require('../../errors/abi.js')
const rpc_js_1 = require('../../errors/rpc.js')
const index_js_1 = require('../../utils/index.js')
const createEventFilter_js_1 = require('./createEventFilter.js')
const getBlockNumber_js_1 = require('./getBlockNumber.js')
const getFilterChanges_js_1 = require('./getFilterChanges.js')
const getLogs_js_1 = require('./getLogs.js')
const uninstallFilter_js_1 = require('./uninstallFilter.js')
function watchEvent(
	client,
	{
		address,
		args,
		batch = true,
		event,
		events,
		onError,
		onLogs,
		poll: poll_,
		pollingInterval = client.pollingInterval,
		strict: strict_,
	},
) {
	const enablePolling =
		typeof poll_ !== 'undefined' ? poll_ : client.transport.type !== 'webSocket'
	const strict = strict_ ?? false
	const pollEvent = () => {
		const observerId = (0, stringify_js_1.stringify)([
			'watchEvent',
			address,
			args,
			batch,
			client.uid,
			event,
			pollingInterval,
		])
		return (0, observe_js_1.observe)(
			observerId,
			{ onLogs, onError },
			(emit) => {
				let previousBlockNumber
				let filter
				let initialized = false
				const unwatch = (0, poll_js_1.poll)(
					async () => {
						if (!initialized) {
							try {
								filter = await (0, createEventFilter_js_1.createEventFilter)(
									client,
									{
										address,
										args,
										event: event,
										events,
										strict,
									},
								)
							} catch {}
							initialized = true
							return
						}
						try {
							let logs
							if (filter) {
								logs = await (0, getFilterChanges_js_1.getFilterChanges)(
									client,
									{ filter },
								)
							} else {
								const blockNumber = await (0,
								getBlockNumber_js_1.getBlockNumber)(client)
								if (
									previousBlockNumber &&
									previousBlockNumber !== blockNumber
								) {
									logs = await (0, getLogs_js_1.getLogs)(client, {
										address,
										args,
										event: event,
										events,
										fromBlock: previousBlockNumber + 1n,
										toBlock: blockNumber,
									})
								} else {
									logs = []
								}
								previousBlockNumber = blockNumber
							}
							if (logs.length === 0) return
							if (batch) emit.onLogs(logs)
							else logs.forEach((log) => emit.onLogs([log]))
						} catch (err) {
							if (filter && err instanceof rpc_js_1.InvalidInputRpcError)
								initialized = false
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
	const subscribeEvent = () => {
		const active = true
		let unsubscribe = () => active === false
		;(async () => {
			try {
				const events_ = events ?? (event ? [event] : undefined)
				let topics = []
				if (events_) {
					topics = [
						events_.flatMap((event) =>
							(0, index_js_1.encodeEventTopics)({
								abi: [event],
								eventName: event.name,
								args,
							}),
						),
					]
					if (event) topics = topics[0]
				}
				const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
					params: ['logs', { address, topics }],
					onData(data) {
						if (!active) return
						const log = data.result
						try {
							const { eventName, args } = (0, index_js_1.decodeEventLog)({
								abi: events_,
								data: log.data,
								topics: log.topics,
								strict,
							})
							const formatted = (0, index_js_1.formatLog)(log, {
								args,
								eventName: eventName,
							})
							onLogs([formatted])
						} catch (err) {
							let eventName
							let isUnnamed
							if (
								err instanceof abi_js_1.DecodeLogDataMismatch ||
								err instanceof abi_js_1.DecodeLogTopicsMismatch
							) {
								if (strict_) return
								eventName = err.abiItem.name
								isUnnamed = err.abiItem.inputs?.some(
									(x) => !('name' in x && x.name),
								)
							}
							const formatted = (0, index_js_1.formatLog)(log, {
								args: isUnnamed ? [] : {},
								eventName,
							})
							onLogs([formatted])
						}
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
	return enablePolling ? pollEvent() : subscribeEvent()
}
exports.watchEvent = watchEvent
//# sourceMappingURL=watchEvent.js.map
