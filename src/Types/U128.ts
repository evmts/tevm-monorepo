import { Int, intSchema, intFromBytes, intFromHex, intFromString } from './common.js'
import { Hex, Bytes } from 'ox'
import { Effect } from 'effect'

/**
 * U128 type schema for 128-bit unsigned integers. This is both a schema and a type.
 * Use Schema.decodeUnknownSync(U128) to decode values.
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *
 *   // As a type
 *   const value: Tevm.Types.U128 = 123n as Tevm.Types.U128
 *
 *   // As a schema
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U128)(123n)
 */
export const U128 = intSchema(128)

/**
 * U128 branded type
 * @example
 *   import { Tevm } from 'tevm'
 *   const value: Tevm.Types.U128 = 123n as Tevm.Types.U128
 */
export type U128 = Int<128>

/**
 * Decodes a Uint8Array into a U128 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const bytes = new Uint8Array([1,2,3])
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U128FromBytes)(bytes)
 */
export const U128FromBytes = intFromBytes(128)

/**
 * Decodes a hex string into a U128 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U128FromHex)('0x01')
 */
export const U128FromHex = intFromHex(128)

/**
 * Decodes a string into a U128 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U128FromString)('123')
 */
export const U128FromString = intFromString(128)

/**
 * Converts a U128 value to its hex string representation
 * @param value - The U128 value to convert
 * @returns An Effect that resolves to the hex string representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = 255n as Tevm.Types.U128
 *   Effect.runSync(Tevm.Types.U128ToHex(value)) // => '0xff'
 */
export const U128ToHex = (value: U128): Effect.Effect<string, never, never> =>
	Effect.succeed(Hex.fromNumber(value))

/**
 * Converts a U128 value to its bytes representation
 * @param value - The U128 value to convert
 * @returns An Effect that resolves to the bytes representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = 255n as Tevm.Types.U128
 *   Effect.runSync(Tevm.Types.U128ToBytes(value)) // => Uint8Array([0, ..., 255])
 */
export const U128ToBytes = (value: U128): Effect.Effect<Uint8Array, never, never> =>
	Effect.succeed(Bytes.fromNumber(value))