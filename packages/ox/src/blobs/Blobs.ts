import { Effect } from 'effect'
import Ox from 'ox'

// Export the core types
export type Blob = Ox.Blobs.Blob
export type Blobs = Ox.Blobs.Blobs
export type BlobSidecar = Ox.Blobs.BlobSidecar
export type BlobSidecars = Ox.Blobs.BlobSidecars

/**
 * Error class for isBlob function
 */
export class IsBlobError extends Error {
	override name = 'IsBlobError'
	_tag = 'IsBlobError'
	constructor(cause: unknown) {
		super('Unexpected error checking if value is a blob with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Verifies that a Bytes is a valid blob
 */
export function isBlob(blob: Ox.Bytes.Bytes): Effect.Effect<boolean, IsBlobError, never> {
	return Effect.try({
		try: () => Ox.Blobs.isBlob(blob),
		catch: (cause) => new IsBlobError(cause),
	})
}

/**
 * Error class for isValid function
 */
export class IsValidError extends Error {
	override name = 'IsValidError'
	_tag = 'IsValidError'
	constructor(cause: unknown) {
		super('Unexpected error validating blob with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Verifies if a blob is a valid 4844 blob
 */
export function isValid(blob: Ox.Bytes.Bytes): Effect.Effect<boolean, IsValidError, never> {
	return Effect.try({
		try: () => Ox.Blobs.isValid(blob),
		catch: (cause) => new IsValidError(cause),
	})
}

/**
 * Error class for toBytes function
 */
export class ToBytesError extends Error {
	override name = 'ToBytesError'
	_tag = 'ToBytesError'
	constructor(cause: unknown) {
		super('Unexpected error converting blob to bytes with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Creates a 4844 Bytes blob
 */
export function toBytes(blob: Blob): Effect.Effect<Ox.Bytes.Bytes, ToBytesError, never> {
	return Effect.try({
		try: () => Ox.Blobs.toBytes(blob),
		catch: (cause) => new ToBytesError(cause),
	})
}

/**
 * Error class for toHex function
 */
export class ToHexError extends Error {
	override name = 'ToHexError'
	_tag = 'ToHexError'
	constructor(cause: unknown) {
		super('Unexpected error converting blob to hex with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Creates a 4844 Hex blob
 */
export function toHex(blob: Blob): Effect.Effect<Ox.Hex.Hex, ToHexError, never> {
	return Effect.try({
		try: () => Ox.Blobs.toHex(blob),
		catch: (cause) => new ToHexError(cause),
	})
}

/**
 * Error class for fromHex function
 */
export class FromHexError extends Error {
	override name = 'FromHexError'
	_tag = 'FromHexError'
	constructor(cause: unknown) {
		super('Unexpected error converting hex to blob with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Converts a Hex to a 4844 Blob
 */
export function fromHex(hex: Ox.Hex.Hex): Effect.Effect<Blob, FromHexError, never> {
	return Effect.try({
		try: () => Ox.Blobs.fromHex(hex),
		catch: (cause) => new FromHexError(cause),
	})
}

/**
 * Error class for fromBytes function
 */
export class FromBytesError extends Error {
	override name = 'FromBytesError'
	_tag = 'FromBytesError'
	constructor(cause: unknown) {
		super('Unexpected error converting bytes to blob with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Converts a Bytes to a 4844 Blob
 */
export function fromBytes(bytes: Ox.Bytes.Bytes): Effect.Effect<Blob, FromBytesError, never> {
	return Effect.try({
		try: () => Ox.Blobs.fromBytes(bytes),
		catch: (cause) => new FromBytesError(cause),
	})
}

/**
 * Error class for toVersionedHash function
 */
export class ToVersionedHashError extends Error {
	override name = 'ToVersionedHashError'
	_tag = 'ToVersionedHashError'
	constructor(cause: unknown) {
		super('Unexpected error creating versioned hash from commitment with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Creates a versioned hash from a commitment
 */
export function toVersionedHash(
	commitment: Ox.Bytes.Bytes,
): Effect.Effect<Ox.Bytes.Bytes, ToVersionedHashError, never> {
	return Effect.try({
		try: () => Ox.Blobs.toVersionedHash(commitment),
		catch: (cause) => new ToVersionedHashError(cause),
	})
}

/**
 * Error class for toCommitments function
 */
export class ToCommitmentsError extends Error {
	override name = 'ToCommitmentsError'
	_tag = 'ToCommitmentsError'
	constructor(cause: unknown) {
		super('Unexpected error computing commitments from blobs with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Computes commitments from Blobs
 */
export function toCommitments(blobs: Blobs): Effect.Effect<Ox.Bytes.Bytes[], ToCommitmentsError, never> {
	return Effect.try({
		try: () => Ox.Blobs.toCommitments(blobs),
		catch: (cause) => new ToCommitmentsError(cause),
	})
}

/**
 * Error class for toVersionedHashes function
 */
export class ToVersionedHashesError extends Error {
	override name = 'ToVersionedHashesError'
	_tag = 'ToVersionedHashesError'
	constructor(cause: unknown) {
		super('Unexpected error computing versioned hashes from blobs with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Computes versioned hashes from Blobs
 */
export function toVersionedHashes(blobs: Blobs): Effect.Effect<Ox.Bytes.Bytes[], ToVersionedHashesError, never> {
	return Effect.try({
		try: () => Ox.Blobs.toVersionedHashes(blobs),
		catch: (cause) => new ToVersionedHashesError(cause),
	})
}

/**
 * Error class for toProofs function
 */
export class ToProofsError extends Error {
	override name = 'ToProofsError'
	_tag = 'ToProofsError'
	constructor(cause: unknown) {
		super('Unexpected error generating proofs from blobs with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Generates proofs for Blobs
 */
export function toProofs(blobs: Blobs): Effect.Effect<Ox.Bytes.Bytes[], ToProofsError, never> {
	return Effect.try({
		try: () => Ox.Blobs.toProofs(blobs),
		catch: (cause) => new ToProofsError(cause),
	})
}

/**
 * Error class for toSidecars function
 */
export class ToSidecarsError extends Error {
	override name = 'ToSidecarsError'
	_tag = 'ToSidecarsError'
	constructor(cause: unknown) {
		super('Unexpected error transforming blobs to blob sidecars with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Transforms Blobs to BlobSidecars
 */
export function toSidecars(blobs: Blobs): Effect.Effect<BlobSidecars, ToSidecarsError, never> {
	return Effect.try({
		try: () => Ox.Blobs.toSidecars(blobs),
		catch: (cause) => new ToSidecarsError(cause),
	})
}

/**
 * Error class for from function
 */
export class FromError extends Error {
	override name = 'FromError'
	_tag = 'FromError'
	constructor(cause: unknown) {
		super('Unexpected error transforming data to blobs with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Transforms arbitrary data to Blobs
 */
export function from<TInput>(input: TInput): Effect.Effect<Blobs, FromError, never> {
	return Effect.try({
		try: () => Ox.Blobs.from(input),
		catch: (cause) => new FromError(cause),
	})
}

/**
 * Error class for to function
 */
export class ToError extends Error {
	override name = 'ToError'
	_tag = 'ToError'
	constructor(cause: unknown) {
		super('Unexpected error transforming blobs to original data with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Transforms Blobs back to original data
 */
export function to<TOutput>(blobs: Blobs): Effect.Effect<TOutput, ToError, never> {
	return Effect.try({
		try: () => Ox.Blobs.to<TOutput>(blobs),
		catch: (cause) => new ToError(cause),
	})
}

/**
 * Error class for commitmentsToVersionedHashes function
 */
export class CommitmentsToVersionedHashesError extends Error {
	override name = 'CommitmentsToVersionedHashesError'
	_tag = 'CommitmentsToVersionedHashesError'
	constructor(cause: unknown) {
		super('Unexpected error transforming commitments to versioned hashes with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Transforms commitments to blob versioned hashes
 */
export function commitmentsToVersionedHashes(
	commitments: Ox.Bytes.Bytes[],
): Effect.Effect<Ox.Bytes.Bytes[], CommitmentsToVersionedHashesError, never> {
	return Effect.try({
		try: () => Ox.Blobs.commitmentsToVersionedHashes(commitments),
		catch: (cause) => new CommitmentsToVersionedHashesError(cause),
	})
}

/**
 * Error class for commitmentToVersionedHash function
 */
export class CommitmentToVersionedHashError extends Error {
	override name = 'CommitmentToVersionedHashError'
	_tag = 'CommitmentToVersionedHashError'
	constructor(cause: unknown) {
		super('Unexpected error transforming commitment to versioned hash with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Transforms a single commitment to a versioned hash
 */
export function commitmentToVersionedHash(
	commitment: Ox.Bytes.Bytes,
): Effect.Effect<Ox.Bytes.Bytes, CommitmentToVersionedHashError, never> {
	return Effect.try({
		try: () => Ox.Blobs.commitmentToVersionedHash(commitment),
		catch: (cause) => new CommitmentToVersionedHashError(cause),
	})
}

/**
 * Error class for sidecarsToVersionedHashes function
 */
export class SidecarsToVersionedHashesError extends Error {
	override name = 'SidecarsToVersionedHashesError'
	_tag = 'SidecarsToVersionedHashesError'
	constructor(cause: unknown) {
		super('Unexpected error converting blob sidecars to versioned hashes with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Converts blob sidecars to versioned hashes
 */
export function sidecarsToVersionedHashes(
	sidecars: BlobSidecars,
): Effect.Effect<Ox.Bytes.Bytes[], SidecarsToVersionedHashesError, never> {
	return Effect.try({
		try: () => Ox.Blobs.sidecarsToVersionedHashes(sidecars),
		catch: (cause) => new SidecarsToVersionedHashesError(cause),
	})
}
