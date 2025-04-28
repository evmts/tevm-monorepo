import { Effect } from 'effect'
import Ox from 'ox'

// Export the core types
export type WebCryptoP256 = Ox.WebCryptoP256.WebCryptoP256
export type JWK = Ox.WebCryptoP256.JWK
export type KeyPair = Ox.WebCryptoP256.KeyPair

/**
 * Error class for getPublicKey function
 */
export class GetPublicKeyError extends Error {
	override name = 'GetPublicKeyError'
	_tag = 'GetPublicKeyError'
	constructor(cause: unknown) {
		super('Unexpected error getting WebCrypto P256 public key with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Computes the WebCrypto P256 ECDSA public key from a provided private key
 */
export function getPublicKey(options: {
	privateKey: Ox.Hex.Hex | Ox.Bytes.Bytes
}): Effect.Effect<Ox.PublicKey.PublicKey, GetPublicKeyError, never> {
	return Effect.try({
		try: () => Ox.WebCryptoP256.getPublicKey(options),
		catch: (cause) => new GetPublicKeyError(cause),
	})
}

/**
 * Error class for importPrivateKey function
 */
export class ImportPrivateKeyError extends Error {
	override name = 'ImportPrivateKeyError'
	_tag = 'ImportPrivateKeyError'
	constructor(cause: unknown) {
		super('Unexpected error importing WebCrypto P256 private key with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Imports a private key from JWK format
 */
export function importPrivateKey(options: {
	jwk: JWK
}): Effect.Effect<CryptoKey, ImportPrivateKeyError, never> {
	return Effect.try({
		try: () => Ox.WebCryptoP256.importPrivateKey(options),
		catch: (cause) => new ImportPrivateKeyError(cause),
	})
}

/**
 * Error class for importPublicKey function
 */
export class ImportPublicKeyError extends Error {
	override name = 'ImportPublicKeyError'
	_tag = 'ImportPublicKeyError'
	constructor(cause: unknown) {
		super('Unexpected error importing WebCrypto P256 public key with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Imports a public key from JWK format
 */
export function importPublicKey(options: {
	jwk: JWK
}): Effect.Effect<CryptoKey, ImportPublicKeyError, never> {
	return Effect.try({
		try: () => Ox.WebCryptoP256.importPublicKey(options),
		catch: (cause) => new ImportPublicKeyError(cause),
	})
}

/**
 * Error class for exportPublicKey function
 */
export class ExportPublicKeyError extends Error {
	override name = 'ExportPublicKeyError'
	_tag = 'ExportPublicKeyError'
	constructor(cause: unknown) {
		super('Unexpected error exporting WebCrypto P256 public key with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Exports a public key to JWK format
 */
export function exportPublicKey(options: {
	publicKey: CryptoKey
}): Effect.Effect<JWK, ExportPublicKeyError, never> {
	return Effect.try({
		try: () => Ox.WebCryptoP256.exportPublicKey(options),
		catch: (cause) => new ExportPublicKeyError(cause),
	})
}

/**
 * Error class for exportPrivateKey function
 */
export class ExportPrivateKeyError extends Error {
	override name = 'ExportPrivateKeyError'
	_tag = 'ExportPrivateKeyError'
	constructor(cause: unknown) {
		super('Unexpected error exporting WebCrypto P256 private key with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Exports a private key to JWK format
 */
export function exportPrivateKey(options: {
	privateKey: CryptoKey
}): Effect.Effect<JWK, ExportPrivateKeyError, never> {
	return Effect.try({
		try: () => Ox.WebCryptoP256.exportPrivateKey(options),
		catch: (cause) => new ExportPrivateKeyError(cause),
	})
}

/**
 * Error class for generateKeyPair function
 */
export class GenerateKeyPairError extends Error {
	override name = 'GenerateKeyPairError'
	_tag = 'GenerateKeyPairError'
	constructor(cause: unknown) {
		super('Unexpected error generating WebCrypto P256 key pair with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Generates a new key pair for P256
 */
export function generateKeyPair(): Effect.Effect<KeyPair, GenerateKeyPairError, never> {
	return Effect.try({
		try: () => Ox.WebCryptoP256.generateKeyPair(),
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
		super('Unexpected error signing with WebCrypto P256 with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Signs a payload with the provided private key and returns a signature
 */
export function sign(options: {
	payload: Ox.Hex.Hex | Ox.Bytes.Bytes
	privateKey: CryptoKey
	hash?: boolean
}): Effect.Effect<Ox.Signature.Signature, SignError, never> {
	return Effect.try({
		try: () => Ox.WebCryptoP256.sign(options),
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
		super('Unexpected error verifying with WebCrypto P256 with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Verifies a payload was signed by the provided public key
 */
export function verify(options: {
	payload: Ox.Hex.Hex | Ox.Bytes.Bytes
	publicKey: CryptoKey
	signature: Ox.Signature.Signature
	hash?: boolean
}): Effect.Effect<boolean, VerifyError, never> {
	return Effect.try({
		try: () => Ox.WebCryptoP256.verify(options),
		catch: (cause) => new VerifyError(cause),
	})
}
