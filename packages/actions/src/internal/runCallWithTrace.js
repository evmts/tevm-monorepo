import { DefensiveNullCheckError } from '@tevm/errors'
import { bytesToHex, invariant, numberToHex } from '@tevm/utils'
/**
 * @internal
 * Prepares a trace to be listened to. If laizlyRun is true, it will return an object with the trace and not run the evm internally
 * @param {import('@tevm/vm').Vm} vm
 * @param {import('@tevm/node').TevmNode['logger']} logger
 * @param {import('@tevm/evm').EvmRunCallOpts} params
 * @param {boolean} [lazilyRun]
 * @returns {Promise<import('@tevm/evm').EvmResult & {trace: import('../debug/DebugResult.js').EvmTracerResult}>}
 * @throws {never}
 */
export const runCallWithTrace = async (vm, logger, params, lazilyRun = false) => {
	/**
	 * As the evm runs we will be updating this trace object
	 * and then returning it
	 */
	const trace = {
		gas: 0n,
		/**
		 * @type {import('@tevm/utils').Hex}
		 */
		returnValue: '0x0',
		failed: false,
		/**
		 * @type {Array<import('../debug/DebugResult.js').EvmTracerResult['structLogs'][number]>}
		 */
		structLogs: [],
	}

	/**
	 * On every step push a struct log
	 */
	vm.evm.events?.on('step', async (step, next) => {
		logger.debug(step, 'runCallWithTrace: new evm step')
		trace.structLogs.push({
			pc: step.pc,
			op: step.opcode.name,
			gasCost: BigInt(step.opcode.fee) + (step.opcode.dynamicFee ?? 0n),
			gas: step.gasLeft,
			depth: step.depth,
			stack: step.stack.map((code) => numberToHex(code)),
		})
		next?.()
	})

	/**
	 * After any internal call push error if any
	 */
	vm.evm.events?.on('afterMessage', (data, next) => {
		logger.debug(data.execResult, 'runCallWithTrace: new message result')
		if (data.execResult.exceptionError !== undefined && trace.structLogs.length > 0) {
			// Mark last opcode trace as error if exception occurs
			const nextLog = trace.structLogs[trace.structLogs.length - 1]
			invariant(nextLog, new DefensiveNullCheckError('No structLogs to mark as error'))
			// TODO fix this type
			Object.assign(nextLog, {
				error: data.execResult.exceptionError,
			})
		}
		next?.()
	})

	if (lazilyRun) {
		// TODO internally used function is not typesafe here
		return /** @type any*/ ({ trace })
	}

	const runCallResult = await vm.evm.runCall(params)

	logger.debug(runCallResult, 'runCallWithTrace: evm run call complete')

	trace.gas = runCallResult.execResult.executionGasUsed
	trace.failed = runCallResult.execResult.exceptionError !== undefined
	trace.returnValue = bytesToHex(runCallResult.execResult.returnValue)

	return {
		...runCallResult,
		trace,
	}
}
