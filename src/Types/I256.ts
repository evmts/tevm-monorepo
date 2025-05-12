import { Int, intSchema, intFromBytes, intFromHex, intFromString } from './common.js'
import { Hex, Bytes } from 'ox'
import { Effect } from 'effect'

/**
 * I256 type schema for 256-bit signed integers. This is both a schema and a type.
 * Use Schema.decodeUnknownSync(I256) to decode values.
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *
 *   // As a type
 *   const value: Tevm.Types.I256 = -123n as Tevm.Types.I256
 *
 *   // As a schema
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.I256)(-123n)
 */
export const I256 = intSchema(256)

/**
 * I256 branded type
 * @example
 *   import { Tevm } from 'tevm'
 *   const value: Tevm.Types.I256 = -123n as Tevm.Types.I256
 */
export type I256 = Int<256>

/**
 * Maximum value for a 256-bit signed integer
 * 2^255 - 1 = 57896044618658097711785492504343953926634992332820282019728792003956564819967
 */
export const maxI256 = 2n ** 255n - 1n

/**
 * Minimum value for a 256-bit signed integer
 * -(2^255) = -57896044618658097711785492504343953926634992332820282019728792003956564819968
 */
export const minI256 = -(2n ** 255n)

/**
 * Decodes a Uint8Array into an I256 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const bytes = new Uint8Array([1,2,3])
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.I256FromBytes)(bytes)
 */
export const I256FromBytes = intFromBytes(256)

/**
 * Decodes a hex string into an I256 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.I256FromHex)('0x01')
 */
export const I256FromHex = intFromHex(256)

/**
 * Decodes a string into an I256 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.I256FromString)('-123')
 */
export const I256FromString = intFromString(256)

/**
 * Converts an I256 value to its hex string representation
 * @param value - The I256 value to convert
 * @returns An Effect that resolves to the hex string representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = -255n as Tevm.Types.I256
 *   Effect.runSync(Tevm.Types.I256ToHex(value)) // => '-0xff'
 */
export const I256ToHex = (value: I256): Effect.Effect<string, never, never> =>
	Effect.succeed(Hex.fromNumber(value))

/**
 * Converts an I256 value to its bytes representation
 * @param value - The I256 value to convert
 * @returns An Effect that resolves to the bytes representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = -255n as Tevm.Types.I256
 *   Effect.runSync(Tevm.Types.I256ToBytes(value)) // => Uint8Array([0, ..., 255])
 */
export const I256ToBytes = (value: I256): Effect.Effect<Uint8Array, never, never> =>
	Effect.succeed(Bytes.fromNumber(value))