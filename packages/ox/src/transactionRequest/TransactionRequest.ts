import { Effect } from 'effect'
import Ox from 'ox'

/**
 * Export the core types
 */
export type TransactionRequest = Ox.TransactionRequest.TransactionRequest

/**
 * Error class for assert function
 */
export class AssertError extends Error {
	override name = 'AssertError'
	_tag = 'AssertError'
	constructor(cause: unknown) {
		super('Unexpected error asserting TransactionRequest with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Asserts if the given value is a valid TransactionRequest
 */
export function assert(value: unknown): Effect.Effect<void, AssertError, never> {
	return Effect.try({
		try: () => Ox.TransactionRequest.assert(value),
		catch: (cause) => new AssertError(cause),
	})
}

/**
 * Checks if the given value is a valid TransactionRequest
 */
export function isTransactionRequest(value: unknown): boolean {
	return Ox.TransactionRequest.isTransactionRequest(value)
}

/**
 * Validates a TransactionRequest
 */
export function validate(value: unknown): boolean {
	return Ox.TransactionRequest.validate(value)
}
