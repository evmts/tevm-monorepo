import { BaseError } from './base.js'
export class SliceOffsetOutOfBoundsError extends BaseError {
	constructor({ offset, position, size }) {
		super(
			`Slice ${
				position === 'start' ? 'starting' : 'ending'
			} at offset "${offset}" is out-of-bounds (size: ${size}).`,
		)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'SliceOffsetOutOfBoundsError',
		})
	}
}
export class SizeExceedsPaddingSizeError extends BaseError {
	constructor({ size, targetSize, type }) {
		super(
			`${type.charAt(0).toUpperCase()}${type
				.slice(1)
				.toLowerCase()} size (${size}) exceeds padding size (${targetSize}).`,
		)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'SizeExceedsPaddingSizeError',
		})
	}
}
//# sourceMappingURL=data.js.map
