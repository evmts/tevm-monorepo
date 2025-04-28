import { bytesToHex, getAddress, toHex } from '@tevm/utils'
import { createEvmError } from '../internal/createEvmError.js'

/**
 * @internal
 * Creates an CallHandler for handling call params with Ethereumjs EVM
 * @param {import('@tevm/vm').RunTxResult} evmResult
 * @param {import('@tevm/utils').Hex | undefined} txHash
 * @param {import('../debug/DebugResult.js').EvmTraceResult | undefined} trace
 * @param {Map<string, Set<string>> | undefined} accessList returned by the evm
 * @returns {import('./CallResult.js').CallResult}
 * @throws {never} any error means the input and output types were invalid or some invariant was broken
 */
export const callHandlerResult = (evmResult, txHash, trace, accessList) => {
	/**
	 * @type {import('./CallResult.js').CallResult}
	 */
	const out = {
		rawData: bytesToHex(evmResult.execResult.returnValue),
		executionGasUsed: evmResult.execResult.executionGasUsed,
	}

	if (trace) {
		out.trace = trace
	}
	if (evmResult.totalGasSpent) {
		out.totalGasSpent = evmResult.totalGasSpent
	}
	if (evmResult.minerValue) {
		out.minerValue = evmResult.minerValue
	}
	if (evmResult.blobGasUsed) {
		out.blobGasUsed = evmResult.blobGasUsed
	}
	if (evmResult.amountSpent) {
		out.amountSpent = evmResult.amountSpent
	}
	if (accessList && evmResult.preimages) {
		out.preimages = Object.fromEntries(
			[...evmResult.preimages.entries()].map(([key, value]) => [key, bytesToHex(value)]),
		)
	}

	if (accessList) {
		// this might break next ethjs release
		out.accessList = /** @type {Record<import('@tevm/utils').Address, Set<import('@tevm/utils').Hex>>} */ (
			Object.fromEntries(
				[...accessList.entries()].map(([address, storageKeys]) => {
					const hexKeys = new Set([...storageKeys].map((key) => `0x${key}`))
					return [`0x${address}`, hexKeys]
				}),
			)
		)
	}
	if (txHash) {
		out.txHash = txHash
	}

	if (evmResult.execResult.gasRefund) {
		out.gasRefund = evmResult.gasRefund ?? evmResult.execResult.gasRefund
	}
	if (evmResult.execResult.selfdestruct) {
		out.selfdestruct = new Set([...evmResult.execResult.selfdestruct].map((address) => getAddress(address)))
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
		if (out.errors === undefined) {
			out.errors = []
		}
		out.errors.push(createEvmError(evmResult.execResult.exceptionError))
	}

	if (evmResult.execResult.createdAddresses) {
		out.createdAddresses = new Set([...evmResult.execResult.createdAddresses].map(getAddress))
	}

	if (evmResult.createdAddress) {
		out.createdAddress = getAddress(evmResult.createdAddress.toString())
	}
	return out
}
