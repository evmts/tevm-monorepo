import { Brand, Effect, Schema } from 'effect'
import { pipe } from 'effect/Function'
import { fromHex } from 'viem/utils'

/**
 * Sign enum for representing positive, negative, and zero values
 */
export enum Sign {
	Negative = -1,
	Zero = 0,
	Positive = 1,
}

/**
 * Generic signed integer with a specified bit size
 */
export type Signed<BITS extends number> = bigint & Brand.Brand<`Signed${BITS}`>

/**
 * Creates a Schema for validating Signed values
 * @param bits - The bit size of the integer.
 */
export const signedSchema = <BITS extends number>(bits: BITS): Schema.Schema<Signed<BITS>, bigint> => {
	const maxValue = (1n << BigInt(bits - 1)) - 1n
	const minValue = -(1n << BigInt(bits - 1))

	const schema = pipe(
		Schema.BigInt,
		Schema.filter((value: bigint) => value >= minValue && value <= maxValue, {
			message: () => `Expected signed integer within range [${minValue}, ${maxValue}]`,
		}),
		Schema.brand(`Signed${bits}`),
	)

	return schema as unknown as Schema.Schema<Signed<BITS>, bigint>
}

/**
 * Schema for validating I256 values
 */
export const I256 = signedSchema(256)
export type I256 = Signed<256>

/**
 * Schema for validating I64 values
 */
export const I64 = signedSchema(64)
export type I64 = Signed<64>

/**
 * Schema for validating I8 values
 */
export const I8 = signedSchema(8)
export type I8 = Signed<8>

/**
 * Schema for validating I1 values
 */
export const I1 = signedSchema(1)
export type I1 = Signed<1>

/**
 * Schema for validating I0 values (which can only be 0)
 */
// Simple alternative implementation for I0
export const I0 = pipe(Schema.Literal(0n), Schema.brand('Signed0')) as unknown as Schema.Schema<Signed<0>, bigint>
export type I0 = Signed<0>

/**
 * Gets the sign of a Signed value
 * @param value - The Signed value.
 */
export const sign = <BITS extends number>(value: Signed<BITS>): Effect.Effect<Sign> =>
	Effect.sync(() => {
		if (value > 0n) return Sign.Positive
		if (value < 0n) return Sign.Negative
		return Sign.Zero
	})

/**
 * Checks if a Signed value is positive
 * @param value - The Signed value.
 */
export const isPositive = <BITS extends number>(value: Signed<BITS>): Effect.Effect<boolean> =>
	Effect.sync(() => value > 0n)

/**
 * Checks if a Signed value is negative
 * @param value - The Signed value.
 */
export const isNegative = <BITS extends number>(value: Signed<BITS>): Effect.Effect<boolean> =>
	Effect.sync(() => value < 0n)

/**
 * Checks if a Signed value is zero
 * @param value - The Signed value.
 */
export const isZero = <BITS extends number>(value: Signed<BITS>): Effect.Effect<boolean> =>
	Effect.sync(() => value === 0n)

/**
 * Gets the absolute value of a Signed value
 * @param value - The Signed value.
 * @param bits - The bit size of the integer.
 */
export const abs = <BITS extends number>(value: Signed<BITS>, bits: BITS): Effect.Effect<Signed<BITS>, Error> =>
	Effect.gen(function* (_) {
		const schema = signedSchema(bits)
		return yield* _(Schema.decode(schema)(value < 0n ? -value : value))
	})

/**
 * Arithmetic operations for Signed values
 */

/**
 * Adds two Signed values
 * @param a - First Signed value.
 * @param b - Second Signed value.
 * @param bits - The bit size of the integers.
 */
export const add = <BITS extends number>(
	a: Signed<BITS>,
	b: Signed<BITS>,
	bits: BITS,
): Effect.Effect<Signed<BITS>, Error> =>
	Effect.gen(function* (_) {
		const schema = signedSchema(bits)
		return yield* _(Schema.decode(schema)(a + b))
	})

/**
 * Subtracts one Signed value from another
 * @param a - First Signed value.
 * @param b - Second Signed value.
 * @param bits - The bit size of the integers.
 */
export const sub = <BITS extends number>(
	a: Signed<BITS>,
	b: Signed<BITS>,
	bits: BITS,
): Effect.Effect<Signed<BITS>, Error> =>
	Effect.gen(function* (_) {
		const schema = signedSchema(bits)
		return yield* _(Schema.decode(schema)(a - b))
	})

/**
 * Multiplies two Signed values
 * @param a - First Signed value.
 * @param b - Second Signed value.
 * @param bits - The bit size of the integers.
 */
export const mul = <BITS extends number>(
	a: Signed<BITS>,
	b: Signed<BITS>,
	bits: BITS,
): Effect.Effect<Signed<BITS>, Error> =>
	Effect.gen(function* (_) {
		const schema = signedSchema(bits)
		return yield* _(Schema.decode(schema)(a * b))
	})

/**
 * Divides one Signed value by another
 * @param a - First Signed value.
 * @param b - Second Signed value.
 * @param bits - The bit size of the integers.
 */
export const div = <BITS extends number>(
	a: Signed<BITS>,
	b: Signed<BITS>,
	bits: BITS,
): Effect.Effect<Signed<BITS>, Error> =>
	Effect.gen(function* (_) {
		if (b === 0n) {
			return yield* _(Effect.fail(new Error('Division by zero')))
		}

		const schema = signedSchema(bits)
		return yield* _(Schema.decode(schema)(a / b))
	})

/**
 * Performs modulo operation on Signed values
 * @param a - First Signed value.
 * @param b - Second Signed value.
 * @param bits - The bit size of the integers.
 */
export const mod = <BITS extends number>(
	a: Signed<BITS>,
	b: Signed<BITS>,
	bits: BITS,
): Effect.Effect<Signed<BITS>, Error> =>
	Effect.gen(function* (_) {
		if (b === 0n) {
			return yield* _(Effect.fail(new Error('Modulo by zero')))
		}

		const schema = signedSchema(bits)
		return yield* _(Schema.decode(schema)(a % b))
	})

/**
 * Converts a Signed value to bytes using two's complement representation
 * @param value - The Signed value.
 * @param bits - The bit size of the integer.
 */
export const toBytesArray = <BITS extends number>(
	value: Signed<BITS>,
	bits: BITS,
): Effect.Effect<Uint8Array<ArrayBufferLike>> =>
	Effect.sync(() => {
		const bytes = Math.ceil(bits / 8)
		const mask = (1n << BigInt(bits)) - 1n

		// Convert negative value to two's complement
		const unsignedValue = value < 0n ? ((-value ^ mask) + 1n) & mask : value

		// Convert to hex representation
		const hexString = `0x${unsignedValue.toString(16)}`

		// Use viem's fromHex to get the bytes representation
		return fromHex(hexString as `0x${string}`, { size: bytes, to: 'bytes' })
	})

/**
 * Converts bytes in two's complement representation to a Signed value
 * @param bytes - The bytes to convert.
 * @param bits - The bit size of the integer.
 */
export const fromBytes = <BITS extends number>(bytes: Uint8Array, bits: BITS): Effect.Effect<Signed<BITS>, Error> =>
	Effect.gen(function* (_) {
		const schema = signedSchema(bits)

		// Convert bytes to hex string
		const hex = Array.from(bytes)
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('')
		// Ensure we have a valid hex string
		const validHex = hex || '0'

		// Convert to BigInt
		const value = BigInt(`0x${validHex}`)
		const mask = (1n << BigInt(bits)) - 1n
		const msb = 1n << BigInt(bits - 1)

		// Check if the most significant bit is set (negative value)
		const isNegative = (value & msb) !== 0n

		// Convert from two's complement for negative values
		const signedValue = isNegative ? -((value ^ mask) + 1n) : value

		return yield* _(Schema.decode(schema)(signedValue))
	})

/**
 * Performs a left shift operation on a Signed value
 * @param value - The Signed value.
 * @param shift - The number of bits to shift.
 * @param bits - The bit size of the integer.
 */
export const shl = <BITS extends number>(
	value: Signed<BITS>,
	shift: number,
	bits: BITS,
): Effect.Effect<Signed<BITS>, Error> =>
	Effect.gen(function* (_) {
		const schema = signedSchema(bits)
		return yield* _(Schema.decode(schema)(value << BigInt(shift)))
	})

/**
 * Performs a right shift operation on a Signed value
 * @param value - The Signed value.
 * @param shift - The number of bits to shift.
 * @param bits - The bit size of the integer.
 */
export const shr = <BITS extends number>(
	value: Signed<BITS>,
	shift: number,
	bits: BITS,
): Effect.Effect<Signed<BITS>, Error> =>
	Effect.gen(function* (_) {
		const schema = signedSchema(bits)
		return yield* _(Schema.decode(schema)(value >> BigInt(shift)))
	})

/**
 * Performs an arithmetic right shift operation on a Signed value
 * (preserves the sign bit)
 * @param value - The Signed value.
 * @param shift - The number of bits to shift.
 * @param bits - The bit size of the integer.
 */
export const asr = <BITS extends number>(
	value: Signed<BITS>,
	shift: number,
	_bits: BITS,
): Effect.Effect<Signed<BITS>, Error> =>
	Effect.sync(() => {
		// JavaScript's >> is an arithmetic right shift for bigints
		const shifted = value >> BigInt(shift)
		return shifted as Signed<BITS>
	})
