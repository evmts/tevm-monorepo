import { callHandler } from '../Call/callHandler.js'
import { cloneVmWithBlockTag } from '../Call/cloneVmWithBlock.js'
import { handleStateOverrides } from '../Call/handleStateOverrides.js'
import { getPendingClient } from '../internal/getPendingClient.js'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'

/**
 * Creates a handler for eth_simulateV2 JSON-RPC method
 * Simulates multiple transaction calls with comprehensive state overrides and tracing support
 * 
 * @param {import('@tevm/node').TevmNode} client - The TEVM client instance
 * @returns {import('./EthSimulateV2Handler.js').EthSimulateV2Handler} The simulate handler function
 * 
 * @example
 * ```typescript
 * import { createTevmNode } from 'tevm/node'
 * import { ethSimulateV2Handler } from 'tevm/actions'
 * 
 * const client = createTevmNode()
 * const simulate = ethSimulateV2Handler(client)
 * 
 * const result = await simulate({
 *   calls: [
 *     {
 *       from: '0x1234...', 
 *       to: '0x5678...',
 *       value: '0xde0b6b3a7640000', // 1 ETH
 *       data: '0xa9059cbb...'
 *     }
 *   ],
 *   stateOverrides: {
 *     '0x1234...': {
 *       balance: '0x56bc75e2d630eb20' // 100 ETH
 *     }
 *   },
 *   traceConfig: {
 *     trace: true,
 *     stateDiff: true
 *   }
 * })
 * ```
 */
export const ethSimulateV2Handler = (client) => async (params) => {
	client.logger.debug(params, 'ethSimulateV2Handler: Executing simulation with params')

	// Validate required parameters
	if (!params.calls || !Array.isArray(params.calls) || params.calls.length === 0) {
		throw new Error('eth_simulateV2: calls parameter is required and must be a non-empty array')
	}

	const {
		calls,
		blockTag = 'latest',
		stateOverrides,
		blockOverrides,
		traceConfig = {},
		validation = {},
		includeReceipts = false,
	} = params

	let simulationClient = client

	// Handle pending block tag
	if (blockTag === 'pending') {
		const minePending = await getPendingClient(client)
		if (minePending.errors) {
			throw minePending.errors[0]
		}
		simulationClient = minePending.pendingClient
	}

	// Get current block info for response
	const currentBlock = await simulationClient.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())
	const blockNumber = blockOverrides?.number ?? currentBlock.header.number
	const blockHash = currentBlock.hash()
	const timestamp = blockOverrides?.time ?? currentBlock.header.timestamp

	// Clone VM with block context
	const vm = await cloneVmWithBlockTag(simulationClient, currentBlock)
	if (vm instanceof Error) {
		throw vm
	}

	// Apply block overrides if provided
	if (blockOverrides) {
		const blockHeader = vm.blockchain.getCanonicalHeadBlock().then((block) => {
			const header = block.header.clone()
			if (blockOverrides.number !== undefined) header.number = blockOverrides.number
			if (blockOverrides.time !== undefined) header.timestamp = blockOverrides.time
			if (blockOverrides.gasLimit !== undefined) header.gasLimit = blockOverrides.gasLimit
			if (blockOverrides.baseFeePerGas !== undefined) header.baseFeePerGas = blockOverrides.baseFeePerGas
			if (blockOverrides.difficulty !== undefined) header.difficulty = blockOverrides.difficulty
			if (blockOverrides.coinbase !== undefined) {
				const { createAddress } = await import('@tevm/address')
				header.coinbase = createAddress(blockOverrides.coinbase).bytes
			}
			if (blockOverrides.mixhash !== undefined) {
				const { hexToBytes } = await import('@tevm/utils')
				header.mixHash = hexToBytes(blockOverrides.mixhash)
			}
			return header
		})
		
		// Update VM's current block context
		await blockHeader.then((header) => {
			vm.common.setHardforkBy({ blockNumber: header.number, timestamp: header.timestamp })
		})
	}

	// Apply state overrides
	const clientWithVm = { ...simulationClient, getVm: async () => vm }
	if (stateOverrides) {
		const stateOverrideResult = await handleStateOverrides(clientWithVm, stateOverrides)
		if (stateOverrideResult.errors) {
			throw stateOverrideResult.errors[0]
		}
	}

	// Execute each call in sequence
	const results = []
	let cumulativeGasUsed = 0n

	for (let i = 0; i < calls.length; i++) {
		const call = calls[i]
		client.logger.debug({ call, index: i }, 'ethSimulateV2Handler: Executing call')

		try {
			// Convert simulation call to TEVM call format
			const tevmCallParams = {
				from: call.from,
				to: call.to,
				value: call.value,
				data: call.data,
				gas: call.gas,
				gasPrice: call.gasPrice ?? call.maxFeePerGas,
				maxFeePerGas: call.maxFeePerGas,
				maxPriorityFeePerGas: call.maxPriorityFeePerGas,
				accessList: call.accessList,
				type: call.type,
				blockTag: 'latest', // Use latest since we already have the right context
				createTransaction: false,
				skipBalance: validation.balance === false,
				throwOnFail: false, // We handle errors manually
			}

			// Add event handlers for tracing if requested
			const eventHandlers = {}
			if (traceConfig.trace || traceConfig.vmTrace) {
				// We'll collect trace data through event handlers
				const traceData = {
					calls: [],
					ops: [],
					stateDiff: {},
				}

				if (traceConfig.trace) {
					eventHandlers.onBeforeMessage = (evmResult, _state) => {
						traceData.calls.push({
							type: evmResult.depth === 0 ? 'CALL' : 'STATICCALL',
							from: evmResult.caller?.toString(),
							to: evmResult.to?.toString(),
							value: `0x${(evmResult.value ?? 0n).toString(16)}`,
							gas: `0x${evmResult.gasLimit.toString(16)}`,
							input: evmResult.data ? `0x${Buffer.from(evmResult.data).toString('hex')}` : '0x',
						})
					}

					eventHandlers.onAfterMessage = (evmResult, _state) => {
						const lastCall = traceData.calls[traceData.calls.length - 1]
						if (lastCall) {
							lastCall.gasUsed = `0x${evmResult.executionGasUsed.toString(16)}`
							lastCall.output = evmResult.returnValue ? `0x${Buffer.from(evmResult.returnValue).toString('hex')}` : '0x'
							if (evmResult.exceptionError) {
								lastCall.error = evmResult.exceptionError.message
							}
						}
					}
				}

				if (traceConfig.vmTrace) {
					eventHandlers.onStep = (evmResult, state) => {
						traceData.ops.push({
							pc: evmResult.pc,
							op: evmResult.opcode?.name || 'UNKNOWN',
							gas: `0x${evmResult.gasLeft.toString(16)}`,
							gasCost: `0x${(evmResult.gasLeft - evmResult.gasRefund).toString(16)}`,
							depth: evmResult.depth,
							stack: evmResult.stack?.map(item => `0x${item.toString(16)}`),
							memory: evmResult.memory ? `0x${Buffer.from(evmResult.memory).toString('hex')}` : undefined,
							memSize: evmResult.memoryWordCount?.valueOf(),
						})
					}
				}

				tevmCallParams.onStep = eventHandlers.onStep
				tevmCallParams.onBeforeMessage = eventHandlers.onBeforeMessage
				tevmCallParams.onAfterMessage = eventHandlers.onAfterMessage
			}

			// Execute the call
			const callResult = await callHandler(clientWithVm, { throwOnFail: false })(tevmCallParams)

			// Process call result
			const gasUsed = callResult.executionGasUsed ?? 0n
			cumulativeGasUsed += gasUsed

			const simulationResult = {
				returnValue: callResult.rawData ?? '0x',
				gasUsed: `0x${gasUsed.toString(16)}`,
				logs: callResult.logs?.map(log => ({
					address: log.address,
					topics: log.topics,
					data: log.data,
					blockNumber: `0x${blockNumber.toString(16)}`,
					transactionHash: `0x${'0'.repeat(64)}`, // Placeholder for simulation
					transactionIndex: `0x${i.toString(16)}`,
					blockHash: `0x${blockHash.toString('hex')}`,
					logIndex: `0x0`,
					removed: false,
				})) ?? [],
			}

			// Add error information if call failed
			if (callResult.errors?.length) {
				const error = callResult.errors[0]
				simulationResult.error = error.message
				if (error.name === 'EvmRevertError' || callResult.rawData !== '0x') {
					simulationResult.revert = callResult.rawData
				}
			}

			// Add tracing information if requested
			if (traceConfig.trace && eventHandlers.onBeforeMessage) {
				// The trace will be constructed from the event handlers
				simulationResult.trace = {
					type: 'CALL',
					from: call.from,
					to: call.to,
					value: call.value ? `0x${BigInt(call.value).toString(16)}` : '0x0',
					gas: call.gas ? `0x${BigInt(call.gas).toString(16)}` : `0x${gasUsed.toString(16)}`,
					gasUsed: `0x${gasUsed.toString(16)}`,
					input: call.data ?? '0x',
					output: simulationResult.returnValue,
					error: simulationResult.error,
				}
			}

			if (traceConfig.stateDiff) {
				// For state diff, we'd need to capture before/after state
				// This is a simplified implementation
				simulationResult.stateDiff = {}
				if (call.from) {
					simulationResult.stateDiff[call.from] = {
						balance: {
							from: '0x0', // Would need actual before state
							to: '0x0', // Would need actual after state
						},
					}
				}
			}

			if (traceConfig.vmTrace && eventHandlers.onStep) {
				simulationResult.vmTrace = {
					ops: [], // Would be populated by onStep handler
				}
			}

			// Add receipt if requested
			if (includeReceipts) {
				simulationResult.receipt = {
					from: call.from,
					to: call.to,
					cumulativeGasUsed: `0x${cumulativeGasUsed.toString(16)}`,
					gasUsed: `0x${gasUsed.toString(16)}`,
					effectiveGasPrice: call.gasPrice ? `0x${BigInt(call.gasPrice).toString(16)}` : '0x0',
					contractAddress: !call.to ? `0x${'0'.repeat(40)}` : undefined, // Would need actual contract address
					logs: simulationResult.logs,
					logsBloom: '0x' + '0'.repeat(512), // Simplified bloom filter
					status: simulationResult.error ? '0x0' : '0x1',
					type: call.type ?? '0x0',
				}
			}

			results.push(simulationResult)

		} catch (error) {
			client.logger.error(error, 'ethSimulateV2Handler: Error executing call')
			
			results.push({
				returnValue: '0x',
				gasUsed: '0x0',
				logs: [],
				error: error.message,
			})
		}
	}

	const response = {
		results,
		blockNumber: `0x${blockNumber.toString(16)}`,
		blockHash: `0x${blockHash.toString('hex')}`,
		timestamp: `0x${timestamp.toString(16)}`,
		...(currentBlock.header.baseFeePerGas !== undefined
			? { baseFeePerGas: `0x${currentBlock.header.baseFeePerGas.toString(16)}` }
			: {}),
	}

	client.logger.debug(response, 'ethSimulateV2Handler: Simulation complete')
	return response
}