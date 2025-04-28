import { Effect } from 'effect'
import Ox from 'ox'

/**
 * Export the core types
 */
export type WebAuthnP256 = Ox.WebAuthnP256.WebAuthnP256
export type KeyPair = Ox.WebAuthnP256.KeyPair

/**
 * Error class for generateKeyPair function
 */
export class GenerateKeyPairError extends Error {
	override name = 'GenerateKeyPairError'
	_tag = 'GenerateKeyPairError'
	constructor(cause: unknown) {
		super('Unexpected error generating WebAuthn P256 key pair with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Generate a key pair
 */
export function generateKeyPair(): Effect.Effect<KeyPair, GenerateKeyPairError, never> {
	return Effect.try({
		try: () => Ox.WebAuthnP256.generateKeyPair(),
		catch: (cause) => new GenerateKeyPairError(cause),
	})
}

/**
 * Error class for sign function
 */
export class SignError extends Error {
	override name = 'SignError'
	_tag = 'SignError'
	constructor(cause: unknown) {
		super('Unexpected error signing message with WebAuthn P256 with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Sign a message
 */
export function sign(message: Uint8Array, privateKey: Uint8Array): Effect.Effect<Uint8Array, SignError, never> {
	return Effect.try({
		try: () => Ox.WebAuthnP256.sign(message, privateKey),
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
		super('Unexpected error verifying WebAuthn P256 signature with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Verify a signature
 */
export function verify(
	message: Uint8Array,
	signature: Uint8Array,
	publicKey: Uint8Array,
): Effect.Effect<boolean, VerifyError, never> {
	return Effect.try({
		try: () => Ox.WebAuthnP256.verify(message, signature, publicKey),
		catch: (cause) => new VerifyError(cause),
	})
}

/**
 * Error class for getPublicKey function
 */
export class GetPublicKeyError extends Error {
	override name = 'GetPublicKeyError'
	_tag = 'GetPublicKeyError'
	constructor(cause: unknown) {
		super('Unexpected error getting WebAuthn P256 public key with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Get public key from private key
 */
export function getPublicKey(privateKey: Uint8Array): Effect.Effect<Uint8Array, GetPublicKeyError, never> {
	return Effect.try({
		try: () => Ox.WebAuthnP256.getPublicKey(privateKey),
		catch: (cause) => new GetPublicKeyError(cause),
	})
}
