import { bytesToHex, getAddress, isBytes, toHex } from '@tevm/utils'

/**
 * Creates an CallHandler for handling call params with Ethereumjs EVM
 * @param {import('@tevm/evm').EvmResult} evmResult
 * @returns {import('@tevm/actions-types').CallResult}
 */
export const callHandlerResult = (evmResult) => {
	/**
	 * @type {import('@tevm/actions-types').CallResult}
	 */
	const out = {
		rawData: toHex(evmResult.execResult.returnValue),
		executionGasUsed: evmResult.execResult.executionGasUsed,
	}

	if (evmResult.execResult.gasRefund) {
		out.gasRefund = evmResult.execResult.gasRefund
	}
	if (evmResult.execResult.selfdestruct) {
		out.selfdestruct = new Set(
			[...evmResult.execResult.selfdestruct].map((address) =>
				getAddress(address),
			),
		)
	}
	if (evmResult.execResult.gas) {
		out.gas = evmResult.execResult.gas
	}
	if (evmResult.execResult.logs) {
		// type Log = [address: Address, topics: Hex[], data: Hex]
		out.logs = evmResult.execResult.logs.map((log) => {
			const [address, topics, data] = log
			return {
				address: getAddress(toHex(address)),
				topics: topics.map((topic) => toHex(topic)),
				data: toHex(data),
			}
		})
	}
	if (evmResult.execResult.runState) {
		// don't do anything with runState atm
	}
	if (evmResult.execResult.blobGasUsed) {
		out.blobGasUsed = evmResult.execResult.blobGasUsed
	}
	if (evmResult.execResult.exceptionError) {
		out.errors = [
			{
				name: evmResult.execResult.exceptionError.error,
				_tag: evmResult.execResult.exceptionError.error,
				message: isBytes(evmResult.execResult.returnValue)
					? bytesToHex(evmResult.execResult.returnValue)
					: 'There was an error executing call',
			},
		]
	}

	if (evmResult.execResult.createdAddresses) {
		out.createdAddresses = new Set(
			[...evmResult.execResult.createdAddresses].map(getAddress),
		)
	}

	return out
}
