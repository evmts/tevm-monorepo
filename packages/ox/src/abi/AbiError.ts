import { Effect } from 'effect'
import Ox from 'ox'

export type AbiError = Ox.AbiError.AbiError

export class DecodeError extends Error {
	override name = 'DecodeError'
	_tag = 'DecodeError'
	constructor(cause: Ox.AbiError.decode.ErrorType) {
		super('Unexpected error decoding ABI error with ox', {
			cause,
		})
	}
}

export function decode(
	errorItem: Ox.AbiError.AbiError,
	data: Ox.Hex | Uint8Array,
): Effect.Effect<Ox.AbiError.decode.ReturnType, DecodeError, never> {
	return Effect.try({
		try: () => Ox.AbiError.decode(errorItem, data),
		catch: (cause) => new DecodeError(cause as Ox.AbiError.decode.ErrorType),
	})
}

export class EncodeError extends Error {
	override name = 'EncodeError'
	_tag = 'EncodeError'
	constructor(cause: Ox.AbiError.encode.ErrorType) {
		super('Unexpected error encoding ABI error with ox', {
			cause,
		})
	}
}

export function encode(
	errorItem: Ox.AbiError.AbiError,
	args: readonly unknown[],
): Effect.Effect<Ox.AbiError.encode.ReturnType, EncodeError, never> {
	return Effect.try({
		try: () => Ox.AbiError.encode(errorItem, args),
		catch: (cause) => new EncodeError(cause as Ox.AbiError.encode.ErrorType),
	})
}

export class FormatError extends Error {
	override name = 'FormatError'
	_tag = 'FormatError'
	constructor(cause: Ox.AbiError.format.ErrorType) {
		super('Unexpected error formatting ABI error with ox', {
			cause,
		})
	}
}

export function format(
	errorItem: Ox.AbiError.AbiError,
): Effect.Effect<Ox.AbiError.format.ReturnType, FormatError, never> {
	return Effect.try({
		try: () => Ox.AbiError.format(errorItem),
		catch: (cause) => new FormatError(cause as Ox.AbiError.format.ErrorType),
	})
}

export class FromError extends Error {
	override name = 'FromError'
	_tag = 'FromError'
	constructor(cause: Ox.AbiError.from.ErrorType) {
		super('Unexpected error parsing ABI error with ox', {
			cause,
		})
	}
}

export function from(
	errorItem: Ox.AbiItem.AbiItem | string,
): Effect.Effect<Ox.AbiError.from.ReturnType, FromError, never> {
	return Effect.try({
		try: () => Ox.AbiError.from(errorItem),
		catch: (cause) => new FromError(cause as Ox.AbiError.from.ErrorType),
	})
}

export class FromAbiError extends Error {
	override name = 'FromAbiError'
	_tag = 'FromAbiError'
	constructor(cause: Ox.AbiError.fromAbi.ErrorType) {
		super('Unexpected error extracting ABI error from ABI with ox', {
			cause,
		})
	}
}

export function fromAbi(
	abi: Ox.Abi.Abi | readonly string[],
	nameOrSignatureOrIndex?: string | number,
): Effect.Effect<Ox.AbiError.fromAbi.ReturnType, FromAbiError, never> {
	return Effect.try({
		try: () => Ox.AbiError.fromAbi(abi, nameOrSignatureOrIndex),
		catch: (cause) => new FromAbiError(cause as Ox.AbiError.fromAbi.ErrorType),
	})
}

export class GetSelectorError extends Error {
	override name = 'GetSelectorError'
	_tag = 'GetSelectorError'
	constructor(cause: Ox.AbiError.getSelector.ErrorType) {
		super('Unexpected error getting ABI error selector with ox', {
			cause,
		})
	}
}

export function getSelector(
	errorItem: Ox.AbiError.AbiError,
): Effect.Effect<Ox.AbiError.getSelector.ReturnType, GetSelectorError, never> {
	return Effect.try({
		try: () => Ox.AbiError.getSelector(errorItem),
		catch: (cause) => new GetSelectorError(cause as Ox.AbiError.getSelector.ErrorType),
	})
}
