import { Int, intSchema, intFromBytes, intFromHex, intFromString } from './common.js'
import { Hex, Bytes } from 'ox'
import { Effect } from 'effect'

/**
 * U64 type schema for 64-bit unsigned integers. This is both a schema and a type.
 * Use Schema.decodeUnknownSync(U64) to decode values.
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *
 *   // As a type
 *   const value: Tevm.Types.U64 = 123n as Tevm.Types.U64
 *
 *   // As a schema
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U64)(123n)
 */
export const U64 = intSchema(64)

/**
 * U64 branded type
 * @example
 *   import { Tevm } from 'tevm'
 *   const value: Tevm.Types.U64 = 123n as Tevm.Types.U64
 */
export type U64 = Int<64>

/**
 * Decodes a Uint8Array into a U64 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const bytes = new Uint8Array([1,2,3])
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U64FromBytes)(bytes)
 */
export const U64FromBytes = intFromBytes(64)

/**
 * Decodes a hex string into a U64 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U64FromHex)('0x01')
 */
export const U64FromHex = intFromHex(64)

/**
 * Decodes a string into a U64 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U64FromString)('123')
 */
export const U64FromString = intFromString(64)

/**
 * Converts a U64 value to its hex string representation
 * @param value - The U64 value to convert
 * @returns An Effect that resolves to the hex string representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = 255n as Tevm.Types.U64
 *   Effect.runSync(Tevm.Types.U64ToHex(value)) // => '0xff'
 */
export const U64ToHex = (value: U64): Effect.Effect<string, never, never> =>
	Effect.succeed(Hex.fromNumber(value))

/**
 * Converts a U64 value to its bytes representation
 * @param value - The U64 value to convert
 * @returns An Effect that resolves to the bytes representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = 255n as Tevm.Types.U64
 *   Effect.runSync(Tevm.Types.U64ToBytes(value)) // => Uint8Array([0, ..., 255])
 */
export const U64ToBytes = (value: U64): Effect.Effect<Uint8Array, never, never> =>
	Effect.succeed(Bytes.fromNumber(value))