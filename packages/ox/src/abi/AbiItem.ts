import { Effect } from 'effect'
import Ox from 'ox'

export type AbiItem = Ox.AbiItem.AbiItem

export class FormatError extends Error {
	override name = 'FormatError'
	_tag = 'FormatError'
	constructor(cause: Ox.AbiItem.format.ErrorType) {
		super('Unexpected error formatting ABI item with ox', {
			cause,
		})
	}
}

export function format(item: Ox.AbiItem.AbiItem): Effect.Effect<Ox.AbiItem.format.ReturnType, FormatError, never> {
	return Effect.try({
		try: () => Ox.AbiItem.format(item),
		catch: (cause) => new FormatError(cause as Ox.AbiItem.format.ErrorType),
	})
}

export class FromError extends Error {
	override name = 'FromError'
	_tag = 'FromError'
	constructor(cause: Ox.AbiItem.from.ErrorType) {
		super('Unexpected error parsing ABI item with ox', {
			cause,
		})
	}
}

export function from(
	itemOrSignature: Ox.AbiItem.AbiItem | string,
): Effect.Effect<Ox.AbiItem.from.ReturnType, FromError, never> {
	return Effect.try({
		try: () => Ox.AbiItem.from(itemOrSignature),
		catch: (cause) => new FromError(cause as Ox.AbiItem.from.ErrorType),
	})
}

export class FromAbiError extends Error {
	override name = 'FromAbiError'
	_tag = 'FromAbiError'
	constructor(cause: Ox.AbiItem.fromAbi.ErrorType) {
		super('Unexpected error extracting ABI item from ABI with ox', {
			cause,
		})
	}
}

export function fromAbi(
	abi: Ox.Abi.Abi | readonly string[],
	nameOrSignatureOrIndex?: string | number,
): Effect.Effect<Ox.AbiItem.fromAbi.ReturnType, FromAbiError, never> {
	return Effect.try({
		try: () => Ox.AbiItem.fromAbi(abi, nameOrSignatureOrIndex),
		catch: (cause) => new FromAbiError(cause as Ox.AbiItem.fromAbi.ErrorType),
	})
}

export class GetSelectorError extends Error {
	override name = 'GetSelectorError'
	_tag = 'GetSelectorError'
	constructor(cause: Ox.AbiItem.getSelector.ErrorType) {
		super('Unexpected error getting ABI item selector with ox', {
			cause,
		})
	}
}

export function getSelector(
	item: Ox.AbiItem.AbiItem,
): Effect.Effect<Ox.AbiItem.getSelector.ReturnType, GetSelectorError, never> {
	return Effect.try({
		try: () => Ox.AbiItem.getSelector(item),
		catch: (cause) => new GetSelectorError(cause as Ox.AbiItem.getSelector.ErrorType),
	})
}

export class GetSignatureError extends Error {
	override name = 'GetSignatureError'
	_tag = 'GetSignatureError'
	constructor(cause: Ox.AbiItem.getSignature.ErrorType) {
		super('Unexpected error getting ABI item signature with ox', {
			cause,
		})
	}
}

export function getSignature(
	item: Ox.AbiItem.AbiItem,
): Effect.Effect<Ox.AbiItem.getSignature.ReturnType, GetSignatureError, never> {
	return Effect.try({
		try: () => Ox.AbiItem.getSignature(item),
		catch: (cause) => new GetSignatureError(cause as Ox.AbiItem.getSignature.ErrorType),
	})
}

export class GetSignatureHashError extends Error {
	override name = 'GetSignatureHashError'
	_tag = 'GetSignatureHashError'
	constructor(cause: Ox.AbiItem.getSignatureHash.ErrorType) {
		super('Unexpected error getting ABI item signature hash with ox', {
			cause,
		})
	}
}

export function getSignatureHash(
	item: Ox.AbiItem.AbiItem,
): Effect.Effect<Ox.AbiItem.getSignatureHash.ReturnType, GetSignatureHashError, never> {
	return Effect.try({
		try: () => Ox.AbiItem.getSignatureHash(item),
		catch: (cause) => new GetSignatureHashError(cause as Ox.AbiItem.getSignatureHash.ErrorType),
	})
}
