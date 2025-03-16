import { InternalError } from '@tevm/errors'
// Unreleased as of this commit https://github.com/ethereumjs/ethereumjs-monorepo/blob/36cd6069815015f4c0202a3335f755b06a5608e8/packages/util/src/requests.ts#L16
import { concatBytes } from '@tevm/utils'

/**
 * Raw bytes representation of a consensus layer request.
 * Used for serializing and deserializing consensus layer requests.
 * @example
 * ```typescript
 * import { RequestBytes } from '@tevm/block'
 *
 * const value: RequestBytes = new Uint8Array([0x01, 0x02, 0x03])
 * ```
 */
export type RequestBytes = Uint8Array

/**
 * Structured data for a consensus layer request.
 * Contains the request type and associated binary data.
 * @example
 * ```typescript
 * import { RequestData } from '@tevm/block'
 *
 * const value: RequestData = {
 *   type: 1, // Request type identifier
 *   data: new Uint8Array([0x01, 0x02, 0x03]) // Request payload
 * }
 * ```
 */
export interface RequestData {
	type: number
	data: Uint8Array
}

/**
 * Interface for consensus layer request types.
 * Defines the common structure for different types of consensus layer requests.
 * @example
 * ```typescript
 * import { CLRequestType } from '@tevm/block'
 *
 * // Usually implemented by specific request classes
 * const value: CLRequestType = {
 *   type: 1,
 *   bytes: new Uint8Array([0x01, 0x02, 0x03]),
 *   serialize: () => new Uint8Array([0x01, 0x01, 0x02, 0x03])
 * }
 * ```
 */
export interface CLRequestType {
	readonly type: number
	readonly bytes: Uint8Array
	serialize(): Uint8Array
}

/**
 * Base implementation of a consensus layer request.
 * Used to create and serialize requests between the execution and consensus layers.
 * @example
 * ```typescript
 * import { ClRequest } from '@tevm/block'
 *
 * // Create a request with type 1 and some payload data
 * const instance = new ClRequest(1, new Uint8Array([0x01, 0x02, 0x03]))
 * const serialized = instance.serialize() // Type byte followed by payload
 * ```
 */
export class ClRequest implements CLRequestType {
	type: number
	bytes: Uint8Array
	constructor(type: number, bytes: Uint8Array) {
		if (type === undefined) throw new InternalError('request type is required')
		this.type = type
		this.bytes = bytes
	}

	serialize() {
		return concatBytes(Uint8Array.from([this.type]), this.bytes)
	}
}
