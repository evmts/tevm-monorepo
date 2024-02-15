import { EthjsAddress, bytesToHex, hexToBytes, numberToHex } from '@tevm/utils'

/**
 * Returns a trace of an eth_call within the context of the given block execution using the final state of the parent block
 * @param {object} options
 * @param {import('@tevm/vm').TevmVm} options.vm
 * @returns {import('@tevm/actions-types').DebugTraceCallHandler} an execution trace of an {@link eth_call} in the context of a given block execution
 * mirroring the output from {@link traceTransaction}
 */
export const traceCallHandler =
	({ vm: _vm }) =>
	async (params) => {
		const vm = /** @type {import('@tevm/vm').TevmVm}*/ (await _vm.deepCopy())
		const { from, to, gas: gasLimit, gasPrice, value, data } = params

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
		vm.evm.events?.on('step', async (step, next) => {
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

		vm.evm.events?.on('afterMessage', (data, next) => {
			if (
				data.execResult.exceptionError !== undefined &&
				trace.structLogs.length > 0
			) {
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

		const res = await vm.evm.runCall({
			...(from !== undefined
				? {
						origin: EthjsAddress.fromString(from),
						caller: EthjsAddress.fromString(from),
				  }
				: {}),
			...(data !== undefined ? { data: hexToBytes(data) } : {}),
			...(to ? { to: EthjsAddress.fromString(to) } : {}),
			...(gasPrice ? { gasPrice } : {}),
			...(gasLimit ? { gasLimit } : {}),
			...(value ? { value } : {}),
		})
		trace.gas = res.execResult.executionGasUsed
		trace.failed = res.execResult.exceptionError !== undefined
		trace.returnValue = bytesToHex(res.execResult.returnValue)
		return trace
	}
