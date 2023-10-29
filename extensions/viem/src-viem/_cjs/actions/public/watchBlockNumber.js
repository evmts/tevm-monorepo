'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.watchBlockNumber = void 0
const fromHex_js_1 = require('../../utils/encoding/fromHex.js')
const observe_js_1 = require('../../utils/observe.js')
const poll_js_1 = require('../../utils/poll.js')
const stringify_js_1 = require('../../utils/stringify.js')
const getBlockNumber_js_1 = require('./getBlockNumber.js')
function watchBlockNumber(
	client,
	{
		emitOnBegin = false,
		emitMissed = false,
		onBlockNumber,
		onError,
		poll: poll_,
		pollingInterval = client.pollingInterval,
	},
) {
	const enablePolling =
		typeof poll_ !== 'undefined' ? poll_ : client.transport.type !== 'webSocket'
	let prevBlockNumber
	const pollBlockNumber = () => {
		const observerId = (0, stringify_js_1.stringify)([
			'watchBlockNumber',
			client.uid,
			emitOnBegin,
			emitMissed,
			pollingInterval,
		])
		return (0, observe_js_1.observe)(
			observerId,
			{ onBlockNumber, onError },
			(emit) =>
				(0, poll_js_1.poll)(
					async () => {
						try {
							const blockNumber = await (0, getBlockNumber_js_1.getBlockNumber)(
								client,
								{ cacheTime: 0 },
							)
							if (prevBlockNumber) {
								if (blockNumber === prevBlockNumber) return
								if (blockNumber - prevBlockNumber > 1 && emitMissed) {
									for (let i = prevBlockNumber + 1n; i < blockNumber; i++) {
										emit.onBlockNumber(i, prevBlockNumber)
										prevBlockNumber = i
									}
								}
							}
							if (!prevBlockNumber || blockNumber > prevBlockNumber) {
								emit.onBlockNumber(blockNumber, prevBlockNumber)
								prevBlockNumber = blockNumber
							}
						} catch (err) {
							emit.onError?.(err)
						}
					},
					{
						emitOnBegin,
						interval: pollingInterval,
					},
				),
		)
	}
	const subscribeBlockNumber = () => {
		const active = true
		let unsubscribe = () => active === false
		;(async () => {
			try {
				const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
					params: ['newHeads'],
					onData(data) {
						if (!active) return
						const blockNumber = (0, fromHex_js_1.hexToBigInt)(
							data.result?.number,
						)
						onBlockNumber(blockNumber, prevBlockNumber)
						prevBlockNumber = blockNumber
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
	return enablePolling ? pollBlockNumber() : subscribeBlockNumber()
}
exports.watchBlockNumber = watchBlockNumber
//# sourceMappingURL=watchBlockNumber.js.map
