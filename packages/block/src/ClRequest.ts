// From ethereumjs originally and carries same license
// Unreleased as of this commit https://github.com/ethereumjs/ethereumjs-monorepo/blob/36cd6069815015f4c0202a3335f755b06a5608e8/packages/util/src/requests.ts#L16

export interface ClRequest {
	readonly type: number
	readonly bytes: Uint8Array
	serialize(): Uint8Array
}
