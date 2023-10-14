/**
 * @module Bytes Schema
 * Types and validators for SBytes.
 */

import { filter, string } from '@effect/schema/Schema'
import { isHex } from 'viem'

/**
 * Type representing a valid Bytes.
 * @typedef {`0x${string}`} Bytes
 * @example
 * ```javascript
 * import { Bytes } from '@evmts/schemas';
 * const hex = '0x1234567890abcdef1234567890abcdef12345678' as const satisfies Bytes;
 * ```
 */

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Bytes type.
 * @type {import('@effect/schema/Schema').Schema<string, Bytes>}
 * @example
 * ```javascript
 * import { Schema } from '@effect/schema/Schema';
 * export const SBytes: Schema<string, Bytes>;
 * ```
 */
export const SBytes =
	/** @type {import('@effect/schema/Schema').Schema<string, Bytes>} */
	(
		string.pipe(
			filter(isHex, {
				message: (value) => `Invalid hex value: ${value}
See https://evmts.dev/reference/errors for more information.`,
			}),
		)
	)
