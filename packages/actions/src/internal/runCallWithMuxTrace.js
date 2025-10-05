import { runCallWithCallTrace } from './runCallWithCallTrace.js'
import { runCallWithPrestateTrace } from './runCallWithPrestateTrace.js'

/**
 * @internal
 * Executes a call with multiple tracers simultaneously (muxTracer)
 * @template {import('../common/MuxTraceResult.js').MuxTracerConfig} TMuxConfig
 * @param {import('@tevm/node').TevmNode} client
 * @param {import('@tevm/evm').EvmRunCallOpts} evmInput
 * @param {TMuxConfig} muxConfig Configuration specifying which tracers to run
 * @returns {Promise<import('@tevm/evm').EvmResult & {trace: import('../common/MuxTraceResult.js').MuxTraceResult<TMuxConfig>}>}
 * @throws {Error} When no tracers are configured or execution fails
 */
export const runCallWithMuxTrace = async (client, evmInput, muxConfig) => {
	const { logger } = client

	// Validate that at least one tracer is configured
	const hasPrestate = muxConfig.prestate !== undefined
	const hasCall = muxConfig.call !== undefined

	if (!hasPrestate && !hasCall) {
		throw new Error('MuxTracer requires at least one tracer to be configured')
	}

	logger.debug({ muxConfig, evmInput }, 'runCallWithMuxTrace: executing call with mux tracer')

	// We need to execute the call only once and collect results from all requested tracers
	// For efficiency, we'll run the most comprehensive tracer and extract what we need

	let baseResult
	/** @type {import('../common/MuxTraceResult.js').MuxTraceResult<TMuxConfig>} */
	const muxTrace = /** @type {any} */ ({})

	try {
		// If we need prestate tracing, we need to run the prestate tracer
		if (hasPrestate) {
			const diffMode = muxConfig.prestate?.diffMode ?? false
			logger.debug({ diffMode }, 'runCallWithMuxTrace: running prestate tracer')

			const prestateResult = await runCallWithPrestateTrace(client, evmInput, diffMode)
			baseResult = prestateResult
			muxTrace.prestate = prestateResult.trace
		}

		// If we need call tracing, we run the call tracer
		// Note: This is a simplified approach. In a full implementation, we'd want to
		// run both tracers on the same execution for perfect consistency
		if (hasCall) {
			logger.debug('runCallWithMuxTrace: running call tracer')

			if (!baseResult) {
				// If we haven't run prestate tracer, we need to get the base result
				const { getVm } = client
				const vm = await getVm()
				const vmCopy = await vm.deepCopy()

				const callResult = await runCallWithCallTrace(vmCopy, logger, evmInput)
				baseResult = callResult
				muxTrace.call = callResult.trace
			} else {
				// We already have a base result from prestate, now we need call trace
				// For now, we'll run call tracer separately
				// TODO: Optimize this to run both on same execution
				const { getVm } = client
				const vm = await getVm()
				const vmCopy = await vm.deepCopy()

				const callResult = await runCallWithCallTrace(vmCopy, logger, evmInput)
				muxTrace.call = callResult.trace
			}
		}

		if (!baseResult) {
			throw new Error('No tracer execution completed successfully')
		}

		return {
			...baseResult,
			trace: muxTrace,
		}
	} catch (error) {
		logger.error({ error, muxConfig }, 'runCallWithMuxTrace: error during mux trace execution')
		throw error
	}
}