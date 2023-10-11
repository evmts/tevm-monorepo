/**
 * @module @evmts/schemas/ethereum/SAddress/SAddress.js
 * @description Types and schema for solidity Address
 * @author William Cory <willcory10@gmail.com>
 */

import { isAddress } from './isAddress.js'
import { filter, string } from '@effect/schema/Schema'

/**
 * @typedef {`0x${string}`} Address - Type representing a valid Ethereum address
 * {@link https://docs.soliditylang.org/en/latest/types.html#address Solidity docs}
 */

/**
 * @typedef {Object} SchemaOptions
 * @property {string} message - The message to display.
 */

/**
 * @typedef {import('@effect/schema/Schema').Schema<string, `0x${string}`>} SAddressSchema
 * {@link https://github.com/Effect-TS/schema effect/schema} representing a valid Ethereum address.
 * {@link https://docs.soliditylang.org/en/latest/types.html#address Solidity docs}
 */

/**
 * @typedef {SAddressSchema} SAddress - Effect/schema for Address type.
 * {@link https://github.com/Effect-TS/schema effect/schema} representing a valid Ethereum address.
 * {@link https://docs.soliditylang.org/en/latest/types.html#address Solidity docs}
 */
export const SAddress = string.pipe(
	filter(isAddress, {
		message: (address) => `Invalid address value: ${address}
See https://evmts.dev/reference/errors for more information.`,
	}),
)
