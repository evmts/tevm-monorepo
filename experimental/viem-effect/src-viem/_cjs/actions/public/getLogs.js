'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getLogs = void 0
const abi_js_1 = require('../../errors/abi.js')
const decodeEventLog_js_1 = require('../../utils/abi/decodeEventLog.js')
const encodeEventTopics_js_1 = require('../../utils/abi/encodeEventTopics.js')
const toHex_js_1 = require('../../utils/encoding/toHex.js')
const log_js_1 = require('../../utils/formatters/log.js')
async function getLogs(
	client,
	{
		address,
		blockHash,
		fromBlock,
		toBlock,
		event,
		events: events_,
		args,
		strict: strict_,
	} = {},
) {
	const strict = strict_ ?? false
	const events = events_ ?? (event ? [event] : undefined)
	let topics = []
	if (events) {
		topics = [
			events.flatMap((event) =>
				(0, encodeEventTopics_js_1.encodeEventTopics)({
					abi: [event],
					eventName: event.name,
					args,
				}),
			),
		]
		if (event) topics = topics[0]
	}
	let logs
	if (blockHash) {
		logs = await client.request({
			method: 'eth_getLogs',
			params: [{ address, topics, blockHash }],
		})
	} else {
		logs = await client.request({
			method: 'eth_getLogs',
			params: [
				{
					address,
					topics,
					fromBlock:
						typeof fromBlock === 'bigint'
							? (0, toHex_js_1.numberToHex)(fromBlock)
							: fromBlock,
					toBlock:
						typeof toBlock === 'bigint'
							? (0, toHex_js_1.numberToHex)(toBlock)
							: toBlock,
				},
			],
		})
	}
	return logs
		.map((log) => {
			try {
				const { eventName, args } = events
					? (0, decodeEventLog_js_1.decodeEventLog)({
							abi: events,
							data: log.data,
							topics: log.topics,
							strict,
					  })
					: { eventName: undefined, args: undefined }
				return (0, log_js_1.formatLog)(log, { args, eventName: eventName })
			} catch (err) {
				let eventName
				let isUnnamed
				if (
					err instanceof abi_js_1.DecodeLogDataMismatch ||
					err instanceof abi_js_1.DecodeLogTopicsMismatch
				) {
					if (strict) return
					eventName = err.abiItem.name
					isUnnamed = err.abiItem.inputs?.some((x) => !('name' in x && x.name))
				}
				return (0,
				log_js_1.formatLog)(log, { args: isUnnamed ? [] : {}, eventName })
			}
		})
		.filter(Boolean)
}
exports.getLogs = getLogs
//# sourceMappingURL=getLogs.js.map
