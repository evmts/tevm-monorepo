/**
 * @module @evmts/schemas/ethereum/SAddress/parseAddressSafe.js
 * @description Effect parser for Address type
 * @author William Cory <willcory10@gmail.com>
 */

import { InvalidAddressError } from './Errors.js'
import { SAddress } from './SAddress.js'
import { parseEither } from '@effect/schema/Schema'
import { Effect } from 'effect'
import { mapError } from 'effect/Effect'

/**
 * Parses an Address safely into an effect.
 * @template {import("./SAddress.js").Address} TAddress
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
