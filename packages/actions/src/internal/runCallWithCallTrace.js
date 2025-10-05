import { createAddress } from '@tevm/address'
import { bytesToHex, hexToBytes, toHex } from '@tevm/utils'

/**
 * @internal
 * Executes a call with call tracer, which captures the execution flow and call hierarchy
 * @param {import('@tevm/vm').Vm} vm
 * @param {import('@tevm/node').TevmNode['logger']} logger
 * @param {import('@tevm/evm').EvmRunCallOpts} params
 * @returns {Promise<import('@tevm/evm').EvmResult & {trace: import('../common/CallTraceResult.js').CallTraceResult}>}
 * @throws {never}
 */
export const runCallWithCallTrace = async (vm, logger, params) => {
	logger.debug(params, 'runCallWithCallTrace: executing call with call tracer')

	/** @type {import('../common/CallTraceResult.js').CallTraceResult[]} */
	const callStack = []
	/** @type {import('../common/CallTraceResult.js').CallTraceResult | null} */
	let rootCall = null

	// Set up step handler to track calls
	const originalStep = vm.evm.events.on('step', (data, resolve) => {
		// For now, we don't need to track individual steps for call tracing
		resolve?.(data)
	})

	// Track calls via beforeMessage and afterMessage events
	/** @type {WeakMap<any, import('../common/CallTraceResult.js').CallTraceResult>} */
	const messageToTrace = new WeakMap()

	vm.evm.events.on('beforeMessage', (data, resolve) => {
		const { message } = data
		
		/** @type {import('../common/CallTraceResult.js').CallTraceResult} */
		const traceCall = {
			type: message.isStatic ? 'STATICCALL' : message.isDelegateCall ? 'DELEGATECALL' : 'CALL',
			from: message.caller ? `0x${message.caller.toString()}` : '0x0000000000000000000000000000000000000000',
			to: message.codeAddress ? `0x${message.codeAddress.toString()}` : '0x0000000000000000000000000000000000000000',
			value: message.value || 0n,
			gas: message.gasLimit || 0n,
			gasUsed: 0n, // Will be filled after execution
			input: message.data ? bytesToHex(message.data) : '0x',
			output: '0x',
			calls: [],
		}

		messageToTrace.set(message, traceCall)

		// If this is the root call, store it
		if (!rootCall) {
			rootCall = traceCall
		} else {
			// Add to parent call's calls array
			const parentTrace = callStack[callStack.length - 1]
			if (parentTrace) {
				if (!parentTrace.calls) {
					parentTrace.calls = []
				}
				parentTrace.calls.push(traceCall)
			}
		}

		callStack.push(traceCall)
		resolve?.(data)
	})

	vm.evm.events.on('afterMessage', (data, resolve) => {
		const { message } = data
		const traceCall = messageToTrace.get(message)
		
		if (traceCall && callStack.length > 0) {
			const currentTrace = callStack.pop()
			if (currentTrace === traceCall) {
				// Update the trace with execution results
				traceCall.gasUsed = (traceCall.gas || 0n) - (data.execResult?.gas || 0n)
				traceCall.output = data.execResult?.returnValue ? bytesToHex(data.execResult.returnValue) : '0x'
				
				if (data.execResult?.exceptionError) {
					// @ts-ignore - error might not have message property but let's be safe
					traceCall.error = data.execResult.exceptionError.message || 'Unknown error'
				}
			}
		}
		
		resolve?.(data)
	})

	try {
		// Execute the call
		const result = await vm.evm.runCall(params)

		// Clean up event listeners
		vm.evm.events.removeAllListeners('beforeMessage')
		vm.evm.events.removeAllListeners('afterMessage')

		if (!rootCall) {
			// Fallback: create a minimal trace from the direct result
			rootCall = {
				type: 'CALL',
				from: params.caller ? `0x${params.caller.toString()}` : '0x0000000000000000000000000000000000000000',
				to: params.to ? `0x${params.to.toString()}` : '0x0000000000000000000000000000000000000000',
				value: params.value || 0n,
				gas: params.gasLimit || 0n,
				gasUsed: result.gas || 0n,
				input: params.data ? bytesToHex(params.data) : '0x',
				output: result.returnValue ? bytesToHex(result.returnValue) : '0x',
			}
		}

		return {
			...result,
			trace: rootCall,
		}
	} catch (error) {
		// Clean up event listeners on error
		vm.evm.events.removeAllListeners('beforeMessage')
		vm.evm.events.removeAllListeners('afterMessage')
		
		logger.error({ error }, 'runCallWithCallTrace: error during call trace execution')
		throw error
	}
}
