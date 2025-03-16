import { InternalError } from '@tevm/errors'
// Unreleased as of this commit https://github.com/ethereumjs/ethereumjs-monorepo/blob/36cd6069815015f4c0202a3335f755b06a5608e8/packages/util/src/requests.ts#L16
import { concatBytes } from '@tevm/utils'

/**
 * [Description of what this type represents]
 * @example
 * ```typescript
 * import { RequestBytes } from '[package-path]'
 * 
 * const value: RequestBytes = {
 *   // Initialize properties
 * }
 * ```
 */
export type RequestBytes = Uint8Array

/**
 * [Description of what this interface represents]
 * @example
 * ```typescript
 * import { RequestData } from '[package-path]'
 * 
 * const value: RequestData = {
 *   // Initialize properties
 * }
 * ```
 */
export interface RequestData {
	type: number
	data: Uint8Array
}

/**
 * [Description of what this interface represents]
 * @example
 * ```typescript
 * import { CLRequestType } from '[package-path]'
 * 
 * const value: CLRequestType = {
 *   // Initialize properties
 * }
 * ```
 */
export interface CLRequestType {
	readonly type: number
	readonly bytes: Uint8Array
	serialize(): Uint8Array
}

/**
 * [Description of what ClRequest represents]
 * @example
 * ```typescript
 * import { ClRequest } from '[package-path]'
 * 
 * const instance = new ClRequest()
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
