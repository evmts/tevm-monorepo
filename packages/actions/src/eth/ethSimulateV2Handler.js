import { createAddress } from '@tevm/address'
import { bytesToHex, hexToBytes, keccak256 } from '@tevm/utils'
import { handleStateOverrides } from '../Call/handleStateOverrides.js'
import { blockNumberHandler } from './blockNumberHandler.js'

/**
 * The address used for synthetic contract creation events
 * @type {import('@tevm/utils').Address}
 */
const CONTRACT_CREATION_ADDRESS = /** @type {import('@tevm/utils').Address} */ (
	'0xcccccccccccccccccccccccccccccccccccccccc'
)

/**
 * Handler for the `eth_simulateV2` RPC method.
 * Simulates multiple transactions across multiple blocks with optional state and block overrides.
 * Extends V1 with additional features:
 * - Contract creation detection (emits synthetic logs for deployed contracts)
 * - Call traces for debugging
 * - Dynamic gas estimation
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthHandler.js').EthSimulateV2Handler}
 * @example
 * ```javascript
 * import { createTevmNode } from '@tevm/node'
 * import { ethSimulateV2Handler } from '@tevm/actions'
 *
 * const node = createTevmNode()
 * const handler = ethSimulateV2Handler(node)
 * const result = await handler({
 *   blockStateCalls: [
 *     {
 *       calls: [
 *         { from: '0x...', to: '0x...', data: '0x...' }
 *       ]
 *     }
 *   ],
 *   includeContractCreationEvents: true,
 *   includeCallTraces: true
 * })
 * console.log(result)
 * ```
 */
export const ethSimulateV2Handler = (client) => {
	return async (params) => {
		const { logger, getVm } = client
		logger.debug(params, 'ethSimulateV2Handler: executing simulation with params')

		const {
			blockStateCalls,
			blockTag = 'latest',
			includeContractCreationEvents = false,
			includeCallTraces = false,
		} = params

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

		/** @type {import('./EthResult.js').EthSimulateV2BlockResult[]} */
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
			const parentTimestamp = baseBlock.header.timestamp + BigInt(blockIndex) * 12n

			// Build block header with overrides
			const timestamp = blockOverrides?.time ?? parentTimestamp + 12n
			const gasLimit = blockOverrides?.gasLimit ?? baseBlock.header.gasLimit
			const baseFeePerGas = blockOverrides?.baseFee ?? baseBlock.header.baseFeePerGas ?? 0n
			const feeRecipient = blockOverrides?.coinbase

			/** @type {import('./EthResult.js').EthSimulateV2CallResult[]} */
			const callResults = []
			let totalGasUsed = 0n

			// Execute each call in the block
			for (let callIndex = 0; callIndex < (calls ?? []).length; callIndex++) {
				const call = /** @type {import('./EthParams.js').EthSimulateV2Call} */ (calls?.[callIndex])
				const isContractCreation = call.to === undefined

				/** @type {import('@tevm/evm').EvmRunCallOpts} */
				const callParams = {
					...(call.from !== undefined
						? { caller: createAddress(call.from), origin: createAddress(call.from) }
						: {}),
					...(call.to !== undefined ? { to: createAddress(call.to) } : {}),
					...(call.data !== undefined ? { data: hexToBytes(call.data) } : {}),
					...(call.value !== undefined ? { value: call.value } : {}),
					...(call.gas !== undefined ? { gasLimit: call.gas } : { gasLimit: gasLimit }),
					...(call.gasPrice !== undefined ? { gasPrice: call.gasPrice } : {}),
				}

				// Track call trace if requested
				/** @type {import('./EthResult.js').CallTrace | undefined} */
				let trace

				if (includeCallTraces) {
					trace = {
						type: isContractCreation ? 'CREATE' : 'CALL',
						from: /** @type {import('@tevm/utils').Address} */ (call.from ?? '0x0000000000000000000000000000000000000000'),
						...(call.to !== undefined ? { to: call.to } : {}),
						...(call.value !== undefined ? { value: call.value } : {}),
						gas: call.gas ?? gasLimit,
						gasUsed: 0n,
						input: call.data ?? '0x',
						output: '0x',
						calls: [],
					}
				}

				const result = await vm.evm.runCall(callParams)

				const gasUsed = result.execResult.executionGasUsed
				totalGasUsed += gasUsed

				// Update trace with results
				if (trace) {
					trace.gasUsed = gasUsed
					trace.output = bytesToHex(result.execResult.returnValue ?? new Uint8Array(0))
					if (result.execResult.exceptionError) {
						trace.error = result.execResult.exceptionError.error
					}
				}

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

				// V2 feature: Detect contract creation and add synthetic event
				/** @type {import('./EthResult.js').ContractCreationEvent | undefined} */
				let contractCreated

				if (isContractCreation && result.createdAddress && includeContractCreationEvents) {
					const createdAddress = /** @type {import('@tevm/utils').Address} */ (
						bytesToHex(result.createdAddress.bytes)
					)
					const creator = /** @type {import('@tevm/utils').Address} */ (
						call.from ?? '0x0000000000000000000000000000000000000000'
					)
					const code = bytesToHex(result.execResult.returnValue ?? new Uint8Array(0))

					contractCreated = {
						address: createdAddress,
						creator,
						code,
					}

					// Add synthetic log for contract creation
					logs.push({
						address: CONTRACT_CREATION_ADDRESS,
						topics: [
							// Topic[0]: event signature hash for ContractCreated(address,address)
							keccak256(new TextEncoder().encode('ContractCreated(address,address)')),
							// Topic[1]: created contract address (padded to 32 bytes)
							/** @type {import('@tevm/utils').Hex} */ (`0x000000000000000000000000${createdAddress.slice(2)}`),
							// Topic[2]: creator address (padded to 32 bytes)
							/** @type {import('@tevm/utils').Hex} */ (`0x000000000000000000000000${creator.slice(2)}`),
						],
						data: '0x',
						blockNumber,
						transactionHash: /** @type {import('@tevm/utils').Hex} */ (`0x${'0'.repeat(64)}`),
						transactionIndex: BigInt(callIndex),
						blockHash: /** @type {import('@tevm/utils').Hex} */ (`0x${'0'.repeat(64)}`),
						logIndex: BigInt(logs.length),
						removed: false,
					})
				}

				/** @type {import('./EthResult.js').EthSimulateV2CallResult} */
				const callResult = {
					returnData: bytesToHex(result.execResult.returnValue ?? new Uint8Array(0)),
					logs,
					gasUsed,
					status: result.execResult.exceptionError ? 0n : 1n,
					...(contractCreated ? { contractCreated } : {}),
					...(call.estimateGas ? { estimatedGas: gasUsed } : {}),
					...(trace ? { trace } : {}),
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

			/** @type {import('./EthResult.js').EthSimulateV2BlockResult} */
			const blockResult = {
				number: blockNumber,
				hash: blockHash,
				timestamp,
				gasLimit,
				gasUsed: totalGasUsed,
				calls: callResults,
				...(baseFeePerGas > 0n ? { baseFeePerGas } : {}),
				...(feeRecipient ? { feeRecipient } : {}),
			}

			results.push(blockResult)
		}

		return results
	}
}
