import { Effect } from 'effect'
import Ox from 'ox'
import type { Bytes } from 'ox/core/Bytes'
import type { Hex } from 'ox/core/Hex'
import type { PublicKey } from 'ox/crypto/PublicKey'
import type { Signature } from 'ox/crypto/Signature'

/**
 * Export core types from WebAuthnP256
 */
export type WebAuthnP256 = Ox.WebAuthnP256.WebAuthnP256
export type Credential = Ox.WebAuthnP256.Credential
export type Registration = Ox.WebAuthnP256.Registration

/**
 * Error class for create function
 */
export class CreateError extends Error {
	override name = 'CreateError'
	_tag = 'CreateError'
	constructor(cause: unknown) {
		super('Unexpected error creating WebAuthn P256 credentials with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Creates WebAuthn P256 credentials
 *
 * @param options - Creation options
 * @returns Effect wrapping credentials creation result
 */
export function create(options: Ox.WebAuthnP256.create.Options): Effect.Effect<Credential, CreateError, never> {
	return Effect.try({
		try: () => Ox.WebAuthnP256.create(options),
		catch: (cause) => new CreateError(cause),
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
 * Gets the public key from a WebAuthn credential
 *
 * @param options - Object containing the credential
 * @returns Effect wrapping the public key
 */
export function getPublicKey(options: { credential: Credential }): Effect.Effect<PublicKey, GetPublicKeyError, never> {
	return Effect.try({
		try: () => Ox.WebAuthnP256.getPublicKey(options),
		catch: (cause) => new GetPublicKeyError(cause),
	})
}

/**
 * Error class for register function
 */
export class RegisterError extends Error {
	override name = 'RegisterError'
	_tag = 'RegisterError'
	constructor(cause: unknown) {
		super('Unexpected error registering WebAuthn P256 credentials with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Registers a WebAuthn credential
 *
 * @param options - Registration options
 * @returns Effect wrapping the registration result
 */
export function register(options: Ox.WebAuthnP256.register.Options): Effect.Effect<Registration, RegisterError, never> {
	return Effect.try({
		try: () => Ox.WebAuthnP256.register(options),
		catch: (cause) => new RegisterError(cause),
	})
}

/**
 * Error class for sign function
 */
export class SignError extends Error {
	override name = 'SignError'
	_tag = 'SignError'
	constructor(cause: unknown) {
		super('Unexpected error signing with WebAuthn P256 with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Signs a payload using WebAuthn P256
 *
 * @param options - Object containing the payload, credential, and optional parameters
 * @returns Effect wrapping the signature
 */
export function sign(options: {
	payload: Hex | Bytes
	credential: Credential
	hash?: boolean
}): Effect.Effect<Signature, SignError, never> {
	return Effect.try({
		try: () => Ox.WebAuthnP256.sign(options),
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
 * Verifies a WebAuthn P256 signature
 *
 * @param options - Object containing the payload, public key, signature, and optional hash flag
 * @returns Effect wrapping a boolean indicating if the signature is valid
 */
export function verify(options: {
	payload: Hex | Bytes
	publicKey: PublicKey
	signature: Signature
	hash?: boolean
}): Effect.Effect<boolean, VerifyError, never> {
	return Effect.try({
		try: () => Ox.WebAuthnP256.verify(options),
		catch: (cause) => new VerifyError(cause),
	})
}
