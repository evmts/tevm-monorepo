import { EthjsAddress, hexToBytes } from '@tevm/utils'
import { runCallWithTrace } from '../internal/runCallWithTrace.js'

/**
 * Returns a trace of an eth_call within the context of the given block execution using the final state of the parent block
 * @param {import('@tevm/base-client').BaseClient} client
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
						origin: EthjsAddress.fromString(params.from),
						caller: EthjsAddress.fromString(params.from),
					}
				: {}),
			...(params.data !== undefined ? { data: hexToBytes(params.data) } : {}),
			...(params.to ? { to: EthjsAddress.fromString(params.to) } : {}),
			...(params.gasPrice ? { gasPrice: params.gasPrice } : {}),
			...(params.gas ? { gasLimit: params.gas } : {}),
			...(params.value ? { value: params.value } : {}),
		}

		return getVm()
			.then((vm) => vm.deepCopy())
			.then((vm) => runCallWithTrace(vm, logger, callParams))
			.then((res) => res.trace)
	}
