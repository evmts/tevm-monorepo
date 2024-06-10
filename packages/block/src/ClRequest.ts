// Unreleased as of this commit https://github.com/ethereumjs/ethereumjs-monorepo/blob/36cd6069815015f4c0202a3335f755b06a5608e8/packages/util/src/requests.ts#L16
import { concatBytes } from '@tevm/utils'
import { InternalError } from '@tevm/errors'

export type RequestBytes = Uint8Array

export interface RequestData {
	type: number
	data: Uint8Array
}

export interface CLRequestType {
	readonly type: number
	readonly bytes: Uint8Array
	serialize(): Uint8Array
}

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
