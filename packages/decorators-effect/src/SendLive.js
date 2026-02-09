/**
 * @module @tevm/decorators-effect/SendLive
 * Live implementation of the Send service for JSON-RPC
 */

import { Effect, Layer } from 'effect'
import { RequestService } from './RequestService.js'
import { SendService } from './SendService.js'

/**
 * Maps error instances to appropriate JSON-RPC error codes per EIP-1193.
 *
 * Standard JSON-RPC 2.0 Error Codes:
 * - -32700: Parse error
 * - -32600: Invalid request
 * - -32601: Method not found
 * - -32602: Invalid params
 * - -32603: Internal error
 * - -32000 to -32099: Server error (reserved for implementation)
 *
 * @param {unknown} error - The error object
 * @returns {number} The JSON-RPC error code
 */
const getErrorCode = (error) => {
	// Check if error has explicit code property (most custom errors)
	const errorWithCode = /** @type {{ code?: number }} */ (error)
	if (errorWithCode?.code !== undefined && typeof errorWithCode.code === 'number') {
		return errorWithCode.code
	}

	// Map error types by _tag for Effect.ts TaggedErrors
	const errorWithTag = /** @type {{ _tag?: string }} */ (error)
	const tag = errorWithTag?._tag
	switch (tag) {
		// Standard JSON-RPC errors
		case 'InvalidRequestError':
			return -32600
		case 'MethodNotFoundError':
			return -32601
		case 'InvalidParamsError':
			return -32602
		case 'InternalError':
			return -32603

		// EVM/Execution errors (server error range)
		case 'RevertError':
			return 3 // Custom: execution reverted (Ethereum convention)
		case 'OutOfGasError':
			return -32003
		case 'InvalidOpcodeError':
			return -32015
		case 'InvalidJumpError':
			return -32015
		case 'StackOverflowError':
			return -32015
		case 'StackUnderflowError':
			return -32015
		case 'InsufficientFundsError':
			return -32000
		case 'InsufficientBalanceError':
			return -32015

		// Transport/Network errors
		case 'ForkError':
			return -32604
		case 'TimeoutError':
			return -32002
		case 'NetworkError':
			return -32603

		// Transaction errors
		case 'NonceTooLowError':
			return -32003
		case 'NonceTooHighError':
			return -32003
		case 'GasTooLowError':
			return -32003
		case 'InvalidTransactionError':
			return -32003

		// State errors
		case 'StateRootNotFoundError':
			return -32602
		case 'StorageError':
			return -32603
		case 'AccountNotFoundError':
			return -32001

		// Block errors
		case 'BlockNotFoundError':
			return -32001
		case 'InvalidBlockError':
			return -32003
		case 'BlockGasLimitExceededError':
			return -32003

		// Node errors
		case 'NodeNotReadyError':
			return -32603
		case 'SnapshotNotFoundError':
			return -32001
		case 'FilterNotFoundError':
			return -32001

		// Default fallback for unknown errors
		default:
			return -32603
	}
}

/**
 * Live implementation of SendService.
 *
 * Provides JSON-RPC 2.0 compliant send methods by wrapping
 * the RequestService.
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { SendService, SendLive } from '@tevm/decorators-effect'
 * import { RequestLive } from './RequestLive.js'
 *
 * const layer = SendLive.pipe(
 *   Layer.provide(RequestLive)
 * )
 *
 * const program = Effect.gen(function* () {
 *   const sendService = yield* SendService
 *   return yield* sendService.send({
 *     jsonrpc: '2.0',
 *     method: 'eth_blockNumber',
 *     params: [],
 *     id: 1
 *   })
 * })
 *
 * await Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 *
 */
export const SendLive =
	/** @type {Layer.Layer<import('./SendService.js').SendServiceId, never, import('./RequestService.js').RequestService>} */ (
		Layer.effect(
			SendService,
			Effect.gen(function* () {
				const requestService = yield* RequestService

				return {
					send: (request) =>
						Effect.gen(function* () {
							const result = yield* requestService
								.request({
									method: request.method,
									...(request.params !== undefined && { params: request.params }),
								})
								.pipe(
									Effect.map((result) => ({
										jsonrpc: /** @type {const} */ ('2.0'),
										result,
										id: request.id,
									})),
									Effect.catchAll((error) =>
										Effect.succeed({
											jsonrpc: /** @type {const} */ ('2.0'),
											error: {
												// Map error to proper EIP-1193 compliant JSON-RPC error code (Issue #317 fix)
												code: getErrorCode(error),
												message: /** @type {{ message?: string }} */ (error).message || 'Internal error',
												// Include error data with _tag and cause for diagnostics (RFC §6.3 Pattern 3)
												data: {
													_tag: /** @type {any} */ (error)._tag,
													.../** @type {any} */ (error.cause && { cause: String(/** @type {any} */ (error).cause) }),
												},
											},
											id: request.id,
										}),
									),
								)
							return result
						}),

					sendBulk: (requests) =>
						Effect.all(
							requests.map((request) =>
								Effect.gen(function* () {
									const result = yield* requestService
										.request({
											method: request.method,
											...(request.params !== undefined && { params: request.params }),
										})
										.pipe(
											Effect.map((result) => ({
												jsonrpc: /** @type {const} */ ('2.0'),
												result,
												id: request.id,
											})),
											Effect.catchAll((error) =>
												Effect.succeed({
													jsonrpc: /** @type {const} */ ('2.0'),
													error: {
														// Map error to proper EIP-1193 compliant JSON-RPC error code (Issue #317 fix)
														code: getErrorCode(error),
														message: /** @type {{ message?: string }} */ (error).message || 'Internal error',
														// Include error data with _tag and cause for diagnostics (RFC §6.3 Pattern 3)
														data: {
															_tag: /** @type {any} */ (error)._tag,
															.../** @type {any} */ (
																error.cause && {
																	cause: String(/** @type {any} */ (error).cause),
																}
															),
														},
													},
													id: request.id,
												}),
											),
										)
									return result
								}),
							),
						),
				}
			}),
		)
	)
