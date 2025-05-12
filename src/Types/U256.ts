import { pipe } from 'effect/Function'
import { Schema, Effect } from 'effect'
import { Value, Hex, Bytes } from 'ox'
import { Uint, uintSchema, uintFromBytes, uintFromHex, uintFromString } from './common.js'

/**
 * U256 type schema for 256-bit unsigned integers. This is both a schema and a type.
 * Use Schema.decodeUnknownSync(U256) to decode values.
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *
 *   // As a type
 *   const value: Tevm.Types.U256 = 123n as Tevm.Types.U256
 *
 *   // As a schema
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U256)(123n)
 */
export const U256 = uintSchema(256)

/**
 * U256 branded type
 * @example
 *   import { Tevm } from 'tevm'
 *   const value: Tevm.Types.U256 = 123n as Tevm.Types.U256
 */
export type U256 = Uint<256>

/**
 * Maximum value for a 256-bit unsigned integer
 * 2^256 - 1 = 115792089237316195423570985008687907853269984665640564039457584007913129639935
 */
export const maxU256 = 2n ** 256n - 1n

/**
 * Decodes a Uint8Array into a U256 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const bytes = new Uint8Array([1,2,3])
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U256FromBytes)(bytes)
 */
export const U256FromBytes = uintFromBytes(256)

/**
 * Decodes a hex string into a U256 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U256FromHex)('0x01')
 */
export const U256FromHex = uintFromHex(256)

/**
 * Decodes a string into a U256 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U256FromString)('123')
 */
export const U256FromString = uintFromString(256)

/**
 * Decodes an ether string into a U256 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U256FromEther)('1.0')
 */
export const U256FromEther = pipe(
	Schema.String,
	Schema.transform(
		Schema.BigIntFromSelf,
		{
			decode: (ether: string) => {
				const wei = Value.fromEther(ether)
				const maxValue = (1n << 256n) - 1n
				if (wei > maxValue || wei < 0n) {
					throw new Error(`Value out of range for U256`)
				}
				return wei
			},
			encode: (value: bigint) => Value.formatEther(value),
		},
	),
	Schema.brand(`Uint256`),
)

/**
 * Decodes a gwei string into a U256 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U256FromGwei)('1000000000')
 */
export const U256FromGwei = pipe(
	Schema.String,
	Schema.transform(
		Schema.BigIntFromSelf,
		{
			decode: (gwei: string) => {
				const wei = Value.fromGwei(gwei)
				const maxValue = (1n << 256n) - 1n
				if (wei > maxValue || wei < 0n) {
					throw new Error(`Value out of range for U256`)
				}
				return wei
			},
			encode: (value: bigint) => Value.formatGwei(value),
		},
	),
	Schema.brand(`Uint256`),
)

/**
 * Converts a U256 value to its ether string representation
 * @param value - The U256 value to convert
 * @returns An Effect that resolves to the ether string representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = 1000000000000000000n as Tevm.Types.U256
 *   Effect.runSync(Tevm.Types.U256ToEther(value)) // => '1.0'
 */
export const U256ToEther = (value: U256): Effect.Effect<string, never, never> =>
	Effect.succeed(Value.formatEther(value))

/**
 * Converts a U256 value to its gwei string representation
 * @param value - The U256 value to convert
 * @returns An Effect that resolves to the gwei string representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = 1000000000n as Tevm.Types.U256
 *   Effect.runSync(Tevm.Types.U256ToGwei(value)) // => '1.0'
 */
export const U256ToGwei = (value: U256): Effect.Effect<string, never, never> =>
	Effect.succeed(Value.formatGwei(value))

/**
 * Converts a U256 value to its hex string representation
 * @param value - The U256 value to convert
 * @returns An Effect that resolves to the hex string representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = 255n as Tevm.Types.U256
 *   Effect.runSync(Tevm.Types.U256ToHex(value)) // => '0xff'
 */
export const U256ToHex = (value: U256): Effect.Effect<string, never, never> =>
	Effect.succeed(Hex.fromNumber(value))

/**
 * Converts a U256 value to its bytes representation
 * @param value - The U256 value to convert
 * @returns An Effect that resolves to the bytes representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = 255n as Tevm.Types.U256
 *   Effect.runSync(Tevm.Types.U256ToBytes(value)) // => Uint8Array([0, ..., 255])
 */
export const U256ToBytes = (value: U256): Effect.Effect<Uint8Array, never, never> =>
	Effect.succeed(Bytes.fromNumber(value))