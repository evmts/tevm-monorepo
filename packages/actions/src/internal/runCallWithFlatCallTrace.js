import { bytesToHex } from '@tevm/utils'
import { decodeRevertReason } from './decodeRevertReason.js'

/**
 * @internal
 * Runs a call with flat call tracing enabled.
 * Unlike callTracer which returns a nested tree, flatCallTracer returns a flat array of all calls.
 * This format is similar to Parity/OpenEthereum trace format and is useful for indexing.
 * @param {import('@tevm/vm').Vm} vm
 * @param {import('@tevm/node').TevmNode['logger']} logger
 * @param {import('@tevm/evm').EvmRunCallOpts} params
 * @param {boolean} [lazilyRun]
 * @returns {Promise<import('@tevm/evm').EvmResult & {trace: import('../common/FlatCallTraceResult.js').FlatCallTraceResult}>}
 * @throws {never}
 */
export const runCallWithFlatCallTrace = async (vm, logger, params, lazilyRun = false) => {
	/**
	 * Flat array of trace entries
	 * @type {import('../common/FlatCallTraceResult.js').FlatTraceEntry[]}
	 */
	const traces = []

	/**
	 * Stack to track the current trace path and count subtraces
	 * Each entry is {traceAddress: number[], index: number}
	 * @type {Array<{traceAddress: number[], index: number}>}
	 */
	const traceStack = []

	/**
	 * Counter for child traces at each depth
	 * @type {number[]}
	 */
	const childCounters = []

	/**
	 * Before each call/create - build trace entry
	 */
	vm.evm.events?.on('beforeMessage', async (message, next) => {
		logger.debug(message, 'runCallWithFlatCallTrace: beforeMessage event')

		// Determine if this is a create or call
		const isCreate = message.to === undefined
		// Note: isCreate2 can be detected via `message.salt !== undefined` if needed for future enhancements

		// Determine the call type for calls
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

		// Calculate trace address
		/** @type {number[]} */
		let traceAddress
		if (message.depth === 0) {
			traceAddress = []
			// Reset counters for root call
			childCounters.length = 0
			childCounters.push(0)
		} else {
			// Get parent's trace address and append current index
			const parentStackEntry = traceStack[traceStack.length - 1]
			if (parentStackEntry) {
				// Ensure we have a counter for this depth
				while (childCounters.length <= message.depth) {
					childCounters.push(0)
				}
				const childIndex = childCounters[message.depth] || 0
				traceAddress = [...parentStackEntry.traceAddress, childIndex]
				// Increment the counter for next sibling at this depth
				childCounters[message.depth] = childIndex + 1
				// Reset counter for potential children
				if (childCounters.length > message.depth + 1) {
					childCounters[message.depth + 1] = 0
				}
			} else {
				traceAddress = [0]
			}
		}

		// Create trace entry
		const traceIndex = traces.length
		/** @type {import('../common/FlatCallTraceResult.js').FlatTraceEntry} */
		const traceEntry = isCreate
			? {
					action: /** @type {import('../common/FlatCallTraceResult.js').FlatCreateAction} */ ({
						from: message.caller.toString(),
						gas: message.gasLimit,
						init: bytesToHex(message.data ?? new Uint8Array(0)),
						value: message.value ?? 0n,
					}),
					result: null, // Will be filled in afterMessage
					subtraces: 0, // Will be updated based on child calls
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
					result: null, // Will be filled in afterMessage
					subtraces: 0, // Will be updated based on child calls
					traceAddress,
					type: 'call',
				}

		traces.push(traceEntry)
		traceStack.push({ traceAddress, index: traceIndex })

		next?.()
	})

	/**
	 * After each call/create - capture results and update subtraces count
	 */
	vm.evm.events?.on('afterMessage', async (result, next) => {
		logger.debug(result, 'runCallWithFlatCallTrace: afterMessage event')

		const stackEntry = traceStack.pop()
		if (!stackEntry) {
			logger.warn('runCallWithFlatCallTrace: no stack entry for afterMessage')
			next?.()
			return
		}

		const traceEntry = traces[stackEntry.index]
		if (!traceEntry) {
			logger.warn('runCallWithFlatCallTrace: trace entry not found')
			next?.()
			return
		}

		// Handle errors
		if (result.execResult?.exceptionError) {
			traceEntry.error = result.execResult.exceptionError.error

			// Extract revert reason if available
			if (result.execResult.exceptionError.error.includes('revert') && result.execResult.returnValue) {
				traceEntry.revertReason = decodeRevertReason(bytesToHex(result.execResult.returnValue))
			}

			// For failed calls, result is null
			traceEntry.result = null
		} else {
			// Set result based on type
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

		// Update parent's subtrace count
		if (traceStack.length > 0) {
			const parentStackEntry = traceStack[traceStack.length - 1]
			if (parentStackEntry) {
				const parentEntry = traces[parentStackEntry.index]
				if (parentEntry) {
					parentEntry.subtraces++
				}
			}
		}

		next?.()
	})

	if (lazilyRun) {
		// Return object with trace without running EVM
		return /** @type {any} */ ({ trace: traces })
	}

	// Execute the call
	const runCallResult = await vm.evm.runCall(params)

	logger.debug(runCallResult, 'runCallWithFlatCallTrace: evm run call complete')

	return {
		...runCallResult,
		trace: traces,
	}
}
