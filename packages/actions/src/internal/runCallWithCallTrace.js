/**
 * @internal
 * Prepares a trace to be listened to. If laizlyRun is true, it will return an object with the trace and not run the evm internally
 * @param {import('@tevm/vm').Vm} _vm
 * @param {import('@tevm/node').TevmNode['logger']} _logger
 * @param {import('@tevm/evm').EvmRunCallOpts} _params
 * @param {boolean} [_lazilyRun]
 * @returns {Promise<import('@tevm/evm').EvmResult & {trace: import('../common/CallTraceResult.js').CallTraceResult}>}
 * @throws {never}
 */
export const runCallWithCallTrace = async (_vm, _logger, _params, _lazilyRun = false) => {
	throw new Error('Trace with "callTracer" is not yet implemented')
}
