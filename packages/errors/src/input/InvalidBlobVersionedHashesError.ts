import type { TypedError } from '../TypedError.js'

/**
 * Error thrown when blobVersionedHashes parameter is invalid
 */
export type InvalidBlobVersionedHashesError =
	TypedError<'InvalidBlobVersionedHashesError'>
