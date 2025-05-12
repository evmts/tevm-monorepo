import { Int, intSchema, intFromBytes, intFromHex, intFromString } from './common.js'
import { Hex, Bytes } from 'ox'
import { Effect } from 'effect'

/**
 * U8 type schema for 8-bit unsigned integers. This is both a schema and a type.
 * Use Schema.decodeUnknownSync(U8) to decode values.
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *
 *   // As a type
 *   const value: Tevm.Types.U8 = 123n as Tevm.Types.U8
 *
 *   // As a schema
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U8)(123n)
 */
export const U8 = intSchema(8)

/**
 * U8 branded type
 * @example
 *   import { Tevm } from 'tevm'
 *   const value: Tevm.Types.U8 = 123n as Tevm.Types.U8
 */
export type U8 = Int<8>

/**
 * Decodes a Uint8Array into a U8 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const bytes = new Uint8Array([1,2,3])
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U8FromBytes)(bytes)
 */
export const U8FromBytes = intFromBytes(8)

/**
 * Decodes a hex string into a U8 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U8FromHex)('0x01')
 */
export const U8FromHex = intFromHex(8)

/**
 * Decodes a string into a U8 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U8FromString)('123')
 */
export const U8FromString = intFromString(8)

/**
 * Converts a U8 value to its hex string representation
 * @param value - The U8 value to convert
 * @returns An Effect that resolves to the hex string representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = 255n as Tevm.Types.U8
 *   Effect.runSync(Tevm.Types.U8ToHex(value)) // => '0xff'
 */
export const U8ToHex = (value: U8): Effect.Effect<string, never, never> =>
	Effect.succeed(Hex.fromNumber(value))

/**
 * Converts a U8 value to its bytes representation
 * @param value - The U8 value to convert
 * @returns An Effect that resolves to the bytes representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = 255n as Tevm.Types.U8
 *   Effect.runSync(Tevm.Types.U8ToBytes(value)) // => Uint8Array([0, ..., 255])
 */
export const U8ToBytes = (value: U8): Effect.Effect<Uint8Array, never, never> =>
	Effect.succeed(Bytes.fromNumber(value))