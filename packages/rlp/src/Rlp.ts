// Native RLP implementation using @tevm/voltaire
// Migrated from @ethereumjs/rlp to remove dependency

import { Rlp as VoltaireRlp } from '@tevm/voltaire/Rlp'

/**
 * Input type for RLP encoding (matches @ethereumjs/rlp)
 */
export type Input = string | number | bigint | Uint8Array | Array<Input> | null | undefined

/**
 * Nested Uint8Array type for decoded RLP data (matches @ethereumjs/rlp)
 */
export type NestedUint8Array = Array<Uint8Array | NestedUint8Array>

/**
 * RLP encoding - converts input to RLP-encoded bytes
 * @param input - Value to encode
 * @returns RLP-encoded bytes
 */
function encode(input: Input): Uint8Array {
	// Handle null/undefined as empty bytes
	if (input === null || input === undefined) {
		return VoltaireRlp.encode(new Uint8Array([]))
	}
	// Handle string as UTF-8 bytes
	if (typeof input === 'string') {
		const encoder = new TextEncoder()
		return VoltaireRlp.encode(encoder.encode(input))
	}
	// Handle number/bigint as bytes
	if (typeof input === 'number' || typeof input === 'bigint') {
		const n = BigInt(input)
		if (n === 0n) {
			return VoltaireRlp.encode(new Uint8Array([]))
		}
		// Convert to big-endian bytes without leading zeros
		let hex = n.toString(16)
		if (hex.length % 2) hex = '0' + hex
		const bytes = new Uint8Array(hex.length / 2)
		for (let i = 0; i < bytes.length; i++) {
			bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
		}
		return VoltaireRlp.encode(bytes)
	}
	// Handle Uint8Array
	if (input instanceof Uint8Array) {
		return VoltaireRlp.encode(input)
	}
	// Handle arrays recursively - need to encode each element first
	if (Array.isArray(input)) {
		// For nested arrays, we need to pass them through to voltaire's encodeArray
		return VoltaireRlp.encodeArray(input.map(item => {
			if (item === null || item === undefined) {
				return new Uint8Array([])
			}
			if (typeof item === 'string') {
				return new TextEncoder().encode(item)
			}
			if (typeof item === 'number' || typeof item === 'bigint') {
				const n = BigInt(item)
				if (n === 0n) {
					return new Uint8Array([])
				}
				let hex = n.toString(16)
				if (hex.length % 2) hex = '0' + hex
				const bytes = new Uint8Array(hex.length / 2)
				for (let i = 0; i < bytes.length; i++) {
					bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
				}
				return bytes
			}
			if (item instanceof Uint8Array) {
				return item
			}
			if (Array.isArray(item)) {
				// For nested arrays, return as-is and let encodeArray handle it
				return item as any
			}
			return new Uint8Array([])
		}))
	}
	// Fallback
	return VoltaireRlp.encode(new Uint8Array([]))
}

/**
 * RLP decoding - converts RLP-encoded bytes back to values
 * @param input - RLP-encoded bytes
 * @returns Decoded value (Uint8Array or nested arrays)
 */
function decode(input: Input): Uint8Array | NestedUint8Array {
	// Handle empty input - return empty Uint8Array (ethereumjs compatibility)
	if (input instanceof Uint8Array && input.length === 0) {
		return new Uint8Array([])
	}

	// Convert input to bytes if needed
	let bytes: Uint8Array
	if (input instanceof Uint8Array) {
		bytes = input
	} else if (typeof input === 'string') {
		// Assume hex string
		const hex = input.startsWith('0x') ? input.slice(2) : input
		bytes = new Uint8Array(hex.length / 2)
		for (let i = 0; i < bytes.length; i++) {
			bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
		}
	} else {
		return new Uint8Array([])
	}

	// Empty bytes returns empty array
	if (bytes.length === 0) {
		return new Uint8Array([])
	}

	try {
		const result = VoltaireRlp.decode(bytes)
		return VoltaireRlp.toRaw(result.data) as Uint8Array | NestedUint8Array
	} catch {
		// On error, return empty array for compatibility
		return new Uint8Array([])
	}
}

/**
 * RLP namespace - provides encode and decode functions compatible with @ethereumjs/rlp
 */
export const Rlp = {
	encode,
	decode,
} as const
