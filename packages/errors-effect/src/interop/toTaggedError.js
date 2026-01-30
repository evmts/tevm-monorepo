import { TevmError } from '../TevmError.js'
import { InsufficientBalanceError } from '../evm/InsufficientBalanceError.js'
import { InvalidOpcodeError } from '../evm/InvalidOpcodeError.js'
import { OutOfGasError } from '../evm/OutOfGasError.js'
import { RevertError } from '../evm/RevertError.js'
import { StackOverflowError } from '../evm/StackOverflowError.js'
import { StackUnderflowError } from '../evm/StackUnderflowError.js'

/**
 * Map of error tags to their TaggedError constructors
 * @type {Record<string, new (props: any) => any>}
 */
const errorMap = {
	InsufficientBalanceError,
	InvalidOpcodeError,
	OutOfGasError,
	RevertError,
	StackOverflowError,
	StackUnderflowError,
}

/**
 * Converts a BaseError from @tevm/errors to a TaggedError from @tevm/errors-effect.
 *
 * This is useful for bridging between the Promise-based API and the Effect-based API.
 *
 * @example
 * ```typescript
 * import { toTaggedError } from '@tevm/errors-effect'
 * import { InsufficientBalanceError as BaseInsufficientBalanceError } from '@tevm/errors'
 * import { Effect } from 'effect'
 *
 * try {
 *   // Some operation that throws a BaseError
 * } catch (error) {
 *   const taggedError = toTaggedError(error)
 *
 *   // Now can use in Effect pipelines
 *   Effect.fail(taggedError)
 * }
 * ```
 *
 * @param {import('@tevm/errors').BaseError | Error | unknown} error - The error to convert
 * @returns {TevmError | InsufficientBalanceError | OutOfGasError | RevertError | InvalidOpcodeError | StackOverflowError | StackUnderflowError} A TaggedError instance
 */
export const toTaggedError = (error) => {
	// If it's already a TaggedError, return as-is
	if (error instanceof TevmError) {
		return error
	}

	// Check for known error types
	for (const [tag, ErrorClass] of Object.entries(errorMap)) {
		if (error instanceof ErrorClass) {
			return error
		}
	}

	// Handle BaseError from @tevm/errors
	if (error && typeof error === 'object' && '_tag' in error) {
		const baseError = /** @type {import('@tevm/errors').BaseError} */ (error)
		const tag = baseError._tag

		// Check if we have a matching TaggedError class
		const ErrorClass = errorMap[tag]
		if (ErrorClass) {
			// Create a TaggedError with properties from the BaseError
			// Different error types have different required properties
			if (tag === 'InsufficientBalanceError') {
				return new InsufficientBalanceError({
					address: /** @type {`0x${string}`} */ ('0x0000000000000000000000000000000000000000'),
					required: 0n,
					available: 0n,
					message: baseError.message,
				})
			}
			if (tag === 'OutOfGasError') {
				return new OutOfGasError({ message: baseError.message })
			}
			if (tag === 'RevertError') {
				return new RevertError({ message: baseError.message })
			}
			if (tag === 'InvalidOpcodeError') {
				return new InvalidOpcodeError({ message: baseError.message })
			}
			if (tag === 'StackOverflowError') {
				return new StackOverflowError({ message: baseError.message })
			}
			if (tag === 'StackUnderflowError') {
				return new StackUnderflowError({ message: baseError.message })
			}
		}

		// Fall back to generic TevmError
		return new TevmError({
			message: baseError.message,
			code: baseError.code ?? 0,
			docsPath: baseError.docsPath,
			cause: baseError.cause,
		})
	}

	// Handle regular Error
	if (error instanceof Error) {
		return new TevmError({
			message: error.message,
			code: 0,
			cause: error,
		})
	}

	// Handle unknown errors
	return new TevmError({
		message: String(error),
		code: 0,
		cause: error,
	})
}
