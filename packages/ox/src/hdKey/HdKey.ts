import { Effect } from 'effect'
import Ox from 'ox'
import type { Bytes } from 'ox/core/Bytes'

/**
 * Export the core type
 */
export type HdKey = Ox.HdKey.HdKey

/**
 * Error class for fromSeed function
 */
export class FromSeedError extends Error {
  override name = "FromSeedError"
  _tag = "FromSeedError"
  constructor(cause: unknown) {
    super("Unexpected error creating HD key from seed with ox", {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Creates an HD key from seed data
 */
export function fromSeed(
  seed: Bytes
): Effect.Effect<HdKey, FromSeedError, never> {
  return Effect.try({
    try: () => Ox.HdKey.fromSeed(seed),
    catch: (cause) => new FromSeedError(cause),
  })
}

/**
 * Error class for fromExtendedKey function
 */
export class FromExtendedKeyError extends Error {
  override name = "FromExtendedKeyError"
  _tag = "FromExtendedKeyError"
  constructor(cause: unknown) {
    super("Unexpected error creating HD key from extended key with ox", {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Creates an HD key from an extended key
 */
export function fromExtendedKey(
  extendedKey: string
): Effect.Effect<HdKey, FromExtendedKeyError, never> {
  return Effect.try({
    try: () => Ox.HdKey.fromExtendedKey(extendedKey),
    catch: (cause) => new FromExtendedKeyError(cause),
  })
}

/**
 * Error class for derive function
 */
export class DeriveError extends Error {
  override name = "DeriveError"
  _tag = "DeriveError"
  constructor(cause: unknown) {
    super("Unexpected error deriving child HD key from path with ox", {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Derives a child HD key from a path
 */
export function derive(
  hdKey: HdKey, 
  path: string
): Effect.Effect<HdKey, DeriveError, never> {
  return Effect.try({
    try: () => Ox.HdKey.derive(hdKey, path),
    catch: (cause) => new DeriveError(cause),
  })
}

/**
 * Error class for getExtendedPrivateKey function
 */
export class GetExtendedPrivateKeyError extends Error {
  override name = "GetExtendedPrivateKeyError"
  _tag = "GetExtendedPrivateKeyError"
  constructor(cause: unknown) {
    super("Unexpected error getting extended private key with ox", {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Gets the extended private key
 */
export function getExtendedPrivateKey(
  hdKey: HdKey
): Effect.Effect<string, GetExtendedPrivateKeyError, never> {
  return Effect.try({
    try: () => Ox.HdKey.getExtendedPrivateKey(hdKey),
    catch: (cause) => new GetExtendedPrivateKeyError(cause),
  })
}

/**
 * Error class for getExtendedPublicKey function
 */
export class GetExtendedPublicKeyError extends Error {
  override name = "GetExtendedPublicKeyError"
  _tag = "GetExtendedPublicKeyError"
  constructor(cause: unknown) {
    super("Unexpected error getting extended public key with ox", {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Gets the extended public key
 */
export function getExtendedPublicKey(
  hdKey: HdKey
): Effect.Effect<string, GetExtendedPublicKeyError, never> {
  return Effect.try({
    try: () => Ox.HdKey.getExtendedPublicKey(hdKey),
    catch: (cause) => new GetExtendedPublicKeyError(cause),
  })
}

/**
 * Error class for getAddress function
 */
export class GetAddressError extends Error {
  override name = "GetAddressError"
  _tag = "GetAddressError"
  constructor(cause: unknown) {
    super("Unexpected error getting address from HD key with ox", {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Gets the address from an HD key
 */
export function getAddress(
  hdKey: HdKey
): Effect.Effect<string, GetAddressError, never> {
  return Effect.try({
    try: () => Ox.HdKey.getAddress(hdKey),
    catch: (cause) => new GetAddressError(cause),
  })
}