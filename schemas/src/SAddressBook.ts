import { SAddress } from './SAddress'
import { SBlockNumber } from './SBlockNumber'
import type { ParseErrors } from '@effect/schema/ParseResult'
import { parseEither, record, string, struct } from '@effect/schema/Schema'
import { formatErrors } from '@effect/schema/TreeFormatter'
import type { Address } from 'abitype'
import { Effect } from 'effect'
import { mapError, runSync } from 'effect/Effect'
import type { NonEmptyReadonlyArray } from 'effect/ReadonlyArray'

/**
 * Type representing a valid AddressBook
 * An address book is just a mapping of contract names to their addresses and blockCreated
 * Can be made via the {@link defineAddressBook} utility
 * @example
 * ```ts
 * const addressBook: AddressBook<'ERC20' | 'ERC721'> = {
 *   ERC20: {
 *     blockCreated: 0,
 *     address: '0x1234567890abcdef1234567890abcdef12345678'
 *   },
 *   ERC721: {
 *     blockCreated: 420,
 *     address: '0x4204567890abcdef1234567890abcdef12345678'
 *   }
 * }
 * ```
 */
export type AddressBook<TContractNames extends string> = {
	[name in TContractNames]: {
		blockCreated: number
		address: Address
	}
}

/**
 * Effect/schema for {@link AddressBook} type
 */
export const SAddressBook = record(
	string,
	struct({
		blockCreated: SBlockNumber,
		address: SAddress,
	}),
)

/**
 * Error thrown when a {@link AddressBook} is invalid
 */
export class InvalidAddressBookError extends TypeError {
	override name = InvalidAddressBookError.name
	_tag = InvalidAddressBookError.name
	constructor({
		message = 'Address book is invalid',
		docs = 'https://evmts.dev/reference/errors',
		cause,
	}: {
		message?: string
		docs?: string
		cause?: NonEmptyReadonlyArray<ParseErrors>
	} = {}) {
		super(
			`${InvalidAddressBookError.name}: ${message}
${docs}`,
			{ cause: cause && formatErrors(cause) },
		)
	}
}

/**
 * Parses an {@link AddressBook} safely into an effect
 * Keys can be any string, but by convention are usually a human readable contract name
 * @example
 * ```ts
 * const addressBookEffect = defineAddressBookSafe({
 *   ERC20: {
 *     blockCreated: 0,
 *     address: '0x1234567890abcdef1234567890abcdef12345678'
 *   },
 *   ERC721: {
 *     blockCreated: 420,
 *     address: '0x4204567890abcdef1234567890abcdef12345678'
 *   }
 * })
 * ```
 */
export const parseAddressBookSafe = <TAddressBook extends AddressBook<string>>(
	addressBook: TAddressBook,
): Effect.Effect<never, InvalidAddressBookError, TAddressBook> => {
	return mapError(
		parseEither(SAddressBook)(addressBook, {
			errors: 'all',
			onExcessProperty: 'error',
		}),
		({ errors: cause }) => new InvalidAddressBookError({ cause }),
	) as Effect.Effect<never, InvalidAddressBookError, TAddressBook>
}

/**
 * Creates a validated and typesafe {@link AddressBook}
 * Keys can be any string, but by convention are usually a human readable contract name
 * @example
 * ```ts
 * const addressBook = defineAddressBook({
 *   ERC20: {
 *     blockCreated: 0,
 *     address: '0x1234567890abcdef1234567890abcdef12345678'
 *   },
 *   ERC721: {
 *     blockCreated: 420,
 *     address: '0x4204567890abcdef1234567890abcdef12345678'
 *   }
 * })
 * ```
 */
export const parseAddressBook = <TAddressBook extends AddressBook<string>>(
	addressBook: TAddressBook,
): TAddressBook => {
	return runSync(parseAddressBookSafe(addressBook))
}
