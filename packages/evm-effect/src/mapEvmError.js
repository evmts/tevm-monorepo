/**
 * @module @tevm/evm-effect/mapEvmError
 * @description Maps EVM exceptions to typed EvmExecutionError instances
 */

import {
	InsufficientBalanceError,
	InsufficientFundsError,
	InvalidJumpError,
	InvalidOpcodeError,
	OutOfGasError,
	RevertError,
	StackOverflowError,
	StackUnderflowError,
	TevmError,
} from '@tevm/errors-effect'

/**
 * @typedef {import('./types.js').EvmError} EvmError
 */

/**
 * Maps an EVM exception to a typed EvmError.
 *
 * This function analyzes the error message/type and creates the appropriate
 * typed error from @tevm/errors-effect.
 *
 * Note: @ethereumjs/evm typically returns execution errors in `execResult.exceptionError`
 * rather than throwing. This function handles the rare cases where the EVM actually
 * throws an exception (e.g., invalid parameters, setup errors).
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { mapEvmError } from './mapEvmError.js'
 *
 * const runCall = (opts) => Effect.tryPromise({
 *   try: () => evm.runCall(opts),
 *   catch: (e) => mapEvmError(e)
 * })
 * ```
 *
 * @param {unknown} error - The error thrown by the EVM
 * @returns {EvmError} A typed error instance
 */
export const mapEvmError = (error) => {
	const message = error instanceof Error ? error.message : String(error)
	const lowerMessage = message.toLowerCase()

	// Check for specific EVM error patterns
	if (lowerMessage.includes('out of gas') || lowerMessage.includes('oog')) {
		return new OutOfGasError({
			message,
			cause: error,
		})
	}

	if (lowerMessage.includes('revert')) {
		return new RevertError({
			message,
			cause: error,
		})
	}

	if (lowerMessage.includes('invalid opcode')) {
		return new InvalidOpcodeError({
			message,
			cause: error,
		})
	}

	if (lowerMessage.includes('stack overflow')) {
		return new StackOverflowError({
			message,
			cause: error,
		})
	}

	if (lowerMessage.includes('stack underflow')) {
		return new StackUnderflowError({
			message,
			cause: error,
		})
	}

	if (lowerMessage.includes('insufficient balance')) {
		return new InsufficientBalanceError({
			message,
			cause: error,
		})
	}

	if (lowerMessage.includes('insufficient funds')) {
		return new InsufficientFundsError({
			message,
			cause: error,
		})
	}

	if (lowerMessage.includes('invalid jump') || lowerMessage.includes('bad jump destination')) {
		return new InvalidJumpError({
			message,
			cause: error,
		})
	}

	// Default to TevmError for unrecognized EVM errors
	return new TevmError({
		message: `EVM execution error: ${message}`,
		code: -32000,
		cause: error,
	})
}
