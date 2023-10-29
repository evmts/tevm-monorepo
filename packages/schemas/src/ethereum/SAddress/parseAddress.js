/**
 * @module @evmts/schemas/ethereum/SAddress/parseAddress.js
 * @description Parser for Address type
 * @author William Cory <willcory10@gmail.com>
 */

import { parseAddressSafe } from './parseAddressSafe.js'
import { runSync } from 'effect/Effect'

/**
 * Parses an Address returning the address or throwing an InvalidAddressError if invalid.
 * @template {import("./SAddress.js").Address} TAddress
 * @param {TAddress} address - The address to parse.
 * @returns {TAddress} - The parsed address.
 * @throws {InvalidAddressError} - If the address is invalid.
 */
export const parseAddress = (address) => {
	return runSync(parseAddressSafe(address))
}
