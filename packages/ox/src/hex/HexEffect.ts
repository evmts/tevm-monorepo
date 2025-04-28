import {
	boolToHex,
	bytesToHex,
	hexToBigInt,
	hexToBool,
	hexToBytes,
	hexToNumber,
	hexToString,
	isHex,
	numberToHex,
	stringToHex,
} from '@tevm/utils'
import { Effect } from 'effect'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Hex
 */
export type Hex = string

/**
 * Catch errors and convert them to BaseErrorEffect
 */
function catchOxErrors<A>(
	effect: Effect.Effect<A, unknown, never>,
): Effect.Effect<A, BaseErrorEffect<Error | undefined>, never> {
	return Effect.catchAll(effect, (error) => {
		if (error instanceof Error) {
			return Effect.fail(new BaseErrorEffect(error.message, { cause: error }))
		}
		return Effect.fail(new BaseErrorEffect('Unknown error', { cause: error instanceof Error ? error : undefined }))
	})
}

/**
 * Asserts if the given value is Hex in an Effect
 */
export function assertEffect(value: unknown): Effect.Effect<void, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(
		Effect.try(() => {
			if (!isHex(value)) {
				throw new Error('Invalid hex value')
			}
		}),
	)
}

/**
 * Concatenates two or more Hex values in an Effect
 */
export function concatEffect(...values: readonly string[]): Effect.Effect<string, never, never> {
	return Effect.succeed(values.join(''))
}

/**
 * Converts from Bytes to Hex in an Effect
 */
export function fromBytesEffect(value: Uint8Array): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => bytesToHex(value)))
}

/**
 * Converts from Boolean to Hex in an Effect
 */
export function fromBooleanEffect(value: boolean): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => boolToHex(value)))
}

/**
 * Converts from Number to Hex in an Effect
 */
export function fromNumberEffect(
	value: number | bigint,
): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => numberToHex(value)))
}

/**
 * Converts from String to Hex in an Effect
 */
export function fromStringEffect(value: string): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => stringToHex(value)))
}

/**
 * Checks if two Hex values are equal in an Effect
 */
export function isEqualEffect(
	hexA: string,
	hexB: string,
): Effect.Effect<boolean, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => hexA.toLowerCase() === hexB.toLowerCase()))
}

/**
 * Pads a Hex value to the left in an Effect
 */
export function padLeftEffect(
	value: string,
	size?: number,
): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => {
		const hexValue = value.startsWith('0x') ? value.slice(2) : value
		const paddedHex = hexValue.padStart(size || 0, '0')
		return value.startsWith('0x') ? `0x${paddedHex}` : paddedHex
	}))
}

/**
 * Pads a Hex value to the right in an Effect
 */
export function padRightEffect(
	value: string,
	size?: number,
): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => {
		const hexValue = value.startsWith('0x') ? value.slice(2) : value
		const paddedHex = hexValue.padEnd(size || 0, '0')
		return value.startsWith('0x') ? `0x${paddedHex}` : paddedHex
	}))
}

/**
 * Creates a random Hex value in an Effect
 */
export function randomEffect(length: number): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(
		Effect.try(() => {
			const bytes = new Uint8Array(length)
			crypto.getRandomValues(bytes)
			return bytesToHex(bytes)
		}),
	)
}

/**
 * Gets the size of a Hex value in an Effect
 */
export function sizeEffect(value: string): Effect.Effect<number, never, never> {
	// Remove '0x' prefix if present and get length in bytes (2 hex chars = 1 byte)
	return Effect.succeed((value.startsWith('0x') ? value.length - 2 : value.length) / 2)
}

/**
 * Converts from Hex to BigInt in an Effect
 */
export function toBigIntEffect(hex: string): Effect.Effect<bigint, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => {
		// Make sure we have a 0x prefix
		const prefixedHex = hex.startsWith('0x') ? hex : `0x${hex}`
		return hexToBigInt(prefixedHex as `0x${string}`)
	}))
}

/**
 * Converts from Hex to Boolean in an Effect
 */
export function toBooleanEffect(hex: string): Effect.Effect<boolean, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => {
		const prefixedHex = hex.startsWith('0x') ? hex : `0x${hex}`
		return hexToBool(prefixedHex as `0x${string}`)
	}))
}

/**
 * Converts from Hex to Bytes in an Effect
 */
export function toBytesEffect(hex: string): Effect.Effect<Uint8Array, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => {
		const prefixedHex = hex.startsWith('0x') ? hex : `0x${hex}`
		return hexToBytes(prefixedHex as `0x${string}`)
	}))
}

/**
 * Converts from Hex to Number in an Effect
 */
export function toNumberEffect(hex: string): Effect.Effect<number, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => {
		const prefixedHex = hex.startsWith('0x') ? hex : `0x${hex}`
		return hexToNumber(prefixedHex as `0x${string}`)
	}))
}

/**
 * Converts from Hex to String in an Effect
 */
export function toStringEffect(hex: string): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => {
		const prefixedHex = hex.startsWith('0x') ? hex : `0x${hex}`
		return hexToString(prefixedHex as `0x${string}`)
	}))
}

// Export all functions directly without service layer
