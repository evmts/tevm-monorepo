import { Effect } from 'effect'
import Ox from 'ox'
import type { Address } from 'ox/core/Address'
import type { Bytes } from 'ox/core/Bytes'
import type { Hex } from 'ox/core/Hex'
import type { PublicKey } from 'ox/crypto/PublicKey'
import type { Signature } from 'ox/crypto/Signature'

/**
 * Export the core type
 */
export type Secp256k1 = Ox.Secp256k1.Secp256k1

/**
 * Error class for getPublicKey function
 */
export class GetPublicKeyError extends Error {
	override name = 'GetPublicKeyError'
	_tag = 'GetPublicKeyError'
	constructor(cause: unknown) {
		super('Unexpected error getting secp256k1 public key with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Computes the secp256k1 ECDSA public key from a provided private key
 */
export function getPublicKey(options: { privateKey: Hex | Bytes }): Effect.Effect<PublicKey, GetPublicKeyError, never> {
	return Effect.try({
		try: () => Ox.Secp256k1.getPublicKey(options),
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
		super('Unexpected error generating random secp256k1 private key with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Generates a random ECDSA private key on the secp256k1 curve
 */
export function randomPrivateKey<as extends 'Hex' | 'Bytes' = 'Hex'>(options?: { as?: as }): Effect.Effect<
	ReturnType<typeof Ox.Secp256k1.randomPrivateKey<as>>,
	RandomPrivateKeyError,
	never
> {
	return Effect.try({
		try: () => Ox.Secp256k1.randomPrivateKey(options),
		catch: (cause) => new RandomPrivateKeyError(cause),
	})
}

/**
 * Error class for recoverAddress function
 */
export class RecoverAddressError extends Error {
	override name = 'RecoverAddressError'
	_tag = 'RecoverAddressError'
	constructor(cause: unknown) {
		super('Unexpected error recovering address from signature with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Recovers the signing address from the signed payload and signature
 */
export function recoverAddress(options: { payload: Hex | Bytes; signature: Signature }): Effect.Effect<
	Address,
	RecoverAddressError,
	never
> {
	return Effect.try({
		try: () => Ox.Secp256k1.recoverAddress(options),
		catch: (cause) => new RecoverAddressError(cause),
	})
}

/**
 * Error class for recoverPublicKey function
 */
export class RecoverPublicKeyError extends Error {
	override name = 'RecoverPublicKeyError'
	_tag = 'RecoverPublicKeyError'
	constructor(cause: unknown) {
		super('Unexpected error recovering public key from signature with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Recovers the signing public key from the signed payload and signature
 */
export function recoverPublicKey(options: { payload: Hex | Bytes; signature: Signature }): Effect.Effect<
	PublicKey,
	RecoverPublicKeyError,
	never
> {
	return Effect.try({
		try: () => Ox.Secp256k1.recoverPublicKey(options),
		catch: (cause) => new RecoverPublicKeyError(cause),
	})
}

/**
 * Error class for sign function
 */
export class SignError extends Error {
	override name = 'SignError'
	_tag = 'SignError'
	constructor(cause: unknown) {
		super('Unexpected error signing payload with secp256k1 with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Signs a payload with the provided private key
 */
export function sign(options: {
	payload: Hex | Bytes
	privateKey: Hex | Bytes
	extraEntropy?: boolean | Hex | Bytes
	hash?: boolean
}): Effect.Effect<Signature, SignError, never> {
	return Effect.try({
		try: () => Ox.Secp256k1.sign(options),
		catch: (cause) => new SignError(cause),
	})
}

/**
 * Error class for verify function with address
 */
export class VerifyWithAddressError extends Error {
	override name = 'VerifyWithAddressError'
	_tag = 'VerifyWithAddressError'
	constructor(cause: unknown) {
		super('Unexpected error verifying signature with address with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Verifies a payload was signed by the provided address
 */
export function verifyWithAddress(options: {
	payload: Hex | Bytes
	address: Address
	signature: Signature
	hash?: boolean
}): Effect.Effect<boolean, VerifyWithAddressError, never> {
	return Effect.try({
		try: () => Ox.Secp256k1.verify(options),
		catch: (cause) => new VerifyWithAddressError(cause),
	})
}

/**
 * Error class for verify function with public key
 */
export class VerifyWithPublicKeyError extends Error {
	override name = 'VerifyWithPublicKeyError'
	_tag = 'VerifyWithPublicKeyError'
	constructor(cause: unknown) {
		super('Unexpected error verifying signature with public key with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Verifies a payload was signed by the provided public key
 */
export function verifyWithPublicKey(options: {
	payload: Hex | Bytes
	publicKey: PublicKey
	signature: Signature
	hash?: boolean
}): Effect.Effect<boolean, VerifyWithPublicKeyError, never> {
	return Effect.try({
		try: () => Ox.Secp256k1.verify(options),
		catch: (cause) => new VerifyWithPublicKeyError(cause),
	})
}
