import { Int, intSchema, intFromBytes, intFromHex, intFromString } from './common.js'
import { Hex, Bytes } from 'ox'
import { Effect } from 'effect'

/**
 * I128 type schema for 128-bit signed integers. This is both a schema and a type.
 * Use Schema.decodeUnknownSync(I128) to decode values.
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *
 *   // As a type
 *   const value: Tevm.Types.I128 = -123n as Tevm.Types.I128
 *
 *   // As a schema
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.I128)(-123n)
 */
export const I128 = intSchema(128)

/**
 * I128 branded type
 * @example
 *   import { Tevm } from 'tevm'
 *   const value: Tevm.Types.I128 = -123n as Tevm.Types.I128
 */
export type I128 = Int<128>

/**
 * Maximum value for a 128-bit signed integer
 * 2^127 - 1 = 170141183460469231731687303715884105727
 */
export const maxI128 = 2n ** 127n - 1n

/**
 * Minimum value for a 128-bit signed integer
 * -(2^127) = -170141183460469231731687303715884105728
 */
export const minI128 = -(2n ** 127n)

/**
 * Decodes a Uint8Array into an I128 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const bytes = new Uint8Array([1,2,3])
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.I128FromBytes)(bytes)
 */
export const I128FromBytes = intFromBytes(128)

/**
 * Decodes a hex string into an I128 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.I128FromHex)('0x01')
 */
export const I128FromHex = intFromHex(128)

/**
 * Decodes a string into an I128 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.I128FromString)('-123')
 */
export const I128FromString = intFromString(128)

/**
 * Converts an I128 value to its hex string representation
 * @param value - The I128 value to convert
 * @returns An Effect that resolves to the hex string representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = -255n as Tevm.Types.I128
 *   Effect.runSync(Tevm.Types.I128ToHex(value)) // => '-0xff'
 */
export const I128ToHex = (value: I128): Effect.Effect<string, never, never> =>
	Effect.succeed(Hex.fromNumber(value))

/**
 * Converts an I128 value to its bytes representation
 * @param value - The I128 value to convert
 * @returns An Effect that resolves to the bytes representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = -255n as Tevm.Types.I128
 *   Effect.runSync(Tevm.Types.I128ToBytes(value)) // => Uint8Array([0, ..., 255])
 */
export const I128ToBytes = (value: I128): Effect.Effect<Uint8Array, never, never> =>
	Effect.succeed(Bytes.fromNumber(value))