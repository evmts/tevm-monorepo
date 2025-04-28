import { Effect } from 'effect'
import { BaseError } from 'ox/Errors'

/**
 * Effect wrapper for the ox BaseError class
 * This provides all BaseError functionality but wrapped in Effect for better error handling
 */
export class BaseErrorEffect<cause extends Error | undefined = undefined> extends BaseError<cause> {
	/**
	 * Creates an Effect that will fail with this error
	 * @returns an Effect that fails with this error
	 */
	toEffect<A = never, R = never>(): Effect.Effect<A, BaseErrorEffect<cause>, R> {
		return Effect.fail(this)
	}

	/**
	 * Creates a new BaseErrorEffect from an existing BaseError
	 * @param error - The BaseError to wrap
	 * @returns A new BaseErrorEffect
	 */
	static fromBaseError<C extends Error | undefined = undefined>(error: BaseError<C>): BaseErrorEffect<C> {
		const effectError = new BaseErrorEffect<C>(error.shortMessage, {
			cause: error.cause,
			details: error.details,
			docsPath: error.docsPath,
		})
		return effectError
	}
}

/**
 * Service interface for ErrorsEffect
 */
export interface ErrorsEffectService {
	/**
	 * Creates a BaseErrorEffect with the given message and options
	 */
	createBaseError<C extends Error | undefined = undefined>(
		shortMessage: string,
		options?: BaseError.Options<C>,
	): BaseErrorEffect<C>

	/**
	 * Converts a BaseError to a BaseErrorEffect
	 */
	fromBaseError<C extends Error | undefined = undefined>(error: BaseError<C>): BaseErrorEffect<C>
}
