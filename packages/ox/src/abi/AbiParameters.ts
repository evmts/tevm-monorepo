import { Effect } from 'effect'
import Ox from 'ox'

export type AbiParameters = Ox.AbiParameters.AbiParameters

export class DecodeError extends Error {
	override name = 'DecodeError'
	_tag = 'DecodeError'
	constructor(cause: Ox.AbiParameters.decode.ErrorType) {
		super('Unexpected error decoding ABI parameters with ox', {
			cause,
		})
	}
}

export function decode(
	params: Ox.AbiParameters.AbiParameters,
	data: Ox.Hex | Uint8Array,
): Effect.Effect<Ox.AbiParameters.decode.ReturnType, DecodeError, never> {
	return Effect.try({
		try: () => Ox.AbiParameters.decode(params, data),
		catch: (cause) => new DecodeError(cause as Ox.AbiParameters.decode.ErrorType),
	})
}

export class EncodeError extends Error {
	override name = 'EncodeError'
	_tag = 'EncodeError'
	constructor(cause: Ox.AbiParameters.encode.ErrorType) {
		super('Unexpected error encoding ABI parameters with ox', {
			cause,
		})
	}
}

export function encode(
	params: Ox.AbiParameters.AbiParameters,
	values: readonly unknown[] | Record<string, unknown>,
): Effect.Effect<Ox.AbiParameters.encode.ReturnType, EncodeError, never> {
	return Effect.try({
		try: () => Ox.AbiParameters.encode(params, values),
		catch: (cause) => new EncodeError(cause as Ox.AbiParameters.encode.ErrorType),
	})
}

export class EncodePackedError extends Error {
	override name = 'EncodePackedError'
	_tag = 'EncodePackedError'
	constructor(cause: Ox.AbiParameters.encodePacked.ErrorType) {
		super('Unexpected error encoding packed ABI parameters with ox', {
			cause,
		})
	}
}

export function encodePacked(
	params: Ox.AbiParameters.AbiParameters,
	values: readonly unknown[] | Record<string, unknown>,
): Effect.Effect<Ox.AbiParameters.encodePacked.ReturnType, EncodePackedError, never> {
	return Effect.try({
		try: () => Ox.AbiParameters.encodePacked(params, values),
		catch: (cause) => new EncodePackedError(cause as Ox.AbiParameters.encodePacked.ErrorType),
	})
}

export class FormatError extends Error {
	override name = 'FormatError'
	_tag = 'FormatError'
	constructor(cause: Ox.AbiParameters.format.ErrorType) {
		super('Unexpected error formatting ABI parameters with ox', {
			cause,
		})
	}
}

export function format(
	params: Ox.AbiParameters.AbiParameters,
): Effect.Effect<Ox.AbiParameters.format.ReturnType, FormatError, never> {
	return Effect.try({
		try: () => Ox.AbiParameters.format(params),
		catch: (cause) => new FormatError(cause as Ox.AbiParameters.format.ErrorType),
	})
}

export class FromError extends Error {
	override name = 'FromError'
	_tag = 'FromError'
	constructor(cause: Ox.AbiParameters.from.ErrorType) {
		super('Unexpected error parsing ABI parameters with ox', {
			cause,
		})
	}
}

export function from(
	params: Ox.AbiParameters.AbiParameters | string,
): Effect.Effect<Ox.AbiParameters.from.ReturnType, FromError, never> {
	return Effect.try({
		try: () => Ox.AbiParameters.from(params),
		catch: (cause) => new FromError(cause as Ox.AbiParameters.from.ErrorType),
	})
}
