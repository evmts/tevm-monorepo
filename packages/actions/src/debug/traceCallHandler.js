import { createAddress } from '@tevm/address'
import { hexToBytes } from '@tevm/utils'
import { runCallWithPrestateTrace } from '../internal/runCallWithPrestateTrace.js'
import { runCallWithTrace } from '../internal/runCallWithTrace.js'

/**
 * Returns a trace of an eth_call within the context of the given block execution using the final state of the parent block
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugHandler.js').DebugTraceCallHandler} an execution trace of an {@link eth_call} in the context of a given block execution
 * mirroring the output from {@link traceTransaction}
 */
export const traceCallHandler =
	({ getVm, logger }) =>
	/**
	 * @template {'callTracer' | 'prestateTracer'} TTracer
	 * @template {boolean} TDiffMode
	 * @param {import('./DebugParams.js').DebugTraceCallParams<TTracer, TDiffMode>} params
	 * @returns {Promise<import('./DebugResult.js').DebugTraceCallResult<TTracer, TDiffMode>>}
	 */
	(params) => {
		logger.debug(params, 'traceCallHandler: executing trace call with params')

		const callParams = {
			...(params.from !== undefined
				? {
						origin: createAddress(params.from),
						caller: createAddress(params.from),
					}
				: {}),
			...(params.data !== undefined ? { data: hexToBytes(params.data) } : {}),
			...(params.to ? { to: createAddress(params.to) } : {}),
			...(params.gasPrice ? { gasPrice: params.gasPrice } : {}),
			...(params.gas ? { gasLimit: params.gas } : {}),
			...(params.value ? { value: params.value } : {}),
		}

		// Handle different tracer types
		if (params.tracer === 'prestateTracer') {
			// Use prestate tracer with diffMode if specified in tracerConfig
			const diffMode = params.tracerConfig?.diffMode === true
			logger.debug({ diffMode }, 'traceCallHandler: using prestateTracer')

			return getVm()
				.then((vm) => vm.deepCopy())
				.then((vm) => runCallWithPrestateTrace(vm, logger, callParams, diffMode))
				.then((res) => /** @type {any} */ (res.trace))
		}

		// Default to callTracer
		return getVm()
			.then((vm) => vm.deepCopy())
			.then((vm) => runCallWithTrace(vm, logger, callParams))
			.then((res) => /** @type {any} */ (res.trace))
	}
