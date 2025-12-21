import { numberToHex } from '@tevm/utils'

/**
 * Serializes structLogs for default tracer result
 * @param {import('../common/TraceResult.js').TraceResult} result
 * @returns {object}
 */
const serializeDefaultTrace = (result) => ({
	failed: result.failed,
	gas: numberToHex(result.gas),
	returnValue: result.returnValue,
	structLogs: result.structLogs.map((log) => ({
		...log,
		gas: numberToHex(log.gas),
		gasCost: numberToHex(log.gasCost),
	})),
})

/**
 * @template {'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' | undefined} TTracer
 * @template {boolean} TDiffMode
 * @template {import('../debug/DebugResult.js').DebugTraceCallResult<TTracer, TDiffMode>} TTraceResult
 * @param {TTraceResult} traceResult
 * @returns {import('../utils/SerializeToJson.js').SerializeToJson<TTraceResult>}
 */
export const serializeTraceResult = (traceResult) => {
	// Handle default tracer (structLogs format)
	if ('structLogs' in traceResult) {
		return /** @type {any} */ (serializeDefaultTrace(/** @type {any} */ (traceResult)))
	}

	// Handle muxTracer (object with multiple tracer results)
	if (
		typeof traceResult === 'object' &&
		traceResult !== null &&
		('callTracer' in traceResult ||
			'prestateTracer' in traceResult ||
			'4byteTracer' in traceResult ||
			'flatCallTracer' in traceResult ||
			'default' in traceResult)
	) {
		const muxResult = /** @type {import('../common/MuxTraceResult.js').MuxTraceResult} */ (traceResult)
		/** @type {Record<string, any>} */
		const serializedMux = {}

		for (const [tracerName, tracerResult] of Object.entries(muxResult)) {
			if (tracerResult === undefined) continue

			if (
				tracerName === 'default' &&
				tracerResult &&
				typeof tracerResult === 'object' &&
				'structLogs' in tracerResult
			) {
				serializedMux[tracerName] = serializeDefaultTrace(
					/** @type {import('../common/TraceResult.js').TraceResult} */ (tracerResult),
				)
			} else {
				serializedMux[tracerName] = tracerResult
			}
		}

		return /** @type {any} */ (serializedMux)
	}

	return /** @type {any} */ (traceResult)
}
