import type { ByteArray, Hex } from '../types/misc.js'
import { BaseError } from './base.js'
export declare class DataLengthTooLongError extends BaseError {
	name: string
	constructor({
		consumed,
		length,
	}: {
		consumed: number
		length: number
	})
}
export declare class DataLengthTooShortError extends BaseError {
	name: string
	constructor({
		length,
		dataLength,
	}: {
		length: number
		dataLength: number
	})
}
export declare class IntegerOutOfRangeError extends BaseError {
	name: string
	constructor({
		max,
		min,
		signed,
		size,
		value,
	}: {
		max?: string
		min: string
		signed?: boolean
		size?: number
		value: string
	})
}
export declare class InvalidBytesBooleanError extends BaseError {
	name: string
	constructor(bytes: ByteArray)
}
export declare class InvalidHexBooleanError extends BaseError {
	name: string
	constructor(hex: Hex)
}
export declare class InvalidHexValueError extends BaseError {
	name: string
	constructor(value: Hex)
}
export declare class OffsetOutOfBoundsError extends BaseError {
	name: string
	constructor({
		nextOffset,
		offset,
	}: {
		nextOffset: number
		offset: number
	})
}
export declare class SizeOverflowError extends BaseError {
	name: string
	constructor({
		givenSize,
		maxSize,
	}: {
		givenSize: number
		maxSize: number
	})
}
//# sourceMappingURL=encoding.d.ts.map
