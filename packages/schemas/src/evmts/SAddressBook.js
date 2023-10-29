/**
 * @module AddressBook Schema
 * Types and validators for SAddressBook.
 * An address book is a JSON serializable mapping of contract ids to their blockCreated and address.
 * Contract keys can be anything including the contract address but by convention they are usually a human readable name for the contract.
 */

import { SBlockNumber } from '../common/index.js'
import { SAddress } from '../ethereum/index.js'
import { parseEither, record, string, struct } from '@effect/schema/Schema'
import { formatErrors } from '@effect/schema/TreeFormatter'
import { Effect } from 'effect'
import { mapError, runSync } from 'effect/Effect'
import { isRight } from 'effect/Either'

/**
 * @typedef {Object} AddressBookEntry
 * @property {number} blockCreated
 * @property {import('../ethereum/index.js').Address} address
 */

/**
 * Type representing a valid AddressBook.
 * An address book is a JSON serializable mapping of contract ids to their blockCreated and address.
 * Contract keys can be anything including the contract address but by convention they are usually a human readable name for the contract.
 * @typedef {import("../types.d.ts")} AddressBook
 */

/**
 * Type guard that returns true if an address book is a valid address
 * @typedef {import("../types.d.ts").IsAddressBook} IsAddressBook
 */

/**
 * Type guard that returns true if an address book is a valid address
 * @type {IsAddressBook} isAddressBook
 */
export const isAddressBook = (addressBook) => {
	return isRight(parseEither(SAddressBook)(addressBook))
}

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the AddressBook type.
 * @type {import('@effect/schema/Schema').Schema<AddressBook>}
 */
export const SAddressBook = record(
	string,
	struct({
		blockCreated: SBlockNumber,
		address: SAddress,
	}),
)

/**
 * Error thrown when an AddressBook is invalid.
 */
export class InvalidAddressBookError extends TypeError {
	/**
	 * @param {Object} [options] - The options for the error.
	 * @param {string} [options.message] - The error message.
	 * @param {string} [options.docs] - The documentation URL.
	 * @param {import('effect/ReadonlyArray').NonEmptyReadonlyArray<import('@effect/schema/ParseResult').ParseErrors>} [options.cause] - The cause of the error.
	 */
	constructor({
		message = 'Address book is invalid',
		docs = 'https://evmts.dev/reference/errors',
		cause,
	} = {}) {
		super(`${InvalidAddressBookError.name}: ${message}\n${docs}`)
		this.cause = cause && formatErrors(cause)
	}
}

/**
 * Safely parses an address book into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template {import("./SAddressBook.js").AddressBook} TAddressBook
 * @param {TAddressBook} addressBook
 * @returns {Effect.Effect<never, InvalidAddressBookError, TAddressBook>}
 * @example
 * ```typescript
 * import {parseAddressBookSafe} from '@evmts/schemas'
 * const parsedAddressBookEffect = parseAddressBookSafe({
 *   MyContract: {
 *     blockCreated: 0,
 *     address: '0x1234567890abcdef1234567890abcdef12345678'
 *   }
 * })
 * ```
 */
export const parseAddressBookSafe = (addressBook) => {
	const out =
		/** @type {Effect.Effect<never, InvalidAddressBookError, TAddressBook>} out */
		(
			mapError(
				parseEither(SAddressBook)(addressBook, {
					errors: 'all',
					onExcessProperty: 'error',
				}),
				({ errors: cause }) => new InvalidAddressBookError({ cause }),
			)
		)
	return out
}

/**
 * Parses an address book and returns the value if no errors.
 * @template {import("./SAddressBook.js").AddressBook} TAddressBook
 * @param {TAddressBook} addressBook
 * @returns {TAddressBook}
 * @example
 * ```typescript
 * import {parseAddressBook} from '@evmts/schemas'
 * const parsedAddressBook = parseAddressBook({
 *   MyContract: {
 *     blockCreated: 0,
 *     address: '0x1234567890abcdef1234567890abcdef12345678'
 *   }
 * })
 * ```
 */
export const parseAddressBook = (addressBook) => {
	return runSync(parseAddressBookSafe(addressBook))
}
