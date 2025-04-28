import { Effect } from 'effect'
import Ox from 'ox'

// Export core types
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
 * Parses block overrides from raw RPC response
 *
 * @param value - The block overrides JSON
 * @returns Effect wrapping the parsed block overrides
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
 * Formats block overrides to JSON
 *
 * @param overrides - The block overrides to format
 * @returns Effect wrapping the formatted block overrides JSON
 */
export function format(overrides: BlockOverrides): Effect.Effect<BlockOverridesJson, FormatError, never> {
	return Effect.try({
		try: () => Ox.BlockOverrides.format(overrides),
		catch: (cause) => new FormatError(cause),
	})
}
