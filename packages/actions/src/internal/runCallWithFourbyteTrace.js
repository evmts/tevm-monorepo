import { bytesToHex } from '@tevm/utils'

/**
 * @internal
 * Prepares a trace to collect 4-byte function selectors from contract calls
 * @param {import('@tevm/vm').Vm} vm
 * @param {import('@tevm/node').TevmNode['logger']} logger
 * @param {import('@tevm/evm').EvmRunCallOpts} params
 * @param {boolean} [lazilyRun]
 * @returns {Promise<import('@tevm/evm').EvmResult & {trace: import('../common/FourbyteTraceResult.js').FourbyteTraceResult}>}
 * @throws {never}
 */
export const runCallWithFourbyteTrace = async (vm, logger, params, lazilyRun = false) => {
	/**
	 * Map of selector-calldata_size keys to their call counts
	 * Format: "0x{selector}-{calldata_size}" -> count
	 * @type {Record<string, number>}
	 */
	const selectors = {}

	/**
	 * Extract 4-byte selector and calldata size from call data
	 * @param {Uint8Array} data - Call data
	 * @returns {{key: string, selector: string, calldataSize: number} | null} - Formatted key and components or null if data is too short
	 */
	const extractSelectorAndSize = (data) => {
		if (data.length >= 4) {
			const selector = bytesToHex(data.slice(0, 4))
			const calldataSize = data.length - 4 // Size excluding the 4-byte selector
			const key = `${selector}-${calldataSize}`
			return { key, selector, calldataSize }
		}
		return null
	}

	/**
	 * Before each call/create - collect function selectors
	 *
	 * This will capture inner-contract calls if they generate a "CALL" opcode (i.e. `this.function()`);
	 * which is not the case for a "JUMP" opcode (i.e. `function()`)
	 */
	vm.evm.events?.on('beforeMessage', async (message, next) => {
		logger.debug(message, 'runCallWithFourbyteTrace: beforeMessage event')

		// Only process CALL, DELEGATECALL, and STATICCALL operations
		// Skip CREATE and CREATE2 as they don't have function selectors
		if (message.to && message.data && message.data.length >= 4) {
			const result = extractSelectorAndSize(message.data)
			if (result) {
				// Increment counter for this selector-calldata_size combination
				selectors[result.key] = (selectors[result.key] ?? 0) + 1
				logger.debug(
					{
						key: result.key,
						selector: result.selector,
						calldataSize: result.calldataSize,
						count: selectors[result.key],
					},
					'runCallWithFourbyteTrace: collected selector with calldata size',
				)
			}
		}

		next?.()
	})

	if (lazilyRun) {
		// Return object with trace without running EVM
		return /** @type {any} */ ({ trace: selectors })
	}

	// Execute the call
	const runCallResult = await vm.evm.runCall(params)

	logger.debug(runCallResult, 'runCallWithFourbyteTrace: evm run call complete')
	logger.debug(selectors, 'runCallWithFourbyteTrace: collected selectors')

	return {
		...runCallResult,
		trace: selectors,
	}
}
