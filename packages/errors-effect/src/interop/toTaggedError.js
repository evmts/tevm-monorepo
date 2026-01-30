import { TevmError } from '../TevmError.js'
import { InsufficientBalanceError } from '../evm/InsufficientBalanceError.js'
import { InvalidOpcodeError } from '../evm/InvalidOpcodeError.js'
import { OutOfGasError } from '../evm/OutOfGasError.js'
import { RevertError } from '../evm/RevertError.js'
import { StackOverflowError } from '../evm/StackOverflowError.js'
import { StackUnderflowError } from '../evm/StackUnderflowError.js'

/**
 * Map of error tags to their TaggedError constructors.
 * Note: 'Revert' is an alias for RevertError to handle errors from @tevm/errors
 * which uses _tag='Revert' while Effect version uses _tag='RevertError'.
 * @type {Record<string, new (props: any) => any>}
 */
const errorMap = {
	InsufficientBalanceError,
	InvalidOpcodeError,
	OutOfGasError,
	Revert: RevertError,
	RevertError,
	StackOverflowError,
	StackUnderflowError,
}

/**
 * Converts a BaseError from @tevm/errors to a TaggedError from @tevm/errors-effect.
 *
 * This is useful for bridging between the Promise-based API and the Effect-based API.
 *
 * Note: Error-specific properties (address, gasUsed, opcode, etc.) will be extracted
 * from the source error if they exist. If the source error doesn't have structured
 * data, only the message will be preserved.
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
	// If it's already a TevmError TaggedError, return as-is
	if (error instanceof TevmError) {
		return error
	}

	// Check if already a known TaggedError type from this package
	// Note: We check using Object.values since instanceof checks work for
	// errors that were created with these exact constructors
	for (const ErrorClass of Object.values(errorMap)) {
		if (error instanceof ErrorClass) {
			return /** @type {InsufficientBalanceError | OutOfGasError | RevertError | InvalidOpcodeError | StackOverflowError | StackUnderflowError} */ (error)
		}
	}

	// Handle BaseError from @tevm/errors (has _tag property but is not an Effect TaggedError)
	if (error && typeof error === 'object' && '_tag' in error) {
		const baseError = /** @type {import('@tevm/errors').BaseError & Record<string, unknown>} */ (error)
		const tag = baseError._tag

		// Check if we have a matching TaggedError class
		const ErrorClass = errorMap[tag]
		if (ErrorClass) {
			// Create a TaggedError with properties from the BaseError
			// Extract error-specific properties if they exist on the source
			// Note: We always preserve the cause property for proper error chaining
			if (tag === 'InsufficientBalanceError') {
				return new InsufficientBalanceError({
					address: typeof baseError.address === 'string' ? /** @type {`0x${string}`} */ (baseError.address) : undefined,
					required: typeof baseError.required === 'bigint' ? baseError.required : undefined,
					available: typeof baseError.available === 'bigint' ? baseError.available : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'OutOfGasError') {
				return new OutOfGasError({
					gasUsed: typeof baseError.gasUsed === 'bigint' ? baseError.gasUsed : undefined,
					gasLimit: typeof baseError.gasLimit === 'bigint' ? baseError.gasLimit : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'RevertError' || tag === 'Revert') {
				return new RevertError({
					// Original @tevm/errors uses 'raw' property, Effect version also uses 'raw'
					raw: typeof baseError.raw === 'string' ? /** @type {`0x${string}`} */ (baseError.raw) : undefined,
					reason: typeof baseError.reason === 'string' ? baseError.reason : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'InvalidOpcodeError') {
				return new InvalidOpcodeError({
					opcode: typeof baseError.opcode === 'number' ? baseError.opcode : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'StackOverflowError') {
				return new StackOverflowError({
					stackSize: typeof baseError.stackSize === 'number' ? baseError.stackSize : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'StackUnderflowError') {
				return new StackUnderflowError({
					requiredItems: typeof baseError.requiredItems === 'number' ? baseError.requiredItems : undefined,
					availableItems: typeof baseError.availableItems === 'number' ? baseError.availableItems : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
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
