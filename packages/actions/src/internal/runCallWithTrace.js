import { bytesToHex, numberToHex } from '@tevm/utils'
/**
 * @internal
 * Prepares a trace to be listened to
 * @param {import('@tevm/vm').TevmVm} vm
 * @param {import('@tevm/base-client').BaseClient['logger']} logger
 * @param {import('@tevm/evm').EvmRunCallOpts} params
 * @returns {Promise<import('@tevm/evm').EvmResult & {trace: import('@tevm/actions-types').DebugTraceCallResult}>}
 */
export const runCallWithTrace = async (vm, logger, params) => {
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
		 * @type {Array<import('@tevm/actions-types').DebugTraceCallResult['structLogs'][number]>}
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
			if (!nextLog) {
				throw new Error('No structLogs to mark as error')
			}
			// TODO fix this type
			Object.assign(nextLog, {
				error: data.execResult.exceptionError,
			})
		}
		next?.()
	})

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
