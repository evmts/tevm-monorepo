import { TransactionFactory } from '@tevm/tx'
import { hexToBytes, hexToNumber, numberToHex } from '@tevm/utils'
import { runTx } from '@tevm/vm'
import { callHandlerOpts } from '../Call/callHandlerOpts.js'
import { callHandlerResult } from '../Call/callHandlerResult.js'
import { cloneVmWithBlockTag } from '../Call/cloneVmWithBlock.js'
import { executeCall } from '../Call/executeCall.js'
import { handleStateOverrides } from '../Call/handleStateOverrides.js'
import { handleTransactionCreation } from '../Call/handleTransactionCreation.js'
import { traceCallHandler } from '../debug/traceCallHandler.js'
import { forkAndCacheBlock } from '../internal/forkAndCacheBlock.js'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'
import { validateSimulateCallParams } from '../internal/validators/validateSimulateCallParams.js'
import { requestProcedure } from '../requestProcedure.js'

/**
 * Simulates a call in the context of a specific block, with the option to simulate after
 * specific transactions in the block.
 *
 * This is similar to `debug_traceTransaction` but allows more flexibility in specifying
 * the target transaction and block, as well as customizing the transaction parameters.
 *
 * @param {import('@tevm/node').TevmNode} client - The TEVM node instance
 * @param {object} [options] - Optional parameters.
 * @param {boolean} [options.throwOnFail=true] - Whether to throw an error on failure.
 * @returns {import('./SimulateCallHandlerType.js').SimulateCallHandler} The simulate handler function.
 * @throws {import('./SimulateCallResult.js').TevmSimulateCallError} If `throwOnFail` is true and simulation fails.
 *
 * @example
 * ```typescript
 * import { createTevmNode } from 'tevm/node'
 * import { simulateCallHandler } from 'tevm/actions'
 *
 * const client = createTevmNode()
 *
 * const simulateCall = simulateCallHandler(client)
 *
 * // Simulate a call on a specific block after a specific transaction
 * const res = await simulateCall({
 *   blockNumber: 1000000n,
 *   transactionIndex: 2, // simulate after 3rd transaction (0-indexed)
 *   to: `0x${'69'.repeat(20)}`,
 *   value: 420n,
 *   skipBalance: true,
 * })
 *
 * // Or override a specific transaction's parameters
 * const res2 = await simulateCall({
 *   blockHash: '0xabcdef...',
 *   transactionHash: '0x123456...',
 *   value: 1000n, // override the original transaction's value
 * })
 * ```
 */
export const simulateCallHandler =
	(client, { throwOnFail: defaultThrowOnFail = true } = {}) =>
	async ({ code, deployedBytecode, onStep, onNewContract, onBeforeMessage, onAfterMessage, ...params }) => {
		client.logger.debug(params, 'simulateCallHandler: Executing simulation with params')

		// Validate the parameters
		const validationResult = validateSimulateCallParams(params)
		if (!validationResult.isValid) {
			client.logger.debug(validationResult.errors, 'Params do not pass validation')
			return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
				errors: validationResult.errors,
				executionGasUsed: 0n,
				rawData: /** @type {`0x${string}`}*/ ('0x'),
				blockNumber: 0n,
			})
		}

		// Determine which block to use
		let blockHash
		let blockNumber
		let transactionIndex = params.transactionIndex
		const transactionHash = params.transactionHash

		// Convert blockNumber to hex if provided
		if (params.blockNumber !== undefined) {
			blockNumber = params.blockNumber
		}

		// Use blockHash if provided
		if (params.blockHash !== undefined) {
			blockHash = params.blockHash
		}

		// Use blockTag if provided (and convert to blockNumber/blockHash)
		if (params.blockTag !== undefined) {
			if (params.blockTag === 'latest' || params.blockTag === 'pending') {
				// Get latest block number
				const blockNumberResponse = await requestProcedure(client)({
					method: 'eth_blockNumber',
					params: [],
					jsonrpc: '2.0',
					id: 1,
				})

				if ('error' in blockNumberResponse) {
					client.logger.error(blockNumberResponse.error, 'Failed to get block number')
					return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
						errors: [new Error(blockNumberResponse.error.message)],
						executionGasUsed: 0n,
						rawData: /** @type {`0x${string}`}*/ ('0x'),
						blockNumber: 0n,
					})
				}

				blockNumber = BigInt(blockNumberResponse.result)
			} else if (params.blockTag === 'earliest') {
				blockNumber = 0n
			} else if (params.blockTag === 'safe' || params.blockTag === 'finalized') {
				// Get safe/finalized block
				const blockResponse = await requestProcedure(client)({
					method: `eth_get${params.blockTag.charAt(0).toUpperCase() + params.blockTag.slice(1)}Block`,
					params: [],
					jsonrpc: '2.0',
					id: 1,
				})

				if ('error' in blockResponse) {
					client.logger.error(blockResponse.error, 'Failed to get block')
					return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
						errors: [new Error(blockResponse.error.message)],
						executionGasUsed: 0n,
						rawData: /** @type {`0x${string}`}*/ ('0x'),
						blockNumber: 0n,
					})
				}

				blockNumber = BigInt(blockResponse.result.number)
			} else if (params.blockTag.startsWith('0x')) {
				// Block hash
				blockHash = params.blockTag
			} else {
				// Try to parse as number
				try {
					blockNumber = BigInt(params.blockTag)
				} catch (e) {
					client.logger.error(e, 'Invalid block tag')
					return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
						errors: [new Error(`Invalid block tag: ${params.blockTag}`)],
						executionGasUsed: 0n,
						rawData: /** @type {`0x${string}`}*/ ('0x'),
						blockNumber: 0n,
					})
				}
			}
		}

		// Get the block to simulate on
		let block

		if (blockHash !== undefined) {
			// Get block by hash
			const blockResponse = await requestProcedure(client)({
				method: 'eth_getBlockByHash',
				params: [blockHash, true],
				jsonrpc: '2.0',
				id: 1,
			})

			if ('error' in blockResponse) {
				client.logger.error(blockResponse.error, 'Failed to get block by hash')
				return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
					errors: [new Error(blockResponse.error.message)],
					executionGasUsed: 0n,
					rawData: /** @type {`0x${string}`}*/ ('0x'),
					blockNumber: 0n,
				})
			}

			block = blockResponse.result
			blockNumber = BigInt(block.number)
		} else if (blockNumber !== undefined) {
			// Get block by number
			const blockResponse = await requestProcedure(client)({
				method: 'eth_getBlockByNumber',
				params: [
					typeof blockNumber === 'bigint' ? `0x${blockNumber.toString(16)}` : `0x${blockNumber.toString(16)}`,
					true,
				],
				jsonrpc: '2.0',
				id: 1,
			})

			if ('error' in blockResponse) {
				client.logger.error(blockResponse.error, 'Failed to get block by number')
				return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
					errors: [new Error(blockResponse.error.message)],
					executionGasUsed: 0n,
					rawData: /** @type {`0x${string}`}*/ ('0x'),
					blockNumber: 0n,
				})
			}

			block = blockResponse.result
		} else {
			// This shouldn't happen due to validation, but just in case
			client.logger.error('No block specified')
			return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
				errors: [new Error('No block specified')],
				executionGasUsed: 0n,
				rawData: /** @type {`0x${string}`}*/ ('0x'),
				blockNumber: 0n,
			})
		}

		// If transaction hash is provided, get the transaction
		let transaction
		if (transactionHash !== undefined) {
			const txResponse = await requestProcedure(client)({
				method: 'eth_getTransactionByHash',
				params: [transactionHash],
				jsonrpc: '2.0',
				id: 1,
			})

			if ('error' in txResponse) {
				client.logger.error(txResponse.error, 'Failed to get transaction by hash')
				return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
					errors: [new Error(txResponse.error.message)],
					executionGasUsed: 0n,
					rawData: /** @type {`0x${string}`}*/ ('0x'),
					blockNumber: blockNumber || 0n,
				})
			}

			transaction = txResponse.result

			// Check if transaction is in the specified block
			if (transaction.blockHash !== block.hash) {
				client.logger.error('Transaction not in specified block')
				return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
					errors: [new Error('Transaction not in specified block')],
					executionGasUsed: 0n,
					rawData: /** @type {`0x${string}`}*/ ('0x'),
					blockNumber: blockNumber || 0n,
				})
			}

			// Set the transaction index if not provided
			if (transactionIndex === undefined) {
				transactionIndex = BigInt(transaction.transactionIndex)
			}
		}

		// Get the VM and prepare for simulation
		const vm = await client.getVm()
		const vmBlock = await vm.blockchain.getBlock(hexToBytes(block.hash))
		const parentBlock = await vm.blockchain.getBlock(vmBlock.header.parentHash)

		// If transactionIndex is provided, find all transactions before it
		/** @type {any[]} */
		const previousTx = []

		if (transactionIndex !== undefined) {
			const txIndex = typeof transactionIndex === 'bigint' ? Number(transactionIndex) : transactionIndex

			if (txIndex >= block.transactions.length) {
				client.logger.error('Transaction index out of bounds')
				return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
					errors: [new Error('Transaction index out of bounds')],
					executionGasUsed: 0n,
					rawData: /** @type {`0x${string}`}*/ ('0x'),
					blockNumber: blockNumber || 0n,
				})
			}

			// Include all transactions before the specified index
			previousTx.push(...block.transactions.filter((_, i) => i < txIndex))
		} else if (!transactionHash) {
			// If no transaction specified, include all transactions in the block
			previousTx.push(...block.transactions)
		}

		// Handle the case where the state root is from a preforked block
		const hasStateRoot = await vm.stateManager.hasStateRoot(parentBlock.header.stateRoot)
		if (!hasStateRoot && client.forkTransport) {
			await forkAndCacheBlock(client, parentBlock)
		} else if (!hasStateRoot) {
			return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
				errors: [new Error('Parent block not found')],
				executionGasUsed: 0n,
				rawData: /** @type {`0x${string}`}*/ ('0x'),
				blockNumber: blockNumber || 0n,
			})
		}

		// Clone the VM for simulation
		const vmClone = await vm.deepCopy()
		await vmClone.stateManager.setStateRoot(parentBlock.header.stateRoot)

		// Execute all previous transactions, committing to the state
		for (const tx of previousTx) {
			await runTx(vmClone)({
				block: parentBlock,
				skipNonce: true,
				skipBalance: true,
				skipHardForkValidation: true,
				skipBlockGasLimitValidation: true,
				tx: await TransactionFactory.fromRPC(tx, {
					freeze: false,
					common: vmClone.common.ethjsCommon,
					allowUnlimitedInitCodeSize: true,
				}),
			})
		}

		// Prepare the call parameters
		const _params = { ...params }

		// If we're simulating a specific transaction, merge its parameters with provided params
		if (transaction) {
			// Use the transaction's parameters as a base, then override with any provided params
			_params.to = _params.to || transaction.to
			_params.from = _params.from || transaction.from
			_params.data = _params.data || transaction.input
			_params.value =
				_params.value !== undefined ? _params.value : transaction.value ? BigInt(transaction.value) : undefined
			_params.gas = _params.gas !== undefined ? _params.gas : transaction.gas ? BigInt(transaction.gas) : undefined
			_params.gasPrice =
				_params.gasPrice !== undefined
					? _params.gasPrice
					: transaction.gasPrice
						? BigInt(transaction.gasPrice)
						: undefined
		}

		// Prepare EVM input for the call
		const callHandlerRes = await callHandlerOpts(client, _params)
		if (callHandlerRes.errors) {
			return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
				errors: callHandlerRes.errors,
				executionGasUsed: 0n,
				rawData: /** @type {`0x${string}`}*/ ('0x'),
				blockNumber: blockNumber || 0n,
			})
		}

		const evmInput = callHandlerRes.data

		// Set the simulated block
		evmInput.block = vmBlock

		// Apply any state overrides
		const stateOverrideResult = await handleStateOverrides(
			{ ...client, getVm: async () => vmClone },
			params.stateOverrideSet,
		)
		if (stateOverrideResult.errors) {
			return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
				errors: stateOverrideResult.errors,
				executionGasUsed: 0n,
				rawData: /** @type {`0x${string}`}*/ ('0x'),
				blockNumber: blockNumber || 0n,
			})
		}

		// Extract event handlers for executeCall
		/** @type {import('../common/CallEvents.js').CallEvents} */
		const eventHandlers = {}
		if (onStep) eventHandlers.onStep = onStep
		if (onNewContract) eventHandlers.onNewContract = onNewContract
		if (onBeforeMessage) eventHandlers.onBeforeMessage = onBeforeMessage
		if (onAfterMessage) eventHandlers.onAfterMessage = onAfterMessage

		// Execute the call
		const executedCall = await executeCall(
			{ ...client, getVm: () => Promise.resolve(vmClone) },
			evmInput,
			_params,
			eventHandlers,
		)

		// Handle errors in call execution
		if ('errors' in executedCall) {
			return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
				executionGasUsed: /** @type {any}*/ (executeCall).rawData ?? 0n,
				rawData: /** @type {any}*/ (executedCall).rawData ?? '0x',
				errors: executedCall.errors,
				blockNumber: blockNumber || 0n,
				...('runTxResult' in executedCall && executedCall.runTxResult !== undefined
					? callHandlerResult(executedCall.runTxResult, undefined, executedCall.trace, executedCall.accessList)
					: {}),
				...('trace' in executedCall && executedCall.trace !== undefined ? { trace: executedCall.trace } : {}),
			})
		}

		// Handle transaction creation if requested
		let txResult = { hash: undefined, errors: undefined }
		if (_params.createTransaction) {
			txResult = await handleTransactionCreation(client, _params, executedCall, evmInput)
			if (txResult.errors) {
				return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
					...callHandlerResult(executedCall.runTxResult, txResult.hash, executedCall.trace, executedCall.accessList),
					errors: txResult.errors,
					blockNumber: blockNumber || 0n,
				})
			}
		}

		// Return successful result
		return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
			...callHandlerResult(executedCall.runTxResult, txResult.hash, executedCall.trace, executedCall.accessList),
			blockNumber: blockNumber || 0n,
		})
	}
