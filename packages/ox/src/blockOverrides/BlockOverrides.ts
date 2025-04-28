import { Effect } from 'effect'
import Ox from 'ox'

/**
 * Export the core types
 */
export type BlockOverrides = Ox.BlockOverrides.BlockOverrides
export type BlockOverridesJson = Ox.BlockOverrides.BlockOverridesJson

/**
 * Error class for parse function
 */
export class ParseError extends Error {
	override name = 'ParseError'
	_tag = 'ParseError'
	constructor(cause: unknown) {
		super('Unexpected error parsing block overrides with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Parse block overrides from JSON
 */
export function parse(value: BlockOverridesJson): Effect.Effect<BlockOverrides, ParseError, never> {
	return Effect.try({
		try: () => Ox.BlockOverrides.parse(value),
		catch: (cause) => new ParseError(cause),
	})
}

/**
 * Error class for format function
 */
export class FormatError extends Error {
	override name = 'FormatError'
	_tag = 'FormatError'
	constructor(cause: unknown) {
		super('Unexpected error formatting block overrides with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Format block overrides to JSON
 */
export function format(overrides: BlockOverrides): Effect.Effect<BlockOverridesJson, FormatError, never> {
	return Effect.try({
		try: () => Ox.BlockOverrides.format(overrides),
		catch: (cause) => new FormatError(cause),
	})
}
