import { createAddress } from '@tevm/address'
import { hexToBytes } from '@tevm/utils'
import { runCallWithCallTrace } from '../internal/runCallWithCallTrace.js'
import { runCallWithFlatCallTrace } from '../internal/runCallWithFlatCallTrace.js'
import { runCallWithFourbyteTrace } from '../internal/runCallWithFourbyteTrace.js'
import { runCallWithMuxTrace } from '../internal/runCallWithMuxTrace.js'
import { runCallWithPrestateTrace } from '../internal/runCallWithPrestateTrace.js'
import { runCallWithTrace } from '../internal/runCallWithTrace.js'

/**
 * Returns a trace of an eth_call within the context of the given block execution using the final state of the parent block
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugHandler.js').DebugTraceCallHandler} an execution trace of an {@link eth_call} in the context of a given block execution
 * mirroring the output from {@link traceTransaction}
 */
export const traceCallHandler =
	(client) =>
	/**
	 * @template {'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer'} TTracer
	 * @template {boolean} TDiffMode
	 * @param {import('./DebugParams.js').DebugTraceCallParams<TTracer, TDiffMode>} params
	 * @returns {Promise<import('./DebugResult.js').DebugTraceCallResult<TTracer, TDiffMode>>}
	 */
	(params) => {
		const { logger, getVm } = client
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

		if (params.tracer === 'prestateTracer') {
			const tracerConfig = /** @type {{diffMode?: boolean} | undefined} */ (params.tracerConfig)
			const diffMode = tracerConfig?.diffMode === true
			logger.debug({ diffMode }, 'traceCallHandler: using prestateTracer')

			return getVm()
				.then((vm) => vm.deepCopy())
				.then((vm) => runCallWithPrestateTrace({ ...client, getVm: () => Promise.resolve(vm) }, callParams, diffMode))
				.then((res) => /** @type {any} */ (res.trace))
		}
		if (params.tracer === 'callTracer') {
			return getVm()
				.then((vm) => vm.deepCopy())
				.then((vm) => runCallWithCallTrace(vm, logger, callParams))
				.then((res) => /** @type {any} */ (res.trace))
		}
		if (params.tracer === '4byteTracer') {
			logger.debug('traceCallHandler: using 4byteTracer')
			return getVm()
				.then((vm) => vm.deepCopy())
				.then((vm) => runCallWithFourbyteTrace(vm, logger, callParams))
				.then((res) => /** @type {any} */ (res.trace))
		}
		if (params.tracer === 'flatCallTracer') {
			logger.debug('traceCallHandler: using flatCallTracer')
			return getVm()
				.then((vm) => vm.deepCopy())
				.then((vm) => runCallWithFlatCallTrace(vm, logger, callParams))
				.then((res) => /** @type {any} */ (res.trace))
		}
		if (params.tracer === 'muxTracer') {
			logger.debug('traceCallHandler: using muxTracer')
			const tracerConfig = /** @type {import('../common/MuxTraceResult.js').MuxTracerConfiguration} */ (
				params.tracerConfig ?? {}
			)
			return getVm()
				.then((vm) => vm.deepCopy())
				.then((vm) => runCallWithMuxTrace(vm, logger, callParams, tracerConfig))
				.then((res) => /** @type {any} */ (res.trace))
		}
		return getVm()
			.then((vm) => vm.deepCopy())
			.then((vm) => runCallWithTrace(vm, logger, callParams))
			.then((res) => /** @type {any} */ (res.trace))
	}
