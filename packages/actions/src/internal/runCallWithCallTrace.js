import { DefensiveNullCheckError } from '@tevm/errors'
import { bytesToHex } from '@tevm/utils'
import { decodeRevertReason } from './decodeRevertReason.js'

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
export const runCallWithCallTrace = async (vm, logger, params, lazilyRun = false) => {
	/**
	 * Stack to track nested calls
	 * @type {import('../common/TraceCall.js').TraceCall[]}
	 */
	const callStack = []

	/**
	 * Root trace call that will be returned
	 * @type {import('../common/CallTraceResult.js').CallTraceResult | null}
	 */
	let rootTrace = null

	/**
	 * Before each call/create - build call tree entry
	 */
	vm.evm.events?.on('beforeMessage', async (message, next) => {
		logger.debug(message, 'runCallWithCallTrace: beforeMessage event')

		// Determine the trace type based on message properties
		/** @type {import('../common/TraceType.js').TraceType} */
		let traceType = 'CALL'
		if (message.to === undefined) {
			// Check if this is CREATE2 (has salt) or regular CREATE
			traceType = message.salt !== undefined ? 'CREATE2' : 'CREATE'
		} else if (message.delegatecall) {
			traceType = 'DELEGATECALL'
		} else if (message.isStatic) {
			traceType = 'STATICCALL'
		}
		// Note: SELFDESTRUCT detection would need to be added here if the EVM message
		// structure includes a proper selfdestruct property when those operations occur

		// Create trace call entry
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

		// If this is the root call (depth 0), store it as root trace
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
			// Add this call to the parent's calls array
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

	/**
	 * After each call/create - capture results and gas usage
	 */
	vm.evm.events?.on('afterMessage', async (result, next) => {
		logger.debug(result, 'runCallWithCallTrace: afterMessage event')

		const currentCall = callStack.pop()
		if (!currentCall) {
			logger.warn('runCallWithCallTrace: no current call in stack for afterMessage')
			next?.()
			return
		}

		// Update gas used
		currentCall.gasUsed = result.execResult.executionGasUsed ?? 0n

		// Set output from return value
		if (result.execResult?.returnValue) {
			currentCall.output = bytesToHex(result.execResult.returnValue)
		}

		// Handle contract creation address for both CREATE and CREATE2
		if (result.createdAddress && (currentCall.type === 'CREATE' || currentCall.type === 'CREATE2')) {
			currentCall.to = result.createdAddress.toString()
		}

		// Handle errors
		if (result.execResult?.exceptionError) {
			currentCall.error = result.execResult.exceptionError.error

			// Extract revert reason if available
			if (result.execResult.exceptionError.error.includes('revert')) {
				currentCall.revertReason = decodeRevertReason(bytesToHex(result.execResult.returnValue))
			}
			console.log(currentCall)
		}

		next?.()
	})

	if (lazilyRun) {
		// Return object with trace without running EVM
		return /** @type {any} */ ({ trace: rootTrace })
	}

	// Execute the call
	const runCallResult = await vm.evm.runCall(params)

	logger.debug(runCallResult, 'runCallWithCallTrace: evm run call complete')

	// Ensure we have a root trace
	if (!rootTrace) {
		throw new DefensiveNullCheckError('Expected root trace to be created during call execution')
	}

	rootTrace = /** @type {import('../common/CallTraceResult.js').CallTraceResult} */ (rootTrace)
	// Update root trace with final execution results
	rootTrace.gasUsed = runCallResult.execResult.executionGasUsed
	if (runCallResult.execResult.returnValue) {
		rootTrace.output = bytesToHex(runCallResult.execResult.returnValue)
	}

	// Handle errors at root level
	if (runCallResult.execResult.exceptionError) {
		// Add error property to root trace (cast to any to allow additional properties)
		const rootTraceWithError = /** @type {any} */ (rootTrace)
		rootTraceWithError.error =
			runCallResult.execResult.exceptionError.error || runCallResult.execResult.exceptionError.toString()

		if (runCallResult.execResult.exceptionError.error?.includes('revert')) {
			rootTraceWithError.revertReason = decodeRevertReason(bytesToHex(runCallResult.execResult.returnValue))
		}
	}

	return {
		...runCallResult,
		trace: rootTrace,
	}
}
