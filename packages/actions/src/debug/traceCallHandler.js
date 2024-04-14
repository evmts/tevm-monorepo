import { EthjsAddress, bytesToHex, hexToBytes, numberToHex } from '@tevm/utils'

/**
 * Returns a trace of an eth_call within the context of the given block execution using the final state of the parent block
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('@tevm/actions-types').DebugTraceCallHandler} an execution trace of an {@link eth_call} in the context of a given block execution
 * mirroring the output from {@link traceTransaction}
 */
export const traceCallHandler =
	({ getVm }) =>
		async ({ from, to, gas: gasLimit, gasPrice, value, data }) => {
			/**
			 * Copy the vm so it doesn't modify state
			 */
			const vm = await getVm().then(vm => vm.deepCopy())

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

			const { execResult: { returnValue, executionGasUsed, exceptionError } } = await vm.evm.runCall({
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

			trace.gas = executionGasUsed
			trace.failed = exceptionError !== undefined
			trace.returnValue = bytesToHex(returnValue)

			return trace
		}
