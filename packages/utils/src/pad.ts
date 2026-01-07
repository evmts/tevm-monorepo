import type { Hex } from './abitype.js'

/**
 * Options for the pad function.
 */
export type PadOptions = {
	/** Direction to pad. 'left' pads at the start, 'right' pads at the end. Defaults to 'left'. */
	dir?: 'left' | 'right' | undefined
	/** Target size in bytes. Defaults to 32. Set to null to skip padding. */
	size?: number | null | undefined
}

/**
 * Error thrown when the data size exceeds the target padding size.
 */
export class SizeExceedsPaddingSizeError extends Error {
	constructor({ size, targetSize, type }: { size: number; targetSize: number; type: 'hex' | 'bytes' }) {
		super(`Size of ${type} (${size} bytes) exceeds target padding size (${targetSize} bytes).`)
		this.name = 'SizeExceedsPaddingSizeError'
	}
}

/**
 * Pad a hex string or byte array to a target size.
 *
 * @param hexOrBytes - The hex string or byte array to pad
 * @param options - Padding options
 * @returns The padded hex string or byte array
 *
 * @example
 * ```ts
 * import { pad } from '@tevm/utils'
 *
 * // Pad hex to 32 bytes (default)
 * pad('0x1234')
 * // => '0x0000000000000000000000000000000000000000000000000000000000001234'
 *
 * // Pad hex to 32 bytes right-aligned
 * pad('0x1234', { dir: 'right' })
 * // => '0x1234000000000000000000000000000000000000000000000000000000000000'
 *
 * // Pad bytes to 32 bytes
 * pad(new Uint8Array([1, 2]))
 * // => Uint8Array(32) [0, 0, ..., 1, 2]
 * ```
 */
export function pad<T extends Hex | Uint8Array>(hexOrBytes: T, { dir, size = 32 }: PadOptions = {}): T {
	if (typeof hexOrBytes === 'string') {
		return padHex(hexOrBytes, { dir, size }) as T
	}
	return padBytes(hexOrBytes, { dir, size }) as T
}

/**
 * Pad a hex string to a target size.
 *
 * @param hex_ - The hex string to pad
 * @param options - Padding options
 * @returns The padded hex string
 */
export function padHex(hex_: Hex, { dir, size = 32 }: PadOptions = {}): Hex {
	if (size === null) return hex_

	const hex = hex_.replace('0x', '')
	if (hex.length > size * 2) {
		throw new SizeExceedsPaddingSizeError({
			size: Math.ceil(hex.length / 2),
			targetSize: size,
			type: 'hex',
		})
	}
	return `0x${hex[dir === 'right' ? 'padEnd' : 'padStart'](size * 2, '0')}`
}

/**
 * Pad a byte array to a target size.
 *
 * @param bytes - The byte array to pad
 * @param options - Padding options
 * @returns The padded byte array
 */
export function padBytes(bytes: Uint8Array, { dir, size = 32 }: PadOptions = {}): Uint8Array {
	if (size === null) return bytes

	if (bytes.length > size) {
		throw new SizeExceedsPaddingSizeError({
			size: bytes.length,
			targetSize: size,
			type: 'bytes',
		})
	}

	const paddedBytes = new Uint8Array(size)
	for (let i = 0; i < size; i++) {
		const padEnd = dir === 'right'
		paddedBytes[padEnd ? i : size - i - 1] = bytes[padEnd ? i : bytes.length - i - 1] ?? 0
	}
	return paddedBytes
}
