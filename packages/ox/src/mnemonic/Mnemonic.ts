import { Effect } from 'effect'
import Ox from 'ox'

// Export main types and constants
export type HdKey = Ox.Mnemonic.HdKey
export const english = Ox.Mnemonic.english

// Error classes for Mnemonic functions
export class RandomError extends Error {
	override name = 'RandomError'
	_tag = 'RandomError'
	constructor(cause: unknown) {
		super('Error generating random mnemonic with ox', { cause })
	}
}

export class ToSeedError extends Error {
	override name = 'ToSeedError'
	_tag = 'ToSeedError'
	constructor(cause: unknown) {
		super('Error converting mnemonic to seed with ox', { cause })
	}
}

export class ValidateError extends Error {
	override name = 'ValidateError'
	_tag = 'ValidateError'
	constructor(cause: unknown) {
		super('Error validating mnemonic with ox', { cause })
	}
}

export class ToHdKeyError extends Error {
	override name = 'ToHdKeyError'
	_tag = 'ToHdKeyError'
	constructor(cause: unknown) {
		super('Error converting mnemonic to HD key with ox', { cause })
	}
}

export class ToPrivateKeyError extends Error {
	override name = 'ToPrivateKeyError'
	_tag = 'ToPrivateKeyError'
	constructor(cause: unknown) {
		super('Error converting mnemonic to private key with ox', { cause })
	}
}

/**
 * Generates a random mnemonic phrase
 */
export function random(
	wordlist: string[],
	options?: Ox.Mnemonic.random.Options,
): Effect.Effect<string, RandomError, never> {
	return Effect.try({
		try: () => Ox.Mnemonic.random(wordlist, options),
		catch: (cause) => new RandomError(cause),
	})
}

/**
 * Converts a mnemonic to a master seed
 */
export function toSeed<as extends 'Bytes' | 'Hex' = 'Bytes'>(
	mnemonic: string,
	options?: Ox.Mnemonic.toSeed.Options<as>,
): Effect.Effect<Ox.Mnemonic.toSeed.ReturnType<as>, ToSeedError, never> {
	return Effect.try({
		try: () => Ox.Mnemonic.toSeed(mnemonic, options),
		catch: (cause) => new ToSeedError(cause),
	})
}

/**
 * Validates a mnemonic with a wordlist
 */
export function validate(mnemonic: string, wordlist: string[]): Effect.Effect<boolean, ValidateError, never> {
	return Effect.try({
		try: () => Ox.Mnemonic.validate(mnemonic, wordlist),
		catch: (cause) => new ValidateError(cause),
	})
}

/**
 * Converts a mnemonic to a HD Key
 */
export function toHdKey(
	mnemonic: string,
	options?: Ox.Mnemonic.toHdKey.Options,
): Effect.Effect<HdKey, ToHdKeyError, never> {
	return Effect.try({
		try: () => Ox.Mnemonic.toHdKey(mnemonic, options),
		catch: (cause) => new ToHdKeyError(cause),
	})
}

/**
 * Converts a mnemonic to a private key
 */
export function toPrivateKey<as extends 'Bytes' | 'Hex' = 'Bytes'>(
	mnemonic: string,
	options?: Ox.Mnemonic.toPrivateKey.Options<as>,
): Effect.Effect<Ox.Mnemonic.toPrivateKey.ReturnType<as>, ToPrivateKeyError, never> {
	return Effect.try({
		try: () => Ox.Mnemonic.toPrivateKey(mnemonic, options),
		catch: (cause) => new ToPrivateKeyError(cause),
	})
}
