import { Brand, Effect, Schema } from 'effect'
import { pipe } from 'effect/Function'
import { Value, Hex } from 'ox'

/**
 * Generic unsigned integer with a specified bit size
 */
export type Uint<Size extends number> = bigint & Brand.Brand<`Uint${Size}`>

/**
 * Generic signed integer with a specified bit size
 */
export type Int<Size extends number> = bigint & Brand.Brand<`Int${Size}`>

/**
 * Creates a Schema for validating Uint values
 * @param size - The bit size of the integer.
 */
const uintSchema = <Size extends number>(size: Size) => {
	const maxValue = (1n << BigInt(size)) - 1n

	return pipe(
		Schema.BigInt,
		Schema.filter((value: bigint) => value >= 0n && value <= maxValue, {
			message: () => `Expected unsigned integer with maximum value of ${maxValue}`,
		}),
		Schema.brand(`Uint${size}`),
	)
}

/**
 * Creates a Schema for validating Int values
 * @param size - The bit size of the integer.
 */
const intSchema = <Size extends number>(size: Size) => {
	const maxValue = (1n << BigInt(size - 1)) - 1n
	const minValue = -(1n << BigInt(size - 1))

	return pipe(
		Schema.BigInt,
		Schema.filter((value: bigint) => value >= minValue && value <= maxValue, {
			message: () => `Expected signed integer between ${minValue} and ${maxValue}`,
		}),
		Schema.brand(`Int${size}`),
	)
}

/**
 * Schema for converting bytes to a Uint value
 * @param size - The bit size of the integer.
 */
const uintFromBytes = <Size extends number>(size: Size) => {
	const maxValue = (1n << BigInt(size)) - 1n

	return pipe(
		Schema.Uint8Array,
		Schema.transform(
			Schema.BigIntFromSelf,
			{
				decode: (bytes: Uint8Array) => {
					const hex = Array.from(bytes)
						.map((b: number) => b.toString(16).padStart(2, '0'))
						.join('')
					const validHex = hex || '0'
					const value = BigInt(`0x${validHex}`)
					if (value > maxValue || value < 0n) {
						throw new Error(`Value out of range for Uint${size}`)
					}
					return value
				},
				encode: () => new Uint8Array(0), // This is a dummy implementation since we don't need to transform back
			},
		),
		Schema.brand(`Uint${size}`),
	)
}

/**
 * Schema for converting bytes to an Int value
 * @param size - The bit size of the integer.
 */
const intFromBytes = <Size extends number>(size: Size) => {
	const maxValue = (1n << BigInt(size - 1)) - 1n
	const minValue = -(1n << BigInt(size - 1))

	return pipe(
		Schema.Uint8Array,
		Schema.transform(
			Schema.BigIntFromSelf,
			{
				decode: (bytes: Uint8Array) => {
					const hex = Array.from(bytes)
						.map((b: number) => b.toString(16).padStart(2, '0'))
						.join('')
					const validHex = hex || '0'
					const value = BigInt(`0x${validHex}`)
					if (value > maxValue || value < minValue) {
						throw new Error(`Value out of range for Int${size}`)
					}
					return value
				},
				encode: () => new Uint8Array(0), // This is a dummy implementation since we don't need to transform back
			},
		),
		Schema.brand(`Int${size}`),
	)
}

/**
 * Schema for converting hex to a Uint value
 * @param size - The bit size of the integer.
 */
const uintFromHex = <Size extends number>(size: Size) => {
	const maxValue = (1n << BigInt(size)) - 1n

	return pipe(
		Schema.String,
		Schema.transform(
			Schema.BigIntFromSelf,
			{
				decode: (hex: string) => {
					const value = BigInt(hex.startsWith('0x') ? hex : `0x${hex}`)
					if (value > maxValue || value < 0n) {
						throw new Error(`Value out of range for Uint${size}`)
					}
					return value
				},
				encode: (value: bigint) => `0x${value.toString(16)}`,
			},
		),
		Schema.brand(`Uint${size}`),
	)
}

/**
 * Schema for converting hex to an Int value
 * @param size - The bit size of the integer.
 */
const intFromHex = <Size extends number>(size: Size) => {
	const maxValue = (1n << BigInt(size - 1)) - 1n
	const minValue = -(1n << BigInt(size - 1))

	return pipe(
		Schema.String,
		Schema.transform(
			Schema.BigIntFromSelf,
			{
				decode: (hex: string) => {
					const value = BigInt(hex.startsWith('0x') ? hex : `0x${hex}`)
					if (value > maxValue || value < minValue) {
						throw new Error(`Value out of range for Int${size}`)
					}
					return value
				},
				encode: (value: bigint) => `0x${value.toString(16)}`,
			},
		),
		Schema.brand(`Int${size}`),
	)
}

/**
 * Adds two Uint values
 * @param a - First Uint value.
 * @param b - Second Uint value.
 * @param size - The bit size of the integers.
 */
const add = <Size extends number>(a: Uint<Size>, b: Uint<Size>, size: Size): Effect.Effect<Uint<Size>, Error> =>
	Effect.gen(function* (_) {
		const result = a + b
		// Manual validation
		const maxValue = (1n << BigInt(size)) - 1n
		if (result > maxValue || result < 0n) {
			return yield* _(Effect.fail(new Error(`Result out of range for Uint${size}`)))
		}
		return result as Uint<Size>
	})

/**
 * Adds two Int values
 * @param a - First Int value.
 * @param b - Second Int value.
 * @param size - The bit size of the integers.
 */
const addInt = <Size extends number>(a: Int<Size>, b: Int<Size>, size: Size): Effect.Effect<Int<Size>, Error> =>
	Effect.gen(function* (_) {
		const result = a + b
		// Manual validation
		const maxValue = (1n << BigInt(size - 1)) - 1n
		const minValue = -(1n << BigInt(size - 1))
		if (result > maxValue || result < minValue) {
			return yield* _(Effect.fail(new Error(`Result out of range for Int${size}`)))
		}
		return result as Int<Size>
	})

/**
 * Subtracts one Uint value from another
 * @param a - First Uint value.
 * @param b - Second Uint value.
 * @param size - The bit size of the integers.
 */
const sub = <Size extends number>(a: Uint<Size>, b: Uint<Size>, size: Size): Effect.Effect<Uint<Size>, Error> =>
	Effect.gen(function* (_) {
		const result = a - b
		// Manual validation
		const maxValue = (1n << BigInt(size)) - 1n
		if (result > maxValue || result < 0n) {
			return yield* _(Effect.fail(new Error(`Result out of range for Uint${size}`)))
		}
		return result as Uint<Size>
	})

/**
 * Subtracts one Int value from another
 * @param a - First Int value.
 * @param b - Second Int value.
 * @param size - The bit size of the integers.
 */
const subInt = <Size extends number>(a: Int<Size>, b: Int<Size>, size: Size): Effect.Effect<Int<Size>, Error> =>
	Effect.gen(function* (_) {
		const result = a - b
		// Manual validation
		const maxValue = (1n << BigInt(size - 1)) - 1n
		const minValue = -(1n << BigInt(size - 1))
		if (result > maxValue || result < minValue) {
			return yield* _(Effect.fail(new Error(`Result out of range for Int${size}`)))
		}
		return result as Int<Size>
	})

/**
 * Multiplies two Uint values
 * @param a - First Uint value.
 * @param b - Second Uint value.
 * @param size - The bit size of the integers.
 */
const mul = <Size extends number>(a: Uint<Size>, b: Uint<Size>, size: Size): Effect.Effect<Uint<Size>, Error> =>
	Effect.gen(function* (_) {
		const result = a * b
		// Manual validation
		const maxValue = (1n << BigInt(size)) - 1n
		if (result > maxValue || result < 0n) {
			return yield* _(Effect.fail(new Error(`Result out of range for Uint${size}`)))
		}
		return result as Uint<Size>
	})

/**
 * Multiplies two Int values
 * @param a - First Int value.
 * @param b - Second Int value.
 * @param size - The bit size of the integers.
 */
const mulInt = <Size extends number>(a: Int<Size>, b: Int<Size>, size: Size): Effect.Effect<Int<Size>, Error> =>
	Effect.gen(function* (_) {
		const result = a * b
		// Manual validation
		const maxValue = (1n << BigInt(size - 1)) - 1n
		const minValue = -(1n << BigInt(size - 1))
		if (result > maxValue || result < minValue) {
			return yield* _(Effect.fail(new Error(`Result out of range for Int${size}`)))
		}
		return result as Int<Size>
	})

/**
 * Divides one Uint value by another
 * @param a - First Uint value.
 * @param b - Second Uint value.
 * @param size - The bit size of the integers.
 */
const div = <Size extends number>(a: Uint<Size>, b: Uint<Size>, size: Size): Effect.Effect<Uint<Size>, Error> =>
	Effect.gen(function* (_) {
		if (b === 0n) {
			return yield* _(Effect.fail(new Error('Division by zero')))
		}

		const result = a / b
		// Manual validation
		const maxValue = (1n << BigInt(size)) - 1n
		if (result > maxValue || result < 0n) {
			return yield* _(Effect.fail(new Error(`Result out of range for Uint${size}`)))
		}
		return result as Uint<Size>
	})

/**
 * Divides one Int value by another
 * @param a - First Int value.
 * @param b - Second Int value.
 * @param size - The bit size of the integers.
 */
const divInt = <Size extends number>(a: Int<Size>, b: Int<Size>, size: Size): Effect.Effect<Int<Size>, Error> =>
	Effect.gen(function* (_) {
		if (b === 0n) {
			return yield* _(Effect.fail(new Error('Division by zero')))
		}

		const result = a / b
		// Manual validation
		const maxValue = (1n << BigInt(size - 1)) - 1n
		const minValue = -(1n << BigInt(size - 1))
		if (result > maxValue || result < minValue) {
			return yield* _(Effect.fail(new Error(`Result out of range for Int${size}`)))
		}
		return result as Int<Size>
	})

/**
 * Performs modulo operation on Uint values
 * @param a - First Uint value.
 * @param b - Second Uint value.
 * @param size - The bit size of the integers.
 */
const mod = <Size extends number>(a: Uint<Size>, b: Uint<Size>, size: Size): Effect.Effect<Uint<Size>, Error> =>
	Effect.gen(function* (_) {
		if (b === 0n) {
			return yield* _(Effect.fail(new Error('Modulo by zero')))
		}

		const result = a % b
		// Manual validation
		const maxValue = (1n << BigInt(size)) - 1n
		if (result > maxValue || result < 0n) {
			return yield* _(Effect.fail(new Error(`Result out of range for Uint${size}`)))
		}
		return result as Uint<Size>
	})

/**
 * Performs modulo operation on Int values
 * @param a - First Int value.
 * @param b - Second Int value.
 * @param size - The bit size of the integers.
 */
const modInt = <Size extends number>(a: Int<Size>, b: Int<Size>, size: Size): Effect.Effect<Int<Size>, Error> =>
	Effect.gen(function* (_) {
		if (b === 0n) {
			return yield* _(Effect.fail(new Error('Modulo by zero')))
		}

		const result = a % b
		// Manual validation
		const maxValue = (1n << BigInt(size - 1)) - 1n
		const minValue = -(1n << BigInt(size - 1))
		if (result > maxValue || result < minValue) {
			return yield* _(Effect.fail(new Error(`Result out of range for Int${size}`)))
		}
		return result as Int<Size>
	})

// U8 schemas, types, and operations
export const U8 = uintSchema(8)
export type U8 = Uint<8>
export const U8FromBytes = uintFromBytes(8)
export const U8FromHex = uintFromHex(8)
export const addU8 = (a: U8, b: U8) => add(a, b, 8)
export const subU8 = (a: U8, b: U8) => sub(a, b, 8)
export const mulU8 = (a: U8, b: U8) => mul(a, b, 8)
export const divU8 = (a: U8, b: U8) => div(a, b, 8)
export const modU8 = (a: U8, b: U8) => mod(a, b, 8)

// I8 schemas, types, and operations
export const I8 = intSchema(8)
export type I8 = Int<8>
export const I8FromBytes = intFromBytes(8)
export const I8FromHex = intFromHex(8)
export const addI8 = (a: I8, b: I8) => addInt(a, b, 8)
export const subI8 = (a: I8, b: I8) => subInt(a, b, 8)
export const mulI8 = (a: I8, b: I8) => mulInt(a, b, 8)
export const divI8 = (a: I8, b: I8) => divInt(a, b, 8)
export const modI8 = (a: I8, b: I8) => modInt(a, b, 8)

// U16 schemas, types, and operations
export const U16 = uintSchema(16)
export type U16 = Uint<16>
export const U16FromBytes = uintFromBytes(16)
export const U16FromHex = uintFromHex(16)
export const addU16 = (a: U16, b: U16) => add(a, b, 16)
export const subU16 = (a: U16, b: U16) => sub(a, b, 16)
export const mulU16 = (a: U16, b: U16) => mul(a, b, 16)
export const divU16 = (a: U16, b: U16) => div(a, b, 16)
export const modU16 = (a: U16, b: U16) => mod(a, b, 16)

// I16 schemas, types, and operations
export const I16 = intSchema(16)
export type I16 = Int<16>
export const I16FromBytes = intFromBytes(16)
export const I16FromHex = intFromHex(16)
export const addI16 = (a: I16, b: I16) => addInt(a, b, 16)
export const subI16 = (a: I16, b: I16) => subInt(a, b, 16)
export const mulI16 = (a: I16, b: I16) => mulInt(a, b, 16)
export const divI16 = (a: I16, b: I16) => divInt(a, b, 16)
export const modI16 = (a: I16, b: I16) => modInt(a, b, 16)

// U32 schemas, types, and operations
export const U32 = uintSchema(32)
export type U32 = Uint<32>
export const U32FromBytes = uintFromBytes(32)
export const U32FromHex = uintFromHex(32)
export const addU32 = (a: U32, b: U32) => add(a, b, 32)
export const subU32 = (a: U32, b: U32) => sub(a, b, 32)
export const mulU32 = (a: U32, b: U32) => mul(a, b, 32)
export const divU32 = (a: U32, b: U32) => div(a, b, 32)
export const modU32 = (a: U32, b: U32) => mod(a, b, 32)

// I32 schemas, types, and operations
export const I32 = intSchema(32)
export type I32 = Int<32>
export const I32FromBytes = intFromBytes(32)
export const I32FromHex = intFromHex(32)
export const addI32 = (a: I32, b: I32) => addInt(a, b, 32)
export const subI32 = (a: I32, b: I32) => subInt(a, b, 32)
export const mulI32 = (a: I32, b: I32) => mulInt(a, b, 32)
export const divI32 = (a: I32, b: I32) => divInt(a, b, 32)
export const modI32 = (a: I32, b: I32) => modInt(a, b, 32)

// U64 schemas, types, and operations
export const U64 = uintSchema(64)
export type U64 = Uint<64>
export const U64FromBytes = uintFromBytes(64)
export const U64FromHex = uintFromHex(64)
export const addU64 = (a: U64, b: U64) => add(a, b, 64)
export const subU64 = (a: U64, b: U64) => sub(a, b, 64)
export const mulU64 = (a: U64, b: U64) => mul(a, b, 64)
export const divU64 = (a: U64, b: U64) => div(a, b, 64)
export const modU64 = (a: U64, b: U64) => mod(a, b, 64)

// I64 schemas, types, and operations
export const I64 = intSchema(64)
export type I64 = Int<64>
export const I64FromBytes = intFromBytes(64)
export const I64FromHex = intFromHex(64)
export const addI64 = (a: I64, b: I64) => addInt(a, b, 64)
export const subI64 = (a: I64, b: I64) => subInt(a, b, 64)
export const mulI64 = (a: I64, b: I64) => mulInt(a, b, 64)
export const divI64 = (a: I64, b: I64) => divInt(a, b, 64)
export const modI64 = (a: I64, b: I64) => modInt(a, b, 64)

// U128 schemas, types, and operations
export const U128 = uintSchema(128)
export type U128 = Uint<128>
export const U128FromBytes = uintFromBytes(128)
export const U128FromHex = uintFromHex(128)
export const addU128 = (a: U128, b: U128) => add(a, b, 128)
export const subU128 = (a: U128, b: U128) => sub(a, b, 128)
export const mulU128 = (a: U128, b: U128) => mul(a, b, 128)
export const divU128 = (a: U128, b: U128) => div(a, b, 128)
export const modU128 = (a: U128, b: U128) => mod(a, b, 128)

// I128 schemas, types, and operations
export const I128 = intSchema(128)
export type I128 = Int<128>
export const I128FromBytes = intFromBytes(128)
export const I128FromHex = intFromHex(128)
export const addI128 = (a: I128, b: I128) => addInt(a, b, 128)
export const subI128 = (a: I128, b: I128) => subInt(a, b, 128)
export const mulI128 = (a: I128, b: I128) => mulInt(a, b, 128)
export const divI128 = (a: I128, b: I128) => divInt(a, b, 128)
export const modI128 = (a: I128, b: I128) => modInt(a, b, 128)

// U256 schemas, types, and operations
export const U256 = uintSchema(256)
export type U256 = Uint<256>
export const U256FromBytes = uintFromBytes(256)
export const U256FromHex = uintFromHex(256)
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
 * @returns The ether string representation
 */
export const toEther = (value: U256): string => Value.formatEther(value)

/**
 * Converts a U256 value to its gwei string representation
 * @param value - The U256 value to convert
 * @returns The gwei string representation
 */
export const toGwei = (value: U256): string => Value.formatGwei(value)

export const addU256 = (a: U256, b: U256) => add(a, b, 256)
export const subU256 = (a: U256, b: U256) => sub(a, b, 256)
export const mulU256 = (a: U256, b: U256) => mul(a, b, 256)
export const divU256 = (a: U256, b: U256) => div(a, b, 256)
export const modU256 = (a: U256, b: U256) => mod(a, b, 256)

// I256 schemas, types, and operations
export const I256 = intSchema(256)
export type I256 = Int<256>
export const I256FromBytes = intFromBytes(256)
export const I256FromHex = intFromHex(256)
export const addI256 = (a: I256, b: I256) => addInt(a, b, 256)
export const subI256 = (a: I256, b: I256) => subInt(a, b, 256)
export const mulI256 = (a: I256, b: I256) => mulInt(a, b, 256)
export const divI256 = (a: I256, b: I256) => divInt(a, b, 256)
export const modI256 = (a: I256, b: I256) => modInt(a, b, 256)
