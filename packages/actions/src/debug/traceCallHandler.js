import { createAddress } from '@tevm/address'
import { hexToBytes } from '@tevm/utils'
import { runCallWithTrace } from '../internal/runCallWithTrace.js'

/**
 * Returns a trace of an eth_call within the context of the given block execution using the final state of the parent block
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugHandler.js').DebugTraceCallHandler} an execution trace of an {@link eth_call} in the context of a given block execution
 * mirroring the output from {@link traceTransaction}
 */
export const traceCallHandler =
	({ getVm, logger }) =>
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

		const tracer = params.tracer || 'callTracer'
		const tracerConfig = params.tracerConfig || {}

		return getVm()
			.then((vm) => vm.deepCopy())
			.then((vm) => runCallWithTrace(vm, logger, callParams, false, tracer, tracerConfig))
			.then((res) => res.trace)
	}