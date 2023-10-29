'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getFilterChanges = void 0
const abi_js_1 = require('../../errors/abi.js')
const decodeEventLog_js_1 = require('../../utils/abi/decodeEventLog.js')
const log_js_1 = require('../../utils/formatters/log.js')
async function getFilterChanges(_client, { filter }) {
	const strict = 'strict' in filter && filter.strict
	const logs = await filter.request({
		method: 'eth_getFilterChanges',
		params: [filter.id],
	})
	return logs
		.map((log) => {
			if (typeof log === 'string') return log
			try {
				const { eventName, args } =
					'abi' in filter && filter.abi
						? (0, decodeEventLog_js_1.decodeEventLog)({
								abi: filter.abi,
								data: log.data,
								topics: log.topics,
								strict,
						  })
						: { eventName: undefined, args: undefined }
				return (0, log_js_1.formatLog)(log, { args, eventName })
			} catch (err) {
				let eventName
				let isUnnamed
				if (
					err instanceof abi_js_1.DecodeLogDataMismatch ||
					err instanceof abi_js_1.DecodeLogTopicsMismatch
				) {
					if ('strict' in filter && filter.strict) return
					eventName = err.abiItem.name
					isUnnamed = err.abiItem.inputs?.some((x) => !('name' in x && x.name))
				}
				return (0,
				log_js_1.formatLog)(log, { args: isUnnamed ? [] : {}, eventName })
			}
		})
		.filter(Boolean)
}
exports.getFilterChanges = getFilterChanges
//# sourceMappingURL=getFilterChanges.js.map
