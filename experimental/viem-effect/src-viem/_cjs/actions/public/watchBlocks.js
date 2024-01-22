'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.watchBlocks = void 0
const block_js_1 = require('../../utils/formatters/block.js')
const observe_js_1 = require('../../utils/observe.js')
const poll_js_1 = require('../../utils/poll.js')
const stringify_js_1 = require('../../utils/stringify.js')
const getBlock_js_1 = require('./getBlock.js')
function watchBlocks(
	client,
	{
		blockTag = 'latest',
		emitMissed = false,
		emitOnBegin = false,
		onBlock,
		onError,
		includeTransactions: includeTransactions_,
		poll: poll_,
		pollingInterval = client.pollingInterval,
	},
) {
	const enablePolling =
		typeof poll_ !== 'undefined' ? poll_ : client.transport.type !== 'webSocket'
	const includeTransactions = includeTransactions_ ?? false
	let prevBlock
	const pollBlocks = () => {
		const observerId = (0, stringify_js_1.stringify)([
			'watchBlocks',
			client.uid,
			emitMissed,
			emitOnBegin,
			includeTransactions,
			pollingInterval,
		])
		return (0, observe_js_1.observe)(observerId, { onBlock, onError }, (emit) =>
			(0, poll_js_1.poll)(
				async () => {
					try {
						const block = await (0, getBlock_js_1.getBlock)(client, {
							blockTag,
							includeTransactions,
						})
						if (block.number && prevBlock?.number) {
							if (block.number === prevBlock.number) return
							if (block.number - prevBlock.number > 1 && emitMissed) {
								for (let i = prevBlock?.number + 1n; i < block.number; i++) {
									const block = await (0, getBlock_js_1.getBlock)(client, {
										blockNumber: i,
										includeTransactions,
									})
									emit.onBlock(block, prevBlock)
									prevBlock = block
								}
							}
						}
						if (
							!prevBlock?.number ||
							(blockTag === 'pending' && !block?.number) ||
							(block.number && block.number > prevBlock.number)
						) {
							emit.onBlock(block, prevBlock)
							prevBlock = block
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
	const subscribeBlocks = () => {
		const active = true
		let unsubscribe = () => active === false
		;(async () => {
			try {
				const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
					params: ['newHeads'],
					onData(data) {
						if (!active) return
						const format =
							client.chain?.formatters?.block?.format || block_js_1.formatBlock
						const block = format(data.result)
						onBlock(block, prevBlock)
						prevBlock = block
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
	return enablePolling ? pollBlocks() : subscribeBlocks()
}
exports.watchBlocks = watchBlocks
//# sourceMappingURL=watchBlocks.js.map
