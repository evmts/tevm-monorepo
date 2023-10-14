/**
 * @module Bytes Schema
 * Types and validators for SBytes.
 */

import { formatErrors } from '@effect/schema/TreeFormatter'

/**
 * Error thrown when an invalid Bytes is provided.
 */
export class InvalidBytesError extends TypeError {
	/**
	 * @param {Object} options - The options for the error.
	 * @param {unknown} [options.value] - The invalid hex value.
	 * @param {string} [options.message] - The error message.
	 * @param {string} [options.docs] - The documentation URL.
	 * @param {import('effect/ReadonlyArray').NonEmptyReadonlyArray<import('@effect/schema/ParseResult').ParseErrors>} [options.cause] - The cause of the error.
	 */
	constructor({
		value,
		message = `Provided value ${value} is not a valid Bytes`,
		docs = 'https://evmts.dev/reference/errors',
		cause,
	} = {}) {
		super(`${InvalidBytesError.name}: ${message}\n${docs}`)
		this.cause = cause && formatErrors(cause)
	}
}
