import { createAddress } from '@tevm/address'
import { bytesToHex, hexToBytes, keccak256 } from '@tevm/utils'
import { handleStateOverrides } from '../Call/handleStateOverrides.js'
import { blockNumberHandler } from './blockNumberHandler.js'

/**
 * Handler for the `eth_simulateV1` RPC method.
 * Simulates multiple transactions across multiple blocks with optional state and block overrides.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthHandler.js').EthSimulateV1Handler}
 * @example
 * ```javascript
 * import { createTevmNode } from '@tevm/node'
 * import { ethSimulateV1Handler } from '@tevm/actions'
 *
 * const node = createTevmNode()
 * const handler = ethSimulateV1Handler(node)
 * const result = await handler({
 *   blockStateCalls: [
 *     {
 *       calls: [
 *         { from: '0x...', to: '0x...', data: '0x...' }
 *       ]
 *     }
 *   ]
 * })
 * console.log(result)
 * ```
 */
export const ethSimulateV1Handler = (client) => {
	return async (params) => {
		const { logger, getVm } = client
		logger.debug(params, 'ethSimulateV1Handler: executing simulation with params')

		const { blockStateCalls, blockTag = 'latest' } = params

		if (!blockStateCalls || blockStateCalls.length === 0) {
			throw new Error('blockStateCalls is required and must not be empty')
		}

		// Get the base VM and create a deep copy for simulation
		const baseVm = await getVm()
		const vm = await baseVm.deepCopy()

		// Get the current block number to use as base
		const currentBlockNumber = await blockNumberHandler(client)({})

		// Resolve the starting block number
		const startBlockNumber = (() => {
			if (typeof blockTag === 'bigint') {
				return blockTag
			}
			if (typeof blockTag === 'string' && blockTag.startsWith('0x')) {
				return BigInt(blockTag)
			}
			// Handle block tags
			return currentBlockNumber
		})()

		/** @type {import('./EthResult.js').EthSimulateV1BlockResult[]} */
		const results = []

		// Process each block
		for (let blockIndex = 0; blockIndex < blockStateCalls.length; blockIndex++) {
			const blockStateCall = blockStateCalls[blockIndex]
			if (!blockStateCall) continue

			const { stateOverrides, blockOverrides, calls } = blockStateCall

			// Apply state overrides if provided
			if (stateOverrides) {
				const overrideResult = await handleStateOverrides(
					{ ...client, getVm: () => Promise.resolve(vm) },
					stateOverrides,
				)
				if (overrideResult.errors?.length) {
					throw overrideResult.errors[0]
				}
			}

			// Calculate block number for this simulated block
			const blockNumber = startBlockNumber + BigInt(blockIndex) + 1n

			// Get the base block for defaults (the real block that exists)
			const baseBlock = await vm.blockchain.getBlock(startBlockNumber)

			// For simulated blocks, use the base block's header as parent reference
			// since subsequent simulated blocks don't actually exist in the chain
			const parentTimestamp = baseBlock.header.timestamp + BigInt(blockIndex) * 12n

			// Build block header with overrides
			const timestamp = blockOverrides?.time ?? parentTimestamp + 12n
			const gasLimit = blockOverrides?.gasLimit ?? baseBlock.header.gasLimit
			const baseFeePerGas = blockOverrides?.baseFee ?? baseBlock.header.baseFeePerGas ?? 0n

			/** @type {import('./EthResult.js').EthSimulateV1CallResult[]} */
			const callResults = []
			let totalGasUsed = 0n

			// Execute each call in the block
			for (let callIndex = 0; callIndex < (calls ?? []).length; callIndex++) {
				const call = /** @type {import('./EthParams.js').EthSimulateV1Call} */ (calls?.[callIndex])
				/** @type {import('@tevm/evm').EvmRunCallOpts} */
				const callParams = {
					...(call.from !== undefined ? { caller: createAddress(call.from), origin: createAddress(call.from) } : {}),
					...(call.to !== undefined ? { to: createAddress(call.to) } : {}),
					...(call.data !== undefined ? { data: hexToBytes(call.data) } : {}),
					...(call.value !== undefined ? { value: call.value } : {}),
					...(call.gas !== undefined ? { gasLimit: call.gas } : { gasLimit: gasLimit }),
					...(call.gasPrice !== undefined ? { gasPrice: call.gasPrice } : {}),
				}

				const result = await vm.evm.runCall(callParams)

				const gasUsed = result.execResult.executionGasUsed
				totalGasUsed += gasUsed

				// Convert logs from the execution result
				/** @type {import('../common/FilterLog.js').FilterLog[]} */
				const logs = (result.execResult.logs ?? []).map((log, logIdx) => ({
					address: /** @type {import('@tevm/utils').Address} */ (bytesToHex(log[0])),
					topics: /** @type {import('@tevm/utils').Hex[]} */ (log[1].map((t) => bytesToHex(t))),
					data: bytesToHex(log[2]),
					blockNumber,
					transactionHash: /** @type {import('@tevm/utils').Hex} */ (`0x${'0'.repeat(64)}`),
					transactionIndex: BigInt(callIndex),
					blockHash: /** @type {import('@tevm/utils').Hex} */ (`0x${'0'.repeat(64)}`),
					logIndex: BigInt(logIdx),
					removed: false,
				}))

				/** @type {import('./EthResult.js').EthSimulateV1CallResult} */
				const callResult = {
					returnData: bytesToHex(result.execResult.returnValue ?? new Uint8Array(0)),
					logs,
					gasUsed,
					status: result.execResult.exceptionError ? 0n : 1n,
				}

				if (result.execResult.exceptionError) {
					callResult.error = {
						code: -32000,
						message: result.execResult.exceptionError.error,
						...(result.execResult.returnValue ? { data: bytesToHex(result.execResult.returnValue) } : {}),
					}
				}

				callResults.push(callResult)
			}

			// Build a pseudo block hash (in a real impl this would be computed properly)
			const blockHash = keccak256(new TextEncoder().encode(`block-${blockNumber.toString()}-${timestamp.toString()}`))

			/** @type {import('./EthResult.js').EthSimulateV1BlockResult} */
			const blockResult = {
				number: blockNumber,
				hash: blockHash,
				timestamp,
				gasLimit,
				gasUsed: totalGasUsed,
				calls: callResults,
			}
			if (baseFeePerGas > 0n) {
				blockResult.baseFeePerGas = baseFeePerGas
			}
			results.push(blockResult)
		}

		return results
	}
}
