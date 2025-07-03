import { numberToHex } from '@tevm/utils'

/**
 * @template {'callTracer' | 'prestateTracer' | '4byteTracer' | undefined} TTracer
 * @template {boolean} TDiffMode
 * @template {import('../debug/DebugResult.js').DebugTraceCallResult<TTracer, TDiffMode>} TTraceResult
 * @param {TTraceResult} traceResult
 * @returns {import('../utils/SerializeToJson.js').SerializeToJson<TTraceResult>}
 */
export const serializeTraceResult = (traceResult) => {
	if ('structLogs' in traceResult) {
		return /** @type {any} */ ({
			failed: traceResult.failed,
			gas: numberToHex(traceResult.gas),
			returnValue: traceResult.returnValue,
			structLogs: traceResult.structLogs.map((log) => ({
				...log,
				gas: numberToHex(log.gas),
				gasCost: numberToHex(log.gasCost),
			})),
		})
	}

	return /** @type {any} */ (traceResult)
}
