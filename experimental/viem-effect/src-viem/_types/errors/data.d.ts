import { BaseError } from './base.js'
export declare class SliceOffsetOutOfBoundsError extends BaseError {
	name: string
	constructor({
		offset,
		position,
		size,
	}: {
		offset: number
		position: 'start' | 'end'
		size: number
	})
}
export declare class SizeExceedsPaddingSizeError extends BaseError {
	name: string
	constructor({
		size,
		targetSize,
		type,
	}: {
		size: number
		targetSize: number
		type: 'hex' | 'bytes'
	})
}
//# sourceMappingURL=data.d.ts.map
