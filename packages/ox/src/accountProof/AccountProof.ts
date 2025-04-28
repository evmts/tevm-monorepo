import { Effect } from 'effect'
import Ox from 'ox'

/**
 * Export the core types
 */
export type AccountProof = Ox.AccountProof.AccountProof
export type AccountProofJson = Ox.AccountProof.AccountProofJson
export type StorageProof = Ox.AccountProof.StorageProof

/**
 * Error class for parse function
 */
export class ParseError extends Error {
  override name = "ParseError"
  _tag = "ParseError"
  constructor(cause: unknown) {
    super("Unexpected error parsing account proof with ox", {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Parses account proof from raw RPC response
 */
export function parse(
  value: AccountProofJson
): Effect.Effect<AccountProof, ParseError, never> {
  return Effect.try({
    try: () => Ox.AccountProof.parse(value),
    catch: (cause) => new ParseError(cause),
  })
}

/**
 * Error class for verify function
 */
export class VerifyError extends Error {
  override name = "VerifyError"
  _tag = "VerifyError"
  constructor(cause: unknown) {
    super("Unexpected error verifying account proof with ox", {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Verifies an account proof against the provided state root
 */
export function verify(options: {
  proof: AccountProof
  address: Ox.Address.Address
  stateRoot: Ox.Hex.Hex | Ox.Bytes.Bytes
}): Effect.Effect<boolean, VerifyError, never> {
  return Effect.try({
    try: () => Ox.AccountProof.verify(options),
    catch: (cause) => new VerifyError(cause),
  })
}

/**
 * Error class for verifyStorage function
 */
export class VerifyStorageError extends Error {
  override name = "VerifyStorageError"
  _tag = "VerifyStorageError"
  constructor(cause: unknown) {
    super("Unexpected error verifying storage proof with ox", {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Verifies a storage proof against the provided storage root
 */
export function verifyStorage(options: {
  proof: StorageProof
  storageRoot: Ox.Hex.Hex | Ox.Bytes.Bytes
  slot: Ox.Hex.Hex | Ox.Bytes.Bytes
}): Effect.Effect<boolean, VerifyStorageError, never> {
  return Effect.try({
    try: () => Ox.AccountProof.verifyStorage(options),
    catch: (cause) => new VerifyStorageError(cause),
  })
}