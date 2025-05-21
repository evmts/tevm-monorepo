import { pipe } from 'effect/Function'
import { Schema, Effect } from 'effect'
import { Hex, Bytes } from 'ox'
import { Uint, uintSchema, uintFromBytes, uintFromHex, uintFromString } from './common-int.js'

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
 * Ethereum unit types
 * - wei: 1 wei = 1
 * - kwei: 1 kwei = 10^3 wei
 * - mwei: 1 mwei = 10^6 wei
 * - gwei: 1 gwei = 10^9 wei
 * - szabo: 1 szabo = 10^12 wei
 * - finney: 1 finney = 10^15 wei
 * - ether: 1 ether = 10^18 wei
 */
export type EtherUnit = 'wei' | 'kwei' | 'mwei' | 'gwei' | 'szabo' | 'finney' | 'ether'

/**
 * Scaling constants for Ethereum units in wei in 10**n
 * @example
 * ```javascript
 * const ONE_SZABO = 10**UNIT_SCALES.szabo
 * ```
 */
const UNIT_SCALES = {
	wei: 0n,
	kwei: 3n,
	mwei: 6n,
	gwei: 9n,
	szabo: 12n,
	finney: 15n,
	ether: 18n,
} as const

/**
 * Private helper to convert from a unit string to U256
 * @param value - The value to convert
 * @param unit - The unit to convert from
 * @returns The converted U256 value
 */
const fromUnit = (value: string, unit: EtherUnit): U256 => {
	return (BigInt(value) * 10n ** UNIT_SCALES[unit]) as U256
}

/**
 * Private helper to convert U256 to a unit string
 * @param value - The U256 value to convert
 * @param unit - The unit to convert to
 * @returns The converted string value
 */
const toUnit = (value: U256, unit: EtherUnit): string => {
	return (value / 10n ** UNIT_SCALES[unit]).toString()
}

/**
 * Decodes a wei string into a U256 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U256FromWei)('1000000000000000000')
 */
export const U256FromWei = pipe(
	Schema.String,
	Schema.transform(
		Schema.BigIntFromSelf,
		{
			decode: (fromA: string) => BigInt(fromA),
			encode: (toI: unknown) => (toI as bigint).toString(),
			strict: false
		},
	),
	Schema.brand(`Uint256`),
)

/**
 * Decodes a kwei string into a U256 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U256FromKwei)('1000000')
 */
export const U256FromKwei = pipe(
	Schema.String,
	Schema.transform(
		Schema.BigIntFromSelf,
		{
			decode: (fromA: string) => BigInt(fromA) * 10n ** 3n,
			encode: (toI: unknown) => ((toI as bigint) / 10n ** 3n).toString(),
			strict: false
		},
	),
	Schema.brand(`Uint256`),
)

/**
 * Decodes a mwei string into a U256 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U256FromMwei)('1000')
 */
export const U256FromMwei = pipe(
	Schema.String,
	Schema.transform(
		Schema.BigIntFromSelf,
		{
			decode: (fromA: string) => BigInt(fromA) * 10n ** 6n,
			encode: (toI: unknown) => ((toI as bigint) / 10n ** 6n).toString(),
			strict: false
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
			decode: (fromA: string) => BigInt(fromA) * 10n ** 9n,
			encode: (toI: unknown) => ((toI as bigint) / 10n ** 9n).toString(),
			strict: false
		},
	),
	Schema.brand(`Uint256`),
)

/**
 * Decodes a szabo string into a U256 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U256FromSzabo)('1')
 */
export const U256FromSzabo = pipe(
	Schema.String,
	Schema.transform(
		Schema.BigIntFromSelf,
		{
			decode: (fromA: string) => BigInt(fromA) * 10n ** 12n,
			encode: (toI: unknown) => ((toI as bigint) / 10n ** 12n).toString(),
			strict: false
		},
	),
	Schema.brand(`Uint256`),
)

/**
 * Decodes a finney string into a U256 value
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Schema } from 'effect'
 *   const decoded = Schema.decodeUnknownSync(Tevm.Types.U256FromFinney)('1')
 */
export const U256FromFinney = pipe(
	Schema.String,
	Schema.transform(
		Schema.BigIntFromSelf,
		{
			decode: (fromA: string) => BigInt(fromA) * 10n ** 15n,
			encode: (toI: unknown) => ((toI as bigint) / 10n ** 15n).toString(),
			strict: false
		},
	),
	Schema.brand(`Uint256`),
)

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
			decode: (fromA: string) => BigInt(fromA) * 10n ** 18n,
			encode: (toI: unknown) => ((toI as bigint) / 10n ** 18n).toString(),
			strict: false
		},
	),
	Schema.brand(`Uint256`),
)

/**
 * Converts a U256 value to its wei string representation
 * @param value - The U256 value to convert
 * @returns An Effect that resolves to the wei string representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = 1000000000000000000n as Tevm.Types.U256
 *   Effect.runSync(Tevm.Types.U256ToWei(value)) // => '1000000000000000000'
 */
export const U256ToWei = (value: U256): Effect.Effect<string, never, never> =>
	Effect.succeed(toUnit(value, 'wei'))

/**
 * Converts a U256 value to its kwei string representation
 * @param value - The U256 value to convert
 * @returns An Effect that resolves to the kwei string representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = 1000000n as Tevm.Types.U256
 *   Effect.runSync(Tevm.Types.U256ToKwei(value)) // => '1000'
 */
export const U256ToKwei = (value: U256): Effect.Effect<string, never, never> =>
	Effect.succeed(toUnit(value, 'kwei'))

/**
 * Converts a U256 value to its mwei string representation
 * @param value - The U256 value to convert
 * @returns An Effect that resolves to the mwei string representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = 1000000n as Tevm.Types.U256
 *   Effect.runSync(Tevm.Types.U256ToMwei(value)) // => '1'
 */
export const U256ToMwei = (value: U256): Effect.Effect<string, never, never> =>
	Effect.succeed(toUnit(value, 'mwei'))

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
	Effect.succeed(toUnit(value, 'gwei'))

/**
 * Converts a U256 value to its szabo string representation
 * @param value - The U256 value to convert
 * @returns An Effect that resolves to the szabo string representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = 1000000000000n as Tevm.Types.U256
 *   Effect.runSync(Tevm.Types.U256ToSzabo(value)) // => '1'
 */
export const U256ToSzabo = (value: U256): Effect.Effect<string, never, never> =>
	Effect.succeed(toUnit(value, 'szabo'))

/**
 * Converts a U256 value to its finney string representation
 * @param value - The U256 value to convert
 * @returns An Effect that resolves to the finney string representation
 * @example
 *   import { Tevm } from 'tevm'
 *   import { Effect } from 'effect'
 *   const value = 1000000000000000n as Tevm.Types.U256
 *   Effect.runSync(Tevm.Types.U256ToFinney(value)) // => '1'
 */
export const U256ToFinney = (value: U256): Effect.Effect<string, never, never> =>
	Effect.succeed(toUnit(value, 'finney'))

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
	Effect.succeed(toUnit(value, 'ether'))

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
export const U256ToBytes = (value: U256): Effect.Effect<Uint8Array, never, never> => {
	const bytes = Bytes.fromNumber(value)
	const padded = new Uint8Array(32)
	padded.set(bytes.slice(-32), 32 - bytes.length)
	return Effect.succeed(padded)
}