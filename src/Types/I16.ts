import { Int, intSchema, intFromBytes, intFromHex, intFromString } from './common.js'
import { Hex, Bytes } from 'ox'
import { Effect } from 'effect'

/**
 * I16 type schema for 16-bit signed integers. This is both a schema and a type.
 * Use Schema.decodeUnknownSync(I16) to decode values.
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *
 *   // As a type
 *   const value: Tevm.Types.I16 = -123n as Tevm.Types.I16
 *
 *   // As a schema
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.I16)(-123n)
 */
export const I16 = intSchema(16)

/**
 * I16 branded type
 * @example
 *   import { Tevm } from 'tevm'
 *   const value: Tevm.Types.I16 = -123n as Tevm.Types.I16
 */
export type I16 = Int<16>

/**
 * Maximum value for a 16-bit signed integer
 * 2^15 - 1 = 32767
 */
export const maxI16 = 2n ** 15n - 1n

/**
 * Minimum value for a 16-bit signed integer
 * -(2^15) = -32768
 */
export const minI16 = -(2n ** 15n)

/**
 * Decodes a Uint8Array into an I16 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const bytes = new Uint8Array([1,2,3])
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.I16FromBytes)(bytes)
 */
export const I16FromBytes = intFromBytes(16)

/**
 * Decodes a hex string into an I16 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.I16FromHex)('0x01')
 */
export const I16FromHex = intFromHex(16)

/**
 * Decodes a string into an I16 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.I16FromString)('-123')
 */
export const I16FromString = intFromString(16)

/**
 * Converts an I16 value to its hex string representation
 * @param value - The I16 value to convert
 * @returns An Effect that resolves to the hex string representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = -255n as Tevm.Types.I16
 *   Effect.runSync(Tevm.Types.I16ToHex(value)) // => '-0xff'
 */
export const I16ToHex = (value: I16): Effect.Effect<string, never, never> =>
	Effect.succeed(Hex.fromNumber(value))

/**
 * Converts an I16 value to its bytes representation
 * @param value - The I16 value to convert
 * @returns An Effect that resolves to the bytes representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = -255n as Tevm.Types.I16
 *   Effect.runSync(Tevm.Types.I16ToBytes(value)) // => Uint8Array([0, ..., 255])
 */
export const I16ToBytes = (value: I16): Effect.Effect<Uint8Array, never, never> =>
	Effect.succeed(Bytes.fromNumber(value))