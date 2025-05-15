import { Int, intSchema, intFromBytes, intFromHex, intFromString } from './common-int.js'
import { Hex, Bytes } from 'ox'
import { Effect } from 'effect'

/**
 * U32 type schema for 32-bit unsigned integers. This is both a schema and a type.
 * Use Schema.decodeUnknownSync(U32) to decode values.
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *
 *   // As a type
 *   const value: Tevm.Types.U32 = 123n as Tevm.Types.U32
 *
 *   // As a schema
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U32)(123n)
 */
export const U32 = intSchema(32)

/**
 * U32 branded type
 * @example
 *   import { Tevm } from 'tevm'
 *   const value: Tevm.Types.U32 = 123n as Tevm.Types.U32
 */
export type U32 = Int<32>

/**
 * Maximum value for a 32-bit unsigned integer
 * 2^32 - 1 = 4294967295
 */
export const maxU32 = 2n ** 32n - 1n

/**
 * Decodes a Uint8Array into a U32 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const bytes = new Uint8Array([1,2,3])
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U32FromBytes)(bytes)
 */
export const U32FromBytes = intFromBytes(32)

/**
 * Decodes a hex string into a U32 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U32FromHex)('0x01')
 */
export const U32FromHex = intFromHex(32)

/**
 * Decodes a string into a U32 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U32FromString)('123')
 */
export const U32FromString = intFromString(32)

/**
 * Converts a U32 value to its hex string representation
 * @param value - The U32 value to convert
 * @returns An Effect that resolves to the hex string representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = 255n as Tevm.Types.U32
 *   Effect.runSync(Tevm.Types.U32ToHex(value)) // => '0xff'
 */
export const U32ToHex = (value: U32): Effect.Effect<string, never, never> =>
	Effect.succeed(Hex.fromNumber(value))

/**
 * Converts a U32 value to its bytes representation
 * @param value - The U32 value to convert
 * @returns An Effect that resolves to the bytes representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = 255n as Tevm.Types.U32
 *   Effect.runSync(Tevm.Types.U32ToBytes(value)) // => Uint8Array([0, ..., 255])
 */
export const U32ToBytes = (value: U32): Effect.Effect<Uint8Array, never, never> =>
	Effect.succeed(Bytes.fromNumber(value))