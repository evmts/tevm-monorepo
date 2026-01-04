/**
 * Native common type definitions for tevm, replacing @ethereumjs/util types.
 * These are flexible input types used across the codebase.
 */

import type { Address } from './address.js'

/**
 * A prefixed hexadecimal string (e.g., '0x1234')
 */
export type PrefixedHexString = `0x${string}`

/**
 * Input type that can be converted to a BigInt
 */
export type BigIntLike = bigint | PrefixedHexString | number | Uint8Array

/**
 * Interface for objects that can be converted to bytes
 */
export interface TransformableToBytes {
	toBytes?(): Uint8Array
}

/**
 * Input type that can be converted to bytes
 */
export type BytesLike = Uint8Array | number[] | number | bigint | TransformableToBytes | PrefixedHexString

/**
 * Input type that can be converted to an Address
 */
export type AddressLike = Address | Uint8Array | PrefixedHexString

/**
 * Nested Uint8Array type for RLP encoding
 */
export type NestedUint8Array = Array<Uint8Array | NestedUint8Array>

/**
 * Type guard for NestedUint8Array
 */
export function isNestedUint8Array(value: unknown): value is NestedUint8Array {
	if (!Array.isArray(value)) return false
	for (const item of value) {
		if (item instanceof Uint8Array) continue
		if (isNestedUint8Array(item)) continue
		return false
	}
	return true
}

/**
 * Numeric string type
 */
export type NumericString = `${number}`
