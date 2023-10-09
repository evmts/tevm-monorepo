import { type ParseErrors } from '@effect/schema/ParseResult'
import { filter, parseEither, string } from '@effect/schema/Schema'
import { formatErrors } from '@effect/schema/TreeFormatter'
import { type Effect } from 'effect'
import { mapError } from 'effect/Effect'
import { runSync } from 'effect/Effect'

import type { NonEmptyReadonlyArray } from 'effect/ReadonlyArray'

/**
 * Type representing a valid Ethereum url
 */
export type Url = string

/**
 * Returns a boolean indicating whether the provided string is a valid Url
 */
export const isUrl = (value: unknown): value is Url => {
	try {
		new URL(value as string)
		return true
	} catch {
		return false
	}
}

/**
 * Effect/schema for {@link Url} type
 * @example
 * const validUrl = '0x1234567890abcdef1234567890abcdef12345678' as const
 * const invalidUrl = 'not an url'
 */
export const SUrl = string.pipe(
	filter(isUrl, {
		message: (url) => `Invalid url value: ${url}
See https://evmts.dev/reference/errors for more information.`,
	}),
)

/**
 * Error thrown when a {@link Url} is invalid
 */
export class InvalidUrlError extends TypeError {
	override name = InvalidUrlError.name
	_tag = InvalidUrlError.name
	constructor({
		url,
		cause,
		message = `Provided value ${url} is not a valid Url`,
		docs = 'https://evmts.dev/reference/errors',
	}: {
		url: string
		cause?: NonEmptyReadonlyArray<ParseErrors>
		message?: string
		docs?: string
	}) {
		super(
			`${InvalidUrlError.name}: ${message}
${docs}`,
			{ cause: cause && formatErrors(cause) },
		)
	}
}

/**
 * Parses an {@link Url} safely into an effect
 * @example
 * ```typescript
 * // $ExpectType Effect<never, InvalidUrlError, Url>
 * const urlEffect = parseUrlSafe('0x1234567890abcdef1234567890abcdef12345678')
 * ````
 */
export const parseUrlSafe = <TUrl extends Url>(
	url: TUrl,
): Effect.Effect<never, InvalidUrlError, TUrl> => {
	return mapError(
		parseEither(SUrl)(url),
		({ errors: cause }) => new InvalidUrlError({ url, cause }),
	) as Effect.Effect<never, InvalidUrlError, TUrl>
}

/**
 * Parses an {@link Url} returning the url or throwing an {@link InvalidUrlError} if invalid
 * @example
 * ```typescript
 * // $ExpectType '0x1234567890abcdef1234567890abcdef12345678' satisfies Url
 * const url = parseUrl('0x1234567890abcdef1234567890abcdef12345678')
 * ````
 */
export const parseUrl = <TUrl extends Url>(url: TUrl): TUrl => {
	return runSync(parseUrlSafe(url))
}
