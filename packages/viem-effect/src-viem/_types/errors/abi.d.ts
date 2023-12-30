import type { Hex } from '../types/misc.js'
import { BaseError } from './base.js'
import type { AbiEvent, AbiParameter } from 'abitype'
export declare class AbiConstructorNotFoundError extends BaseError {
	name: string
	constructor({
		docsPath,
	}: {
		docsPath: string
	})
}
export declare class AbiConstructorParamsNotFoundError extends BaseError {
	name: string
	constructor({
		docsPath,
	}: {
		docsPath: string
	})
}
export declare class AbiDecodingDataSizeInvalidError extends BaseError {
	name: string
	constructor({
		data,
		size,
	}: {
		data: Hex
		size: number
	})
}
export declare class AbiDecodingDataSizeTooSmallError extends BaseError {
	name: string
	data: Hex
	params: readonly AbiParameter[]
	size: number
	constructor({
		data,
		params,
		size,
	}: {
		data: Hex
		params: readonly AbiParameter[]
		size: number
	})
}
export declare class AbiDecodingZeroDataError extends BaseError {
	name: string
	constructor()
}
export declare class AbiEncodingArrayLengthMismatchError extends BaseError {
	name: string
	constructor({
		expectedLength,
		givenLength,
		type,
	}: {
		expectedLength: number
		givenLength: number
		type: string
	})
}
export declare class AbiEncodingBytesSizeMismatchError extends BaseError {
	name: string
	constructor({
		expectedSize,
		value,
	}: {
		expectedSize: number
		value: Hex
	})
}
export declare class AbiEncodingLengthMismatchError extends BaseError {
	name: string
	constructor({
		expectedLength,
		givenLength,
	}: {
		expectedLength: number
		givenLength: number
	})
}
export declare class AbiErrorInputsNotFoundError extends BaseError {
	name: string
	constructor(
		errorName: string,
		{
			docsPath,
		}: {
			docsPath: string
		},
	)
}
export declare class AbiErrorNotFoundError extends BaseError {
	name: string
	constructor(
		errorName?: string,
		{
			docsPath,
		}?: {
			docsPath?: string
		},
	)
}
export declare class AbiErrorSignatureNotFoundError extends BaseError {
	name: string
	signature: Hex
	constructor(
		signature: Hex,
		{
			docsPath,
		}: {
			docsPath: string
		},
	)
}
export declare class AbiEventSignatureEmptyTopicsError extends BaseError {
	name: string
	constructor({
		docsPath,
	}: {
		docsPath: string
	})
}
export declare class AbiEventSignatureNotFoundError extends BaseError {
	name: string
	constructor(
		signature: Hex,
		{
			docsPath,
		}: {
			docsPath: string
		},
	)
}
export declare class AbiEventNotFoundError extends BaseError {
	name: string
	constructor(
		eventName?: string,
		{
			docsPath,
		}?: {
			docsPath?: string
		},
	)
}
export declare class AbiFunctionNotFoundError extends BaseError {
	name: string
	constructor(
		functionName?: string,
		{
			docsPath,
		}?: {
			docsPath?: string
		},
	)
}
export declare class AbiFunctionOutputsNotFoundError extends BaseError {
	name: string
	constructor(
		functionName: string,
		{
			docsPath,
		}: {
			docsPath: string
		},
	)
}
export declare class AbiFunctionSignatureNotFoundError extends BaseError {
	name: string
	constructor(
		signature: Hex,
		{
			docsPath,
		}: {
			docsPath: string
		},
	)
}
export declare class BytesSizeMismatchError extends BaseError {
	name: string
	constructor({
		expectedSize,
		givenSize,
	}: {
		expectedSize: number
		givenSize: number
	})
}
export declare class DecodeLogDataMismatch extends BaseError {
	name: string
	abiItem: AbiEvent
	data: Hex
	params: readonly AbiParameter[]
	size: number
	constructor({
		abiItem,
		data,
		params,
		size,
	}: {
		abiItem: AbiEvent
		data: Hex
		params: readonly AbiParameter[]
		size: number
	})
}
export declare class DecodeLogTopicsMismatch extends BaseError {
	name: string
	abiItem: AbiEvent
	constructor({
		abiItem,
		param,
	}: {
		abiItem: AbiEvent
		param: AbiParameter & {
			indexed: boolean
		}
	})
}
export declare class InvalidAbiEncodingTypeError extends BaseError {
	name: string
	constructor(
		type: string,
		{
			docsPath,
		}: {
			docsPath: string
		},
	)
}
export declare class InvalidAbiDecodingTypeError extends BaseError {
	name: string
	constructor(
		type: string,
		{
			docsPath,
		}: {
			docsPath: string
		},
	)
}
export declare class InvalidArrayError extends BaseError {
	name: string
	constructor(value: unknown)
}
export declare class InvalidDefinitionTypeError extends BaseError {
	name: string
	constructor(type: string)
}
export declare class UnsupportedPackedAbiType extends BaseError {
	name: string
	constructor(type: unknown)
}
//# sourceMappingURL=abi.d.ts.map
