import { filter, parseEither, string } from '@effect/schema/Schema'
import { formatErrors } from '@effect/schema/TreeFormatter'
import { Effect } from 'effect'
import { mapError } from 'effect/Effect'
import { runSync } from 'effect/Effect'
import { isAddress } from 'viem'

export { isAddress }

/**
 * @typedef {`0x${string}`} Address - Type representing a valid Ethereum address
 */

/**
 * @typedef {Object} SchemaOptions
 * @property {string} message - The message to display.
 */

/**
 * @typedef {import('@effect/schema/Schema').Schema<string, `0x${string}`>} SAddressSchema
 */

/**
 * @typedef {SAddressSchema} SAddress - Effect/schema for Address type.
 */
export const SAddress = string.pipe(
	filter(isAddress, {
		message: (address) => `Invalid address value: ${address}
See https://evmts.dev/reference/errors for more information.`,
	}),
)

/**
 * Error thrown when an Address is invalid.
 * @example
 * ```ts
 * throw new InvalidAddressError({ address: '0x1234' });
 * ```
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

/**
 * Parses an Address safely into an effect.
 * @template TAddress extends Address
 * @param {TAddress} address - The address to parse.
 * @returns {Effect.Effect<never, InvalidAddressError, TAddress>} - An effect that resolves to the parsed address.
 */
export const parseAddressSafe = (address) => {
	const out =
		/** @type {Effect.Effect<never, InvalidAddressError, TAddress>} - An effect that resolves to the parsed address. */
		(
			mapError(
				parseEither(SAddress)(address),
				({ errors: cause }) => new InvalidAddressError({ address, cause }),
			)
		)
	return out
}

/**
 * Parses an Address returning the address or throwing an InvalidAddressError if invalid.
 * @template TAddress extends Address
 * @param {TAddress} address - The address to parse.
 * @returns {TAddress} - The parsed address.
 * @throws {InvalidAddressError} - If the address is invalid.
 */
export const parseAddress = (address) => {
	return runSync(parseAddressSafe(address))
}
