import { bytesToHex, toHex } from '@tevm/utils'

/**
 * @internal
 * Executes a call with flat call tracer, which captures all calls in a flat array with trace addresses
 * @param {import('@tevm/vm').Vm} vm
 * @param {import('@tevm/node').TevmNode['logger']} logger
 * @param {import('@tevm/evm').EvmRunCallOpts} params
 * @returns {Promise<import('@tevm/evm').EvmResult & {trace: import('../common/FlatCallTraceResult.js').FlatCallTraceResult}>}
 * @throws {never}
 */
export const runCallWithFlatCallTrace = async (vm, logger, params) => {
	/** @type {import('../common/FlatCallTraceResult.js').FlatCallTraceCall[]} */
	const traces = []
	
	/** @type {number} */
	let currentDepth = 0

	/** @type {Map<number, number>} */
	const depthSubtraces = new Map()

	/**
	 * Get and increment subtrace count for a given depth
	 * @param {number} depth
	 * @returns {number}
	 */
	const getSubtraceIndex = (depth) => {
		const current = depthSubtraces.get(depth) || 0
		depthSubtraces.set(depth, current + 1)
		return current
	}

	/**
	 * Handle message events (calls/creates)
	 * @param {any} data
	 * @param {Function} [next]
	 */
	const handleBeforeMessage = (data, next) => {
		try {
			logger.debug({ depth: data.depth, to: data.to?.toString() }, 'flatCallTracer: beforeMessage')
			
			// Build trace address based on current depth
			const traceAddress = []
			for (let i = 1; i <= data.depth; i++) {
				traceAddress.push(getSubtraceIndex(i - 1))
			}

			// Determine call type
			let callType = 'call'
			if (data.isCreate) {
				callType = data.salt !== undefined ? 'create2' : 'create'
			} else if (data.delegateCall) {
				callType = 'delegatecall'
			} else if (data.isStatic) {
				callType = 'staticcall'
			}

			/** @type {import('../common/FlatCallTraceResult.js').FlatCallTraceCall} */
			const trace = {
				action: {
					callType,
					from: data.caller ? `0x${data.caller.toString('hex').padStart(40, '0')}` : '0x0000000000000000000000000000000000000000',
					...(data.to ? { to: `0x${data.to.toString('hex').padStart(40, '0')}` } : {}),
					gas: toHex(data.gasLimit || 0n),
					input: bytesToHex(data.data || new Uint8Array(0)),
					...(data.value !== undefined ? { value: toHex(data.value) } : {}),
					...(data.isCreate && data.data ? { init: bytesToHex(data.data) } : {}),
				},
				traceAddress,
				subtraces: 0, // Will be updated later
				type: data.isCreate ? 'create' : 'call',
			}

			traces.push(trace)
			currentDepth = data.depth

			next?.()
		} catch (error) {
			logger.debug(error, 'Error in flatCallTracer beforeMessage handler')
			next?.()
		}
	}

	/**
	 * Handle message result events
	 * @param {any} data
	 * @param {Function} [next]
	 */
	const handleAfterMessage = (data, next) => {
		try {
			logger.debug({ depth: data.depth, gasUsed: data.execResult.executionGasUsed }, 'flatCallTracer: afterMessage')
			
			// Find the trace that corresponds to this message
			const trace = traces.find(t => t.traceAddress.length === data.depth && !t.result && !t.error)
			
			if (trace) {
				if (data.execResult.exceptionError) {
					trace.error = data.execResult.exceptionError.error || 'execution reverted'
				} else {
					trace.result = {
						gasUsed: toHex(data.execResult.executionGasUsed || 0n),
						output: bytesToHex(data.execResult.returnValue || new Uint8Array(0)),
					}

					// For creates, add the deployed address
					if (trace.type === 'create' && data.execResult.createdAddress) {
						trace.result.address = `0x${data.execResult.createdAddress.toString('hex').padStart(40, '0')}`
						// Add deployed code if available
						if (data.execResult.returnValue && data.execResult.returnValue.length > 0) {
							trace.result.code = bytesToHex(data.execResult.returnValue)
						}
					}
				}
			}

			next?.()
		} catch (error) {
			logger.debug(error, 'Error in flatCallTracer afterMessage handler')
			next?.()
		}
	}

	// Set up event listeners
	vm.evm.events?.on('beforeMessage', handleBeforeMessage)
	vm.evm.events?.on('afterMessage', handleAfterMessage)

	try {
		logger.debug(params, 'runCallWithFlatCallTrace: executing call using evm.runCall')
		
		const runCallResult = await vm.evm.runCall(params)

		// If no traces were captured, create a root trace
		if (traces.length === 0) {
			/** @type {import('../common/FlatCallTraceResult.js').FlatCallTraceCall} */
			const rootTrace = {
				action: {
					callType: 'call',
					from: params.caller ? `0x${params.caller.toString('hex').padStart(40, '0')}` : '0x0000000000000000000000000000000000000000',
					...(params.to ? { to: `0x${params.to.toString('hex').padStart(40, '0')}` } : {}),
					gas: toHex(params.gasLimit || 0n),
					input: bytesToHex(params.data || new Uint8Array(0)),
					...(params.value !== undefined ? { value: toHex(params.value) } : {}),
				},
				traceAddress: [],
				subtraces: 0,
				type: 'call',
			}

			if (runCallResult.execResult.exceptionError) {
				rootTrace.error = runCallResult.execResult.exceptionError.error || 'execution reverted'
			} else {
				rootTrace.result = {
					gasUsed: toHex(runCallResult.execResult.executionGasUsed || 0n),
					output: bytesToHex(runCallResult.execResult.returnValue || new Uint8Array(0)),
				}
			}

			traces.push(rootTrace)
		}

		// Calculate subtrace counts for each trace
		/** @type {Map<string, number>} */
		const subtracesByParent = new Map()

		for (const trace of traces) {
			const parentTraceAddress = trace.traceAddress.slice(0, -1)
			const parentKey = parentTraceAddress.join(',') || 'root'
			subtracesByParent.set(parentKey, (subtracesByParent.get(parentKey) || 0) + 1)
		}

		// Update subtrace counts
		for (const trace of traces) {
			const traceKey = trace.traceAddress.join(',') || 'root'
			trace.subtraces = subtracesByParent.get(traceKey) || 0
		}

		logger.debug({ traceCount: traces.length }, 'runCallWithFlatCallTrace: captured traces')

		return {
			...runCallResult,
			trace: traces,
		}
	} finally {
		// Clean up event listeners
		vm.evm.events?.removeListener('beforeMessage', handleBeforeMessage)
		vm.evm.events?.removeListener('afterMessage', handleAfterMessage)
	}
}