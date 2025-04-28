import { Effect } from 'effect'
import Ox from 'ox'
import type { BlsPoint } from 'ox/BlsPoint'

/**
 * Error class for aggregate function
 */
export class BlsAggregateError extends Error {
	override name = 'BlsAggregateError'
	_tag = 'BlsAggregateError'
	constructor(cause: unknown) {
		super('Failed to aggregate BLS points with ox', {
			cause,
		})
	}
}

/**
 * Aggregates multiple BLS points (signatures/public keys) into a single point
 * @param points The points to aggregate
 * @returns An Effect that succeeds with an aggregated BLS point
 */
export function aggregate(points: BlsPoint[]): Effect.Effect<BlsPoint, BlsAggregateError, never> {
	return Effect.try({
		try: () => Ox.Bls.aggregate(points),
		catch: (cause) => new BlsAggregateError(cause),
	})
}

/**
 * Error class for getPublicKey function
 */
export class GetPublicKeyError extends Error {
	override name = 'GetPublicKeyError'
	_tag = 'GetPublicKeyError'
	constructor(cause: unknown) {
		super('Failed to get public key from private key with ox', {
			cause,
		})
	}
}

/**
 * Derives a BLS public key from a private key
 * @param privateKey The private key to derive from
 * @returns An Effect that succeeds with a BLS public key
 */
export function getPublicKey(privateKey: Uint8Array): Effect.Effect<BlsPoint, GetPublicKeyError, never> {
	return Effect.try({
		try: () => Ox.Bls.getPublicKey(privateKey),
		catch: (cause) => new GetPublicKeyError(cause),
	})
}

/**
 * Error class for randomPrivateKey function
 */
export class RandomPrivateKeyError extends Error {
	override name = 'RandomPrivateKeyError'
	_tag = 'RandomPrivateKeyError'
	constructor(cause: unknown) {
		super('Failed to generate random private key with ox', {
			cause,
		})
	}
}

/**
 * Generates a random BLS private key
 * @returns An Effect that succeeds with a random private key
 */
export function randomPrivateKey(): Effect.Effect<Uint8Array, RandomPrivateKeyError, never> {
	return Effect.try({
		try: () => Ox.Bls.randomPrivateKey(),
		catch: (cause) => new RandomPrivateKeyError(cause),
	})
}

/**
 * Error class for sign function
 */
export class SignError extends Error {
	override name = 'SignError'
	_tag = 'SignError'
	constructor(cause: unknown) {
		super('Failed to sign message with BLS private key using ox', {
			cause,
		})
	}
}

/**
 * Signs a message with a BLS private key
 * @param message The message to sign
 * @param privateKey The private key to sign with
 * @returns An Effect that succeeds with a BLS signature
 */
export function sign(message: Uint8Array, privateKey: Uint8Array): Effect.Effect<BlsPoint, SignError, never> {
	return Effect.try({
		try: () => Ox.Bls.sign(message, privateKey),
		catch: (cause) => new SignError(cause),
	})
}

/**
 * Error class for verify function
 */
export class VerifyError extends Error {
	override name = 'VerifyError'
	_tag = 'VerifyError'
	constructor(cause: unknown) {
		super('Failed to verify BLS signature with ox', {
			cause,
		})
	}
}

/**
 * Verifies a BLS signature against a message and public key
 * @param message The message that was signed
 * @param signature The signature to verify
 * @param publicKey The public key to verify against
 * @returns An Effect that succeeds with a boolean indicating if the signature is valid
 */
export function verify(
	message: Uint8Array,
	signature: BlsPoint,
	publicKey: BlsPoint,
): Effect.Effect<boolean, VerifyError, never> {
	return Effect.try({
		try: () => Ox.Bls.verify(message, signature, publicKey),
		catch: (cause) => new VerifyError(cause),
	})
}
