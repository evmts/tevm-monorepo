import { Effect } from 'effect'
import Ox from 'ox'
import type { Bytes } from 'ox/core/Bytes'
import type { Hex } from 'ox/core/Hex'
import type { PublicKey } from 'ox/crypto/PublicKey'
import type { Signature } from 'ox/crypto/Signature'

/**
 * Export the core type
 */
export type P256 = Ox.P256.P256

/**
 * Error class for getPublicKey function
 */
export class GetPublicKeyError extends Error {
  override name = "GetPublicKeyError"
  _tag = "GetPublicKeyError"
  constructor(cause: unknown) {
    super("Unexpected error getting P256 public key with ox", {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Computes the P256 ECDSA public key from a provided private key
 * 
 * @param options - Object containing the private key
 * @returns The public key
 */
export function getPublicKey(
  options: { privateKey: Hex | Bytes }
): Effect.Effect<PublicKey, GetPublicKeyError, never> {
  return Effect.try({
    try: () => Ox.P256.getPublicKey(options),
    catch: (cause) => new GetPublicKeyError(cause),
  })
}

/**
 * Error class for randomPrivateKey function
 */
export class RandomPrivateKeyError extends Error {
  override name = "RandomPrivateKeyError"
  _tag = "RandomPrivateKeyError"
  constructor(cause: unknown) {
    super("Unexpected error generating random P256 private key with ox", {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Generates a random P256 ECDSA private key
 * 
 * @param options - Optional object specifying the return format
 * @returns A random private key
 */
export function randomPrivateKey<as extends 'Hex' | 'Bytes' = 'Hex'>(
  options?: { as?: as }
): Effect.Effect<ReturnType<typeof Ox.P256.randomPrivateKey<as>>, RandomPrivateKeyError, never> {
  return Effect.try({
    try: () => Ox.P256.randomPrivateKey(options),
    catch: (cause) => new RandomPrivateKeyError(cause),
  })
}

/**
 * Error class for recoverPublicKey function
 */
export class RecoverPublicKeyError extends Error {
  override name = "RecoverPublicKeyError"
  _tag = "RecoverPublicKeyError"
  constructor(cause: unknown) {
    super("Unexpected error recovering P256 public key from signature with ox", {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Recovers the signing public key from the signed payload and signature
 * 
 * @param options - Object containing the payload and signature
 * @returns The recovered public key
 */
export function recoverPublicKey(
  options: { payload: Hex | Bytes; signature: Signature }
): Effect.Effect<PublicKey, RecoverPublicKeyError, never> {
  return Effect.try({
    try: () => Ox.P256.recoverPublicKey(options),
    catch: (cause) => new RecoverPublicKeyError(cause),
  })
}

/**
 * Error class for sign function
 */
export class SignError extends Error {
  override name = "SignError"
  _tag = "SignError"
  constructor(cause: unknown) {
    super("Unexpected error signing with P256 with ox", {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Signs a payload with the provided private key and returns a P256 signature
 * 
 * @param options - Object containing the payload, private key, and optional parameters
 * @returns A signature
 */
export function sign(
  options: {
    payload: Hex | Bytes
    privateKey: Hex | Bytes
    extraEntropy?: boolean | Hex | Bytes
    hash?: boolean
  }
): Effect.Effect<Signature, SignError, never> {
  return Effect.try({
    try: () => Ox.P256.sign(options),
    catch: (cause) => new SignError(cause),
  })
}

/**
 * Error class for verify function
 */
export class VerifyError extends Error {
  override name = "VerifyError"
  _tag = "VerifyError"
  constructor(cause: unknown) {
    super("Unexpected error verifying P256 signature with ox", {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Verifies a payload was signed by the provided public key
 * 
 * @param options - Object containing the payload, public key, signature, and optional hash flag
 * @returns A boolean indicating if the signature is valid
 */
export function verify(
  options: {
    payload: Hex | Bytes
    publicKey: PublicKey<boolean>
    signature: Signature<boolean>
    hash?: boolean
  }
): Effect.Effect<boolean, VerifyError, never> {
  return Effect.try({
    try: () => Ox.P256.verify(options),
    catch: (cause) => new VerifyError(cause),
  })
}