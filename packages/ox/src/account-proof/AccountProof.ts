import { Effect } from 'effect'
import Ox from 'ox'
import type { Address } from 'ox/core/Address'
import type { Bytes } from 'ox/core/Bytes'
import type { Hex } from 'ox/core/Hex'

// Export core types
export type AccountProof = Ox.AccountProof.AccountProof
export type AccountProofJson = Ox.AccountProof.AccountProofJson
export type StorageProof = Ox.AccountProof.StorageProof

/**
 * Error class for parse function
 */
export class ParseError extends Error {
	override name = 'ParseError'
	_tag = 'ParseError'
	constructor(cause: unknown) {
		super('Unexpected error parsing account proof with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Parses account proof from raw RPC response
 *
 * @param value - The account proof JSON response from RPC
 * @returns Effect wrapping the parsed account proof
 */
export function parse(value: AccountProofJson): Effect.Effect<AccountProof, ParseError, never> {
	return Effect.try({
		try: () => Ox.AccountProof.parse(value),
		catch: (cause) => new ParseError(cause),
	})
}

/**
 * Error class for verify function
 */
export class VerifyError extends Error {
	override name = 'VerifyError'
	_tag = 'VerifyError'
	constructor(cause: unknown) {
		super('Unexpected error verifying account proof with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Verifies an account proof against the provided state root
 *
 * @param options - Object containing the proof, address, and state root
 * @returns Effect wrapping a boolean indicating if the proof is valid
 */
export function verify(options: {
	proof: AccountProof
	address: Address
	stateRoot: Hex | Bytes
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
	override name = 'VerifyStorageError'
	_tag = 'VerifyStorageError'
	constructor(cause: unknown) {
		super('Unexpected error verifying storage proof with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Verifies a storage proof against the provided storage root
 *
 * @param options - Object containing the proof, storage root, and slot
 * @returns Effect wrapping a boolean indicating if the storage proof is valid
 */
export function verifyStorage(options: {
	proof: StorageProof
	storageRoot: Hex | Bytes
	slot: Hex | Bytes
}): Effect.Effect<boolean, VerifyStorageError, never> {
	return Effect.try({
		try: () => Ox.AccountProof.verifyStorage(options),
		catch: (cause) => new VerifyStorageError(cause),
	})
}
