import { Int, intSchema, intFromBytes, intFromHex, intFromString } from './common.js'
import { Hex, Bytes } from 'ox'
import { Effect } from 'effect'

/**
 * I64 type schema for 64-bit signed integers. This is both a schema and a type.
 * Use Schema.decodeUnknownSync(I64) to decode values.
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *
 *   // As a type
 *   const value: Tevm.Types.I64 = -123n as Tevm.Types.I64
 *
 *   // As a schema
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.I64)(-123n)
 */
export const I64 = intSchema(64)

/**
 * I64 branded type
 * @example
 *   import { Tevm } from 'tevm'
 *   const value: Tevm.Types.I64 = -123n as Tevm.Types.I64
 */
export type I64 = Int<64>

/**
 * Decodes a Uint8Array into an I64 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const bytes = new Uint8Array([1,2,3])
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.I64FromBytes)(bytes)
 */
export const I64FromBytes = intFromBytes(64)

/**
 * Decodes a hex string into an I64 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.I64FromHex)('0x01')
 */
export const I64FromHex = intFromHex(64)

/**
 * Decodes a string into an I64 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.I64FromString)('-123')
 */
export const I64FromString = intFromString(64)

/**
 * Converts an I64 value to its hex string representation
 * @param value - The I64 value to convert
 * @returns An Effect that resolves to the hex string representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = -255n as Tevm.Types.I64
 *   Effect.runSync(Tevm.Types.I64ToHex(value)) // => '-0xff'
 */
export const I64ToHex = (value: I64): Effect.Effect<string, never, never> =>
	Effect.succeed(Hex.fromNumber(value))

/**
 * Converts an I64 value to its bytes representation
 * @param value - The I64 value to convert
 * @returns An Effect that resolves to the bytes representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = -255n as Tevm.Types.I64
 *   Effect.runSync(Tevm.Types.I64ToBytes(value)) // => Uint8Array([0, ..., 255])
 */
export const I64ToBytes = (value: I64): Effect.Effect<Uint8Array, never, never> =>
	Effect.succeed(Bytes.fromNumber(value))