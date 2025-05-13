import { Int, intSchema, intFromBytes, intFromHex, intFromString } from './common-int.js'
import { Hex, Bytes } from 'ox'
import { Effect } from 'effect'

/**
 * U16 type schema for 16-bit unsigned integers. This is both a schema and a type.
 * Use Schema.decodeUnknownSync(U16) to decode values.
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *
 *   // As a type
 *   const value: Tevm.Types.U16 = 123n as Tevm.Types.U16
 *
 *   // As a schema
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U16)(123n)
 */
export const U16 = intSchema(16)

/**
 * U16 branded type
 * @example
 *   import { Tevm } from 'tevm'
 *   const value: Tevm.Types.U16 = 123n as Tevm.Types.U16
 */
export type U16 = Int<16>

/**
 * Maximum value for a 16-bit unsigned integer
 * 2^16 - 1 = 65535
 */
export const maxU16 = 2n ** 16n - 1n

/**
 * Decodes a Uint8Array into a U16 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const bytes = new Uint8Array([1,2,3])
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U16FromBytes)(bytes)
 */
export const U16FromBytes = intFromBytes(16)

/**
 * Decodes a hex string into a U16 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U16FromHex)('0x01')
 */
export const U16FromHex = intFromHex(16)

/**
 * Decodes a string into a U16 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U16FromString)('123')
 */
export const U16FromString = intFromString(16)

/**
 * Converts a U16 value to its hex string representation
 * @param value - The U16 value to convert
 * @returns An Effect that resolves to the hex string representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = 255n as Tevm.Types.U16
 *   Effect.runSync(Tevm.Types.U16ToHex(value)) // => '0xff'
 */
export const U16ToHex = (value: U16): Effect.Effect<string, never, never> =>
	Effect.succeed(Hex.fromNumber(value))

/**
 * Converts a U16 value to its bytes representation
 * @param value - The U16 value to convert
 * @returns An Effect that resolves to the bytes representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = 255n as Tevm.Types.U16
 *   Effect.runSync(Tevm.Types.U16ToBytes(value)) // => Uint8Array([0, ..., 255])
 */
export const U16ToBytes = (value: U16): Effect.Effect<Uint8Array, never, never> =>
	Effect.succeed(Bytes.fromNumber(value))