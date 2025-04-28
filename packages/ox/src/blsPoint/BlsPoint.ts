import { Effect } from 'effect'
import Ox from 'ox'

// Export the core type
export type BlsPoint = Ox.BlsPoint.BlsPoint

/**
 * Error thrown when converting BLS point to bytes
 */
export class ToBytesError extends Error {
	override name = 'ToBytesError'
	_tag = 'ToBytesError'
	constructor(cause: Ox.BlsPoint.toBytes.ErrorType) {
		super('Unexpected error converting BLS point to bytes with ox', {
			cause,
		})
	}
}

/**
 * Converts BLS point to bytes
 *
 * @param point - The BLS point to convert
 * @returns The bytes representation of the BLS point
 *
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as BlsPoint from '@tevm/ox/blsPoint'
 * import * as Bls from '@tevm/ox/bls'
 *
 * // First generate a BLS key pair
 * const privateKey = await Effect.runPromise(Bls.randomPrivateKey())
 * const publicKey = await Effect.runPromise(Bls.getPublicKey(privateKey))
 *
 * // Convert the public key (BLS point) to bytes
 * const bytes = await Effect.runPromise(BlsPoint.toBytes(publicKey))
 * ```
 */
export function toBytes(point: BlsPoint): Effect.Effect<Uint8Array, ToBytesError, never> {
	return Effect.try({
		try: () => Ox.BlsPoint.toBytes(point),
		catch: (cause) => new ToBytesError(cause as Ox.BlsPoint.toBytes.ErrorType),
	})
}

/**
 * Error thrown when converting BLS point to hex
 */
export class ToHexError extends Error {
	override name = 'ToHexError'
	_tag = 'ToHexError'
	constructor(cause: Ox.BlsPoint.toHex.ErrorType) {
		super('Unexpected error converting BLS point to hex with ox', {
			cause,
		})
	}
}

/**
 * Converts BLS point to hex
 *
 * @param point - The BLS point to convert
 * @returns The hex representation of the BLS point
 *
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as BlsPoint from '@tevm/ox/blsPoint'
 * import * as Bls from '@tevm/ox/bls'
 *
 * // First generate a BLS key pair
 * const privateKey = await Effect.runPromise(Bls.randomPrivateKey())
 * const publicKey = await Effect.runPromise(Bls.getPublicKey(privateKey))
 *
 * // Convert the public key (BLS point) to hex
 * const hex = await Effect.runPromise(BlsPoint.toHex(publicKey))
 * ```
 */
export function toHex(point: BlsPoint): Effect.Effect<Ox.Hex.Hex, ToHexError, never> {
	return Effect.try({
		try: () => Ox.BlsPoint.toHex(point),
		catch: (cause) => new ToHexError(cause as Ox.BlsPoint.toHex.ErrorType),
	})
}

/**
 * Error thrown when converting bytes to BLS point
 */
export class FromBytesError extends Error {
	override name = 'FromBytesError'
	_tag = 'FromBytesError'
	constructor(cause: Ox.BlsPoint.fromBytes.ErrorType) {
		super('Unexpected error converting bytes to BLS point with ox', {
			cause,
		})
	}
}

/**
 * Converts bytes to BLS point
 *
 * @param bytes - The bytes to convert
 * @param type - The BLS point type: 'G1' for public keys, 'G2' for signatures
 * @returns The BLS point
 *
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as BlsPoint from '@tevm/ox/blsPoint'
 * import * as Bls from '@tevm/ox/bls'
 *
 * // First generate a BLS key pair
 * const privateKey = await Effect.runPromise(Bls.randomPrivateKey())
 * const publicKey = await Effect.runPromise(Bls.getPublicKey(privateKey))
 *
 * // Convert to bytes and back
 * const bytes = await Effect.runPromise(BlsPoint.toBytes(publicKey))
 * const recoveredPoint = await Effect.runPromise(BlsPoint.fromBytes(bytes, 'G1'))
 * ```
 */
export function fromBytes(bytes: Uint8Array, type: 'G1' | 'G2'): Effect.Effect<BlsPoint, FromBytesError, never> {
	return Effect.try({
		try: () => Ox.BlsPoint.fromBytes(bytes, type),
		catch: (cause) => new FromBytesError(cause as Ox.BlsPoint.fromBytes.ErrorType),
	})
}

/**
 * Error thrown when converting hex to BLS point
 */
export class FromHexError extends Error {
	override name = 'FromHexError'
	_tag = 'FromHexError'
	constructor(cause: Ox.BlsPoint.fromHex.ErrorType) {
		super('Unexpected error converting hex to BLS point with ox', {
			cause,
		})
	}
}

/**
 * Converts hex to BLS point
 *
 * @param hex - The hex to convert
 * @param type - The BLS point type: 'G1' for public keys, 'G2' for signatures
 * @returns The BLS point
 *
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as BlsPoint from '@tevm/ox/blsPoint'
 * import * as Bls from '@tevm/ox/bls'
 *
 * // First generate a BLS key pair
 * const privateKey = await Effect.runPromise(Bls.randomPrivateKey())
 * const publicKey = await Effect.runPromise(Bls.getPublicKey(privateKey))
 *
 * // Convert to hex and back
 * const hex = await Effect.runPromise(BlsPoint.toHex(publicKey))
 * const recoveredPoint = await Effect.runPromise(BlsPoint.fromHex(hex, 'G1'))
 * ```
 */
export function fromHex(hex: Ox.Hex.Hex, type: 'G1' | 'G2'): Effect.Effect<BlsPoint, FromHexError, never> {
	return Effect.try({
		try: () => Ox.BlsPoint.fromHex(hex, type),
		catch: (cause) => new FromHexError(cause as Ox.BlsPoint.fromHex.ErrorType),
	})
}
