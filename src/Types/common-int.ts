import { Brand, Schema } from 'effect'
import { pipe } from 'effect/Function'
import { Value } from 'ox'

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
export const uintSchema = <Size extends number>(size: Size) => {
	const maxValue = (1n << BigInt(size)) - 1n

	return pipe(
		Schema.BigIntFromSelf,
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
export const intSchema = <Size extends number>(size: Size) => {
	const maxValue = (1n << BigInt(size - 1)) - 1n
	const minValue = -(1n << BigInt(size - 1))

	return pipe(
		Schema.BigIntFromSelf,
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
export const uintFromBytes = <Size extends number>(size: Size) => {
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
				encode: (value: bigint) => {
					const bytes = new Uint8Array(size / 8)
					let v = value
					for (let i = bytes.length - 1; i >= 0; i--) {
						bytes[i] = Number(v & 0xffn)
						v >>= 8n
					}
					return bytes
				},
			},
		),
		Schema.brand(`Uint${size}`),
	)
}

/**
 * Schema for converting bytes to an Int value
 * @param size - The bit size of the integer.
 */
export const intFromBytes = <Size extends number>(size: Size) => {
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
export const uintFromHex = <Size extends number>(size: Size) => {
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
export const intFromHex = <Size extends number>(size: Size) => {
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
 * Schema for converting string to a Uint value
 * @param size - The bit size of the integer.
 */
export const uintFromString = <Size extends number>(size: Size) => {
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
 * Schema for converting string to an Int value
 * @param size - The bit size of the integer.
 */
export const intFromString = <Size extends number>(size: Size) => {
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