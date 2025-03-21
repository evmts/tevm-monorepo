import { DefensiveNullCheckError } from '@tevm/errors'
import { bytesToHex, invariant, numberToHex } from '@tevm/utils'

/**
 * @internal
 * Captures the state before and after a transaction for the prestateTracer
 * @param {import('@tevm/vm').Vm} vm
 * @param {import('@tevm/node').TevmNode['logger']} logger
 * @param {import('@tevm/evm').EvmRunCallOpts} params
 * @param {object} tracerConfig
 * @param {boolean} [tracerConfig.diffMode=false] Whether to only capture state differences
 * @returns {Promise<{pre: Record<string, any>, post: Record<string, any>}>}
 */
export const runCallWithPrestateTrace = async (vm, logger, params, tracerConfig = {}) => {
	const diffMode = tracerConfig.diffMode || false
	
	// Capture relevant accounts
	const accounts = new Set()
	if (params.to) accounts.add(params.to.toString())
	if (params.caller) accounts.add(params.caller.toString()) 
	if (params.origin) accounts.add(params.origin.toString())
	
	// Capture pre-execution state
	const pre = {}
	for (const addr of accounts) {
		const account = await vm.stateManager.getAccount(addr)
		if (!account) continue
		
		pre[addr] = {
			balance: account.balance.toString(16),
			nonce: account.nonce
		}
		
		// Get code if it exists
		const code = await vm.stateManager.getContractCode(addr)
		if (code && code.length > 0) {
			pre[addr].code = bytesToHex(code)
		}
		
		// Get storage
		// This is a simplified approach - would need more work for complete implementation
		// to capture all storage slots efficiently
		pre[addr].storage = {}
	}
	
	logger.debug(pre, 'runCallWithPrestateTrace: captured pre-execution state')
	
	// Run the transaction
	const runCallResult = await vm.evm.runCall(params)
	
	// Add any touched accounts (e.g., contract creation, internal calls)
	if (runCallResult.createdAddress) {
		accounts.add(runCallResult.createdAddress.toString())
	}
	
	// Capture post-execution state for the same accounts
	const post = {}
	for (const addr of accounts) {
		const account = await vm.stateManager.getAccount(addr)
		if (!account) continue
		
		// If diffMode is true, only include accounts that changed
		const preAccount = pre[addr] || {}
		const balanceChanged = !preAccount.balance || preAccount.balance !== account.balance.toString(16)
		const nonceChanged = !preAccount.nonce || preAccount.nonce !== account.nonce
		
		if (!diffMode || balanceChanged || nonceChanged) {
			post[addr] = {}
			
			if (!diffMode || balanceChanged) {
				post[addr].balance = account.balance.toString(16)
			}
			
			if (!diffMode || nonceChanged) {
				post[addr].nonce = account.nonce
			}
			
			// Code should only change for newly created contracts
			if (!diffMode && (!preAccount.code || preAccount.code !== account.codeHash.toString(16))) {
				const code = await vm.stateManager.getContractCode(addr)
				if (code && code.length > 0) {
					post[addr].code = bytesToHex(code)
				}
			}
			
			// Storage changes - again simplified approach
			// In a complete implementation, we'd track storage changes during execution
			if (!diffMode) {
				post[addr].storage = {}
			}
		}
	}
	
	logger.debug(post, 'runCallWithPrestateTrace: captured post-execution state')
	
	// Format hex strings for consistent output
	for (const addr in pre) {
		if (pre[addr].balance && !pre[addr].balance.startsWith('0x')) {
			pre[addr].balance = '0x' + pre[addr].balance
		}
	}
	
	for (const addr in post) {
		if (post[addr].balance && !post[addr].balance.startsWith('0x')) {
			post[addr].balance = '0x' + post[addr].balance
		}
	}
	
	return { pre, post }
}

/**
 * @internal
 * Prepares a trace to be listened to. If laizlyRun is true, it will return an object with the trace and not run the evm internally
 * @param {import('@tevm/vm').Vm} vm
 * @param {import('@tevm/node').TevmNode['logger']} logger
 * @param {import('@tevm/evm').EvmRunCallOpts} params
 * @param {boolean} [lazilyRun]
 * @param {string} [tracer='callTracer'] The tracer to use
 * @param {object} [tracerConfig={}] Configuration for the tracer
 * @returns {Promise<import('@tevm/evm').EvmResult & {trace: import('../debug/DebugResult.js').DebugTraceCallResult}>}
 * @throws {never}
 */
export const runCallWithTrace = async (vm, logger, params, lazilyRun = false, tracer = 'callTracer', tracerConfig = {}) => {
	// Handle prestateTracer
	if (tracer === 'prestateTracer') {
		const prestateTrace = await runCallWithPrestateTrace(vm, logger, params, tracerConfig)
		return {
			...await vm.evm.runCall(params),
			trace: prestateTrace,
		}
	}

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
		 * @type {Array<import('../debug/DebugResult.js').DebugTraceCallResult['structLogs'][number]>}
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