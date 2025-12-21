import { bytesToHex } from '@tevm/utils'
import { decodeRevertReason } from './decodeRevertReason.js'

/**
 * @internal
 * Executes a call with muxTracer - multiplexes multiple tracers and returns results from each
 * @param {import('@tevm/vm').Vm} vm
 * @param {import('@tevm/node').TevmNode['logger']} logger
 * @param {import('@tevm/evm').EvmRunCallOpts} params
 * @param {import('../common/MuxTraceResult.js').MuxTracerConfiguration} tracerConfig Configuration for which tracers to run
 * @returns {Promise<import('@tevm/evm').EvmResult & {trace: import('../common/MuxTraceResult.js').MuxTraceResult}>}
 * @throws {never}
 */
export const runCallWithMuxTrace = async (vm, logger, params, tracerConfig) => {
	logger.debug({ tracerConfig }, 'runCallWithMuxTrace: executing mux trace')

	const enabledTracers = Object.keys(tracerConfig)
	logger.debug({ enabledTracers }, 'runCallWithMuxTrace: enabled tracers')

	// Initialize result object
	/** @type {import('../common/MuxTraceResult.js').MuxTraceResult} */
	const muxResult = {}

	// Track call trace state
	/** @type {import('../common/TraceCall.js').TraceCall[]} */
	const callStack = []
	/** @type {import('../common/CallTraceResult.js').CallTraceResult | null} */
	let rootTrace = null

	// Track flat call trace state
	/** @type {import('../common/FlatCallTraceResult.js').FlatTraceEntry[]} */
	const flatTraces = []
	/** @type {Array<{traceAddress: number[], index: number}>} */
	const flatTraceStack = []
	/** @type {number[]} */
	const childCounters = []

	// Track 4byte trace state
	/** @type {Map<string, number>} */
	const selectorCounts = new Map()
	/** @type {Map<string, Map<string, string[]>>} */
	const contractSelectorCalldata = new Map()

	// Track default trace state (structLogs)
	/** @type {Array<{pc: number, op: string, gas: bigint, gasCost: bigint, depth: number, stack: import('../common/Hex.js').Hex[]}>} */
	const structLogs = []

	// =========================================
	// Set up event handlers for all enabled tracers
	// =========================================

	// callTracer events
	if (enabledTracers.includes('callTracer')) {
		vm.evm.events?.on('beforeMessage', async (message, next) => {
			/** @type {import('../common/TraceType.js').TraceType} */
			let traceType = 'CALL'
			if (message.to === undefined) {
				traceType = message.salt !== undefined ? 'CREATE2' : 'CREATE'
			} else if (message.delegatecall) {
				traceType = 'DELEGATECALL'
			} else if (message.isStatic) {
				traceType = 'STATICCALL'
			}

			/** @type {import('../common/TraceCall.js').TraceCall} */
			const traceCall = {
				type: traceType,
				from: message.caller.toString(),
				to: message.to ? message.to.toString() : `0x${'0'.repeat(40)}`,
				value: message.value ?? 0n,
				gas: message.gasLimit,
				gasUsed: 0n,
				input: bytesToHex(message.data ?? new Uint8Array(0)),
				output: '0x',
				calls: [],
			}

			if (message.depth === 0) {
				rootTrace = {
					type: traceCall.type,
					from: traceCall.from,
					to: traceCall.to,
					value: traceCall.value ?? 0n,
					gas: traceCall.gas ?? 0n,
					gasUsed: traceCall.gasUsed ?? 0n,
					input: traceCall.input,
					output: traceCall.output,
					calls: [],
				}
				callStack.push(/** @type {import('../common/TraceCall.js').TraceCall} */ (rootTrace))
			} else {
				const parent = callStack[callStack.length - 1]
				if (parent) {
					if (!parent.calls) {
						parent.calls = []
					}
					parent.calls.push(traceCall)
					callStack.push(traceCall)
				}
			}

			next?.()
		})

		vm.evm.events?.on('afterMessage', async (result, next) => {
			const currentCall = callStack.pop()
			if (currentCall) {
				currentCall.gasUsed = result.execResult.executionGasUsed ?? 0n
				if (result.execResult?.returnValue) {
					currentCall.output = bytesToHex(result.execResult.returnValue)
				}
				if (result.createdAddress && (currentCall.type === 'CREATE' || currentCall.type === 'CREATE2')) {
					currentCall.to = result.createdAddress.toString()
				}
				if (result.execResult?.exceptionError) {
					currentCall.error = result.execResult.exceptionError.error
					if (result.execResult.exceptionError.error.includes('revert')) {
						currentCall.revertReason = decodeRevertReason(bytesToHex(result.execResult.returnValue))
					}
				}
			}
			next?.()
		})
	}

	// flatCallTracer events
	if (enabledTracers.includes('flatCallTracer')) {
		vm.evm.events?.on('beforeMessage', async (message, next) => {
			const isCreate = message.to === undefined

			/** @type {'call' | 'delegatecall' | 'staticcall' | undefined} */
			let callType
			if (!isCreate) {
				if (message.delegatecall) {
					callType = 'delegatecall'
				} else if (message.isStatic) {
					callType = 'staticcall'
				} else {
					callType = 'call'
				}
			}

			/** @type {number[]} */
			let traceAddress
			if (message.depth === 0) {
				traceAddress = []
				childCounters.length = 0
				childCounters.push(0)
			} else {
				const parentStackEntry = flatTraceStack[flatTraceStack.length - 1]
				if (parentStackEntry) {
					while (childCounters.length <= message.depth) {
						childCounters.push(0)
					}
					const childIndex = childCounters[message.depth] || 0
					traceAddress = [...parentStackEntry.traceAddress, childIndex]
					childCounters[message.depth] = childIndex + 1
					if (childCounters.length > message.depth + 1) {
						childCounters[message.depth + 1] = 0
					}
				} else {
					traceAddress = [0]
				}
			}

			const traceIndex = flatTraces.length
			/** @type {import('../common/FlatCallTraceResult.js').FlatTraceEntry} */
			const traceEntry = isCreate
				? {
						action: /** @type {import('../common/FlatCallTraceResult.js').FlatCreateAction} */ ({
							from: message.caller.toString(),
							gas: message.gasLimit,
							init: bytesToHex(message.data ?? new Uint8Array(0)),
							value: message.value ?? 0n,
						}),
						result: null,
						subtraces: 0,
						traceAddress,
						type: 'create',
					}
				: {
						action: /** @type {import('../common/FlatCallTraceResult.js').FlatCallAction} */ ({
							callType,
							from: message.caller.toString(),
							to: message.to?.toString() ?? `0x${'0'.repeat(40)}`,
							gas: message.gasLimit,
							input: bytesToHex(message.data ?? new Uint8Array(0)),
							value: message.value ?? 0n,
						}),
						result: null,
						subtraces: 0,
						traceAddress,
						type: 'call',
					}

			flatTraces.push(traceEntry)
			flatTraceStack.push({ traceAddress, index: traceIndex })

			next?.()
		})

		vm.evm.events?.on('afterMessage', async (result, next) => {
			const stackEntry = flatTraceStack.pop()
			if (!stackEntry) {
				next?.()
				return
			}

			const traceEntry = flatTraces[stackEntry.index]
			if (!traceEntry) {
				next?.()
				return
			}

			if (result.execResult?.exceptionError) {
				traceEntry.error = result.execResult.exceptionError.error
				if (result.execResult.exceptionError.error.includes('revert') && result.execResult.returnValue) {
					traceEntry.revertReason = decodeRevertReason(bytesToHex(result.execResult.returnValue))
				}
				traceEntry.result = null
			} else {
				if (traceEntry.type === 'create') {
					traceEntry.result = /** @type {import('../common/FlatCallTraceResult.js').FlatCreateResult} */ ({
						address: result.createdAddress?.toString() ?? `0x${'0'.repeat(40)}`,
						code: bytesToHex(result.execResult?.returnValue ?? new Uint8Array(0)),
						gasUsed: result.execResult?.executionGasUsed ?? 0n,
					})
				} else {
					traceEntry.result = /** @type {import('../common/FlatCallTraceResult.js').FlatCallResult} */ ({
						gasUsed: result.execResult?.executionGasUsed ?? 0n,
						output: bytesToHex(result.execResult?.returnValue ?? new Uint8Array(0)),
					})
				}
			}

			if (flatTraceStack.length > 0) {
				const parentStackEntry = flatTraceStack[flatTraceStack.length - 1]
				if (parentStackEntry) {
					const parentEntry = flatTraces[parentStackEntry.index]
					if (parentEntry) {
						parentEntry.subtraces++
					}
				}
			}

			next?.()
		})
	}

	// 4byteTracer events
	if (enabledTracers.includes('4byteTracer')) {
		vm.evm.events?.on('beforeMessage', async (message, next) => {
			const callData = message.data
			if (callData && callData.length >= 4) {
				const selector = bytesToHex(callData.slice(0, 4))
				const dataSize = callData.length - 4
				const key = `${selector}-${dataSize}`
				selectorCounts.set(key, (selectorCounts.get(key) || 0) + 1)

				const contractAddress = message.to?.toString().toLowerCase() ?? ''
				if (contractAddress) {
					if (!contractSelectorCalldata.has(contractAddress)) {
						contractSelectorCalldata.set(contractAddress, new Map())
					}
					const contractMap = contractSelectorCalldata.get(contractAddress)
					if (contractMap) {
						if (!contractMap.has(selector)) {
							contractMap.set(selector, [])
						}
						const calldataArray = contractMap.get(selector)
						if (calldataArray) {
							const fullCalldata = bytesToHex(callData)
							calldataArray.push(fullCalldata)
						}
					}
				}
			}
			next?.()
		})
	}

	// default tracer events (structLogs)
	if (enabledTracers.includes('default')) {
		vm.evm.events?.on('step', async (step, next) => {
			/** @type {import('../common/Hex.js').Hex[]} */
			const stackItems = step.stack.map((item) => /** @type {import('../common/Hex.js').Hex} */ (`0x${item.toString(16).padStart(64, '0')}`))

			structLogs.push({
				pc: step.pc,
				op: step.opcode.name,
				gas: step.gasLeft,
				gasCost: BigInt(step.opcode.fee),
				depth: step.depth + 1,
				stack: stackItems,
			})

			next?.()
		})
	}

	// Execute the call
	const runCallResult = await vm.evm.runCall(params)

	logger.debug(runCallResult, 'runCallWithMuxTrace: evm run call complete')

	// =========================================
	// Build results for each enabled tracer
	// =========================================

	// callTracer result
	if (enabledTracers.includes('callTracer')) {
		if (rootTrace) {
			rootTrace = /** @type {import('../common/CallTraceResult.js').CallTraceResult} */ (rootTrace)
			rootTrace.gasUsed = runCallResult.execResult.executionGasUsed
			if (runCallResult.execResult.returnValue) {
				rootTrace.output = bytesToHex(runCallResult.execResult.returnValue)
			}
			if (runCallResult.execResult.exceptionError) {
				const rootTraceWithError = /** @type {any} */ (rootTrace)
				rootTraceWithError.error =
					runCallResult.execResult.exceptionError.error || runCallResult.execResult.exceptionError.toString()
				if (runCallResult.execResult.exceptionError.error?.includes('revert')) {
					rootTraceWithError.revertReason = decodeRevertReason(bytesToHex(runCallResult.execResult.returnValue))
				}
			}
			muxResult.callTracer = rootTrace
		}
	}

	// flatCallTracer result
	if (enabledTracers.includes('flatCallTracer')) {
		muxResult.flatCallTracer = flatTraces.filter((entry) => entry !== undefined)
	}

	// 4byteTracer result
	if (enabledTracers.includes('4byteTracer')) {
		/** @type {Record<string, number | Record<string, readonly string[]>>} */
		const fourbyteResult = {}

		for (const [key, count] of selectorCounts.entries()) {
			fourbyteResult[key] = count
		}

		for (const [address, selectorMap] of contractSelectorCalldata.entries()) {
			/** @type {Record<string, readonly string[]>} */
			const selectorData = {}
			for (const [selector, calldataList] of selectorMap.entries()) {
				selectorData[selector] = calldataList
			}
			fourbyteResult[address] = selectorData
		}

		muxResult['4byteTracer'] = /** @type {any} */ (fourbyteResult)
	}

	// default tracer result
	if (enabledTracers.includes('default')) {
		muxResult.default = /** @type {any} */ ({
			gas: runCallResult.execResult.executionGasUsed,
			failed: runCallResult.execResult.exceptionError !== undefined,
			returnValue: bytesToHex(runCallResult.execResult.returnValue ?? new Uint8Array(0)).slice(2),
			structLogs: /** @type {any} */ (structLogs),
		})
	}

	return {
		...runCallResult,
		trace: muxResult,
	}
}
