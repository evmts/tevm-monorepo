/**
 * @internal
 * Prepares a trace to be listened to. If laizlyRun is true, it will return an object with the trace and not run the evm internally
 * @param {import('@tevm/vm').Vm} vm
 * @param {import('@tevm/node').TevmNode['logger']} logger
 * @param {import('@tevm/evm').EvmRunCallOpts} params
 * @param {boolean} [lazilyRun]
 * @returns {Promise<import('@tevm/evm').EvmResult & {trace: import('../common/CallTraceResult.js').CallTraceResult}>}
 * @throws {never}
 */
// @ts-expect-error values not used
export const runCallWithCallTrace = async (vm, logger, params, lazilyRun = false) => {
	throw new Error('Trace with "callTracer" is not yet implemented')
}
