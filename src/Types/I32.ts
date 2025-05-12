import { Int, intSchema, intFromBytes, intFromHex, intFromString } from './common.js'
import { Hex, Bytes } from 'ox'
import { Effect } from 'effect'

/**
 * I32 type schema for 32-bit signed integers. This is both a schema and a type.
 * Use Schema.decodeUnknownSync(I32) to decode values.
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *
 *   // As a type
 *   const value: Tevm.Types.I32 = -123n as Tevm.Types.I32
 *
 *   // As a schema
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.I32)(-123n)
 */
export const I32 = intSchema(32)

/**
 * I32 branded type
 * @example
 *   import { Tevm } from 'tevm'
 *   const value: Tevm.Types.I32 = -123n as Tevm.Types.I32
 */
export type I32 = Int<32>

/**
 * Maximum value for a 32-bit signed integer
 * 2^31 - 1 = 2147483647
 */
export const maxI32 = 2n ** 31n - 1n

/**
 * Minimum value for a 32-bit signed integer
 * -(2^31) = -2147483648
 */
export const minI32 = -(2n ** 31n)

/**
 * Decodes a Uint8Array into an I32 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const bytes = new Uint8Array([1,2,3])
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.I32FromBytes)(bytes)
 */
export const I32FromBytes = intFromBytes(32)

/**
 * Decodes a hex string into an I32 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.I32FromHex)('0x01')
 */
export const I32FromHex = intFromHex(32)

/**
 * Decodes a string into an I32 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.I32FromString)('-123')
 */
export const I32FromString = intFromString(32)

/**
 * Converts an I32 value to its hex string representation
 * @param value - The I32 value to convert
 * @returns An Effect that resolves to the hex string representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = -255n as Tevm.Types.I32
 *   Effect.runSync(Tevm.Types.I32ToHex(value)) // => '-0xff'
 */
export const I32ToHex = (value: I32): Effect.Effect<string, never, never> =>
	Effect.succeed(Hex.fromNumber(value))

/**
 * Converts an I32 value to its bytes representation
 * @param value - The I32 value to convert
 * @returns An Effect that resolves to the bytes representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = -255n as Tevm.Types.I32
 *   Effect.runSync(Tevm.Types.I32ToBytes(value)) // => Uint8Array([0, ..., 255])
 */
export const I32ToBytes = (value: I32): Effect.Effect<Uint8Array, never, never> =>
	Effect.succeed(Bytes.fromNumber(value))