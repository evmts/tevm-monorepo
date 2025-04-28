import { Effect } from 'effect'
import Ox from 'ox'

// Re-export BlsPoint type from ox
export type BlsPoint = Ox.BlsPoint.BlsPoint

/**
 * Error thrown when aggregating BLS points
 */
export class BlsAggregateError extends Error {
	override name = 'BlsAggregateError'
	_tag = 'BlsAggregateError'
	constructor(cause: unknown) {
		super('Unexpected error aggregating BLS points with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Aggregates multiple BLS points (signatures/public keys) into a single point
 *
 * @param points - Array of BLS points to aggregate
 * @returns The aggregated BLS point
 *
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Bls from '@tevm/ox/bls'
 *
 * // Assuming we have some BLS points (signatures or public keys)
 * const points = [point1, point2, point3]
 *
 * const program = Bls.aggregate(points)
 * const aggregatedPoint = await Effect.runPromise(program)
 * ```
 */
export function aggregate(
	points: Ox.BlsPoint.BlsPoint[],
): Effect.Effect<Ox.BlsPoint.BlsPoint, BlsAggregateError, never> {
	return Effect.try({
		try: () => Ox.Bls.aggregate(points),
		catch: (cause) => new BlsAggregateError(cause),
	})
}

/**
 * Error thrown when deriving a BLS public key
 */
export class GetPublicKeyError extends Error {
	override name = 'GetPublicKeyError'
	_tag = 'GetPublicKeyError'
	constructor(cause: unknown) {
		super('Unexpected error deriving BLS public key with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Derives a BLS public key from a private key
 *
 * @param privateKey - The BLS private key (32 bytes)
 * @returns The corresponding BLS public key
 *
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Bls from '@tevm/ox/bls'
 *
 * // Private key should be a 32-byte Uint8Array
 * const privateKey = await Effect.runPromise(Bls.randomPrivateKey())
 *
 * const program = Bls.getPublicKey(privateKey)
 * const publicKey = await Effect.runPromise(program)
 * ```
 */
export function getPublicKey(privateKey: Uint8Array): Effect.Effect<Ox.BlsPoint.BlsPoint, GetPublicKeyError, never> {
	return Effect.try({
		try: () => Ox.Bls.getPublicKey(privateKey),
		catch: (cause) => new GetPublicKeyError(cause),
	})
}

/**
 * Error thrown when generating a random BLS private key
 */
export class RandomPrivateKeyError extends Error {
	override name = 'RandomPrivateKeyError'
	_tag = 'RandomPrivateKeyError'
	constructor(cause: unknown) {
		super('Unexpected error generating random BLS private key with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Generates a random BLS private key
 *
 * @returns A randomly generated BLS private key (32 bytes)
 *
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Bls from '@tevm/ox/bls'
 *
 * const program = Bls.randomPrivateKey()
 * const privateKey = await Effect.runPromise(program)
 * // privateKey will be a 32-byte Uint8Array
 * ```
 */
export function randomPrivateKey(): Effect.Effect<Uint8Array, RandomPrivateKeyError, never> {
	return Effect.try({
		try: () => Ox.Bls.randomPrivateKey(),
		catch: (cause) => new RandomPrivateKeyError(cause),
	})
}

/**
 * Error thrown when signing a message with BLS
 */
export class SignError extends Error {
	override name = 'SignError'
	_tag = 'SignError'
	constructor(cause: unknown) {
		super('Unexpected error signing message with BLS using ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Signs a message with a BLS private key
 *
 * @param message - The message to sign
 * @param privateKey - The BLS private key (32 bytes)
 * @returns The BLS signature
 *
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Bls from '@tevm/ox/bls'
 *
 * const privateKey = await Effect.runPromise(Bls.randomPrivateKey())
 * const message = new Uint8Array([1, 2, 3, 4, 5])
 *
 * const program = Bls.sign(message, privateKey)
 * const signature = await Effect.runPromise(program)
 * ```
 */
export function sign(
	message: Uint8Array,
	privateKey: Uint8Array,
): Effect.Effect<Ox.BlsPoint.BlsPoint, SignError, never> {
	return Effect.try({
		try: () => Ox.Bls.sign(message, privateKey),
		catch: (cause) => new SignError(cause),
	})
}

/**
 * Error thrown when verifying a BLS signature
 */
export class VerifyError extends Error {
	override name = 'VerifyError'
	_tag = 'VerifyError'
	constructor(cause: unknown) {
		super('Unexpected error verifying BLS signature with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Verifies a BLS signature against a message and public key
 *
 * @param message - The message that was signed
 * @param signature - The BLS signature to verify
 * @param publicKey - The BLS public key of the signer
 * @returns A boolean indicating if the signature is valid
 *
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Bls from '@tevm/ox/bls'
 *
 * const privateKey = await Effect.runPromise(Bls.randomPrivateKey())
 * const publicKey = await Effect.runPromise(Bls.getPublicKey(privateKey))
 * const message = new Uint8Array([1, 2, 3, 4, 5])
 * const signature = await Effect.runPromise(Bls.sign(message, privateKey))
 *
 * const program = Bls.verify(message, signature, publicKey)
 * const isValid = await Effect.runPromise(program)
 * // isValid should be true
 * ```
 */
export function verify(
	message: Uint8Array,
	signature: Ox.BlsPoint.BlsPoint,
	publicKey: Ox.BlsPoint.BlsPoint,
): Effect.Effect<boolean, VerifyError, never> {
	return Effect.try({
		try: () => Ox.Bls.verify(message, signature, publicKey),
		catch: (cause) => new VerifyError(cause),
	})
}
