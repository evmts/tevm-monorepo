import { type ParseErrors } from '@effect/schema/ParseResult'
import { filter, parseEither, string } from '@effect/schema/Schema'
import { formatErrors } from '@effect/schema/TreeFormatter'
import { type Effect } from 'effect'
import { mapError } from 'effect/Effect'
import { runSync } from 'effect/Effect'
import { isAddress } from 'viem'

import type { Address } from 'abitype'
import type { NonEmptyReadonlyArray } from 'effect/ReadonlyArray'

/**
 * Type representing a valid Ethereum address
 */
export type { Address }

/**
 * Returns a boolean indicating whether the provided string is a valid Address
 */
export { isAddress }

/**
 * Effect/schema for {@link Address} type
 * @example
 * const validAddress = '0x1234567890abcdef1234567890abcdef12345678' as const
 * const invalidAddress = 'not an address'
 */
export const SAddress = string.pipe(
	filter(isAddress, {
		message: (address) => `Invalid address value: ${address}
See https://evmts.dev/reference/errors for more information.`,
	}),
)

/**
 * Error thrown when a {@link Address} is invalid
 */
export class InvalidAddressError extends TypeError {
	override name = InvalidAddressError.name
	_tag = InvalidAddressError.name
	constructor({
		address,
		cause,
		message = `Provided value ${address} is not a valid Address`,
		docs = 'https://evmts.dev/reference/errors',
	}: {
		address: string
		cause?: NonEmptyReadonlyArray<ParseErrors>
		message?: string
		docs?: string
	}) {
		super(
			`${InvalidAddressError.name}: ${message}
${docs}`,
			{ cause: cause && formatErrors(cause) },
		)
	}
}

/**
 * Parses an {@link Address} safely into an effect
 * @example
 * ```typescript
 * // $ExpectType Effect<never, InvalidAddressError, Address>
 * const addressEffect = parseAddressSafe('0x1234567890abcdef1234567890abcdef12345678')
 * ````
 */
export const parseAddressSafe = <TAddress extends Address>(
	address: TAddress,
): Effect.Effect<never, InvalidAddressError, TAddress> => {
	return mapError(
		parseEither(SAddress)(address),
		({ errors: cause }) => new InvalidAddressError({ address, cause }),
	) as Effect.Effect<never, InvalidAddressError, TAddress>
}

/**
 * Parses an {@link Address} returning the address or throwing an {@link InvalidAddressError} if invalid
 * @example
 * ```typescript
 * // $ExpectType '0x1234567890abcdef1234567890abcdef12345678' satisfies Address
 * const address = parseAddress('0x1234567890abcdef1234567890abcdef12345678')
 * ````
 */
export const parseAddress = <TAddress extends Address>(
	address: TAddress,
): TAddress => {
	return runSync(parseAddressSafe(address))
}
