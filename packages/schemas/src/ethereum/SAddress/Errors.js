/**
 * @module @evmts/schemas/ethereum/SAddress/Errors.js
 * @description Error types for solidity Address type.
 * @author William Cory <willcory10@gmail.com>
 */

import { formatErrors } from '@effect/schema/TreeFormatter'

/**
 * Error thrown when an Address is invalid.
 * @example
 * ```ts
 * throw new InvalidAddressError({ address: '0x1234' });
 * ```
 * {@link https://docs.soliditylang.org/en/latest/types.html#address Solidity docs}
 */
export class InvalidAddressError extends TypeError {
	/**
	 * @param {Object} options - The options for the error.
	 * @param {unknown} options.address - The invalid address.
	 * @param {import('effect/ReadonlyArray').NonEmptyReadonlyArray<import('@effect/schema/ParseResult').ParseErrors>} [options.cause] - The cause of the error.
	 * @param {string} [options.message] - The error message.
	 * @param {string} [options.docs] - The documentation URL.
	 */
	constructor({
		address,
		cause,
		message = `Provided value ${address} is not a valid Address`,
		docs = 'https://evmts.dev/reference/errors',
	}) {
		super(`${InvalidAddressError.name}: ${message}\n${docs}`)
		this.cause = cause && formatErrors(cause)
	}
}
