/**
 * @module Url Schema
 * Types and validators for SUrl.
 * Represents a valid URL format.
 */

import { filter, parseEither, string } from '@effect/schema/Schema'
import { formatErrors } from '@effect/schema/TreeFormatter'
import { Effect } from 'effect'
import { mapError, runSync } from 'effect/Effect'

/**
 * Type representing a valid URL.
 * @typedef {string} Url
 * @example
 * ```javascript
 * import { Url } from '@evmts/schemas';
 * const url = 'https://evmts.dev'; // satisfies Url
 * ```
 */

/**
 * Type guard that returns true if the provided string is a valid URL.
 * @param {string} value
 * @returns {boolean}
 * @example
 * ```javascript
 * import { isUrl } from '@evmts/schemas';
 * isUrl('https://evmts.dev');  // true
 * isUrl('not a url'); // false
 * ````
 */
export const isUrl = (value) => {
	try {
		new URL(value)
		return true
	} catch {
		return false
	}
}

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the Url type.
 * @type {import('@effect/schema/Schema').Schema<string, Url>}
 * @example
 * ```javascript
 * import { Schema } from '@effect/schema/Schema';
 * export const SUrl: Schema<string, Url>;
 * ```
 */
export const SUrl = string.pipe(
	filter(isUrl, {
		message: (url) => `Invalid URL value: ${url}
See https://evmts.dev/reference/errors for more information.`,
	}),
)
/**
 * Error thrown when an invalid Url is provided.
 */
export class InvalidUrlError extends TypeError {
	/**
	 * @constructor
	 * @param {Object} options - The options for the error.
	 * @param {unknown} [options.url] - The invalid URL value.
	 * @param {string} [options.message] - The error message.
	 * @param {string} [options.docs] - The documentation URL.
	 * @param {import('effect/ReadonlyArray').NonEmptyReadonlyArray<import('@effect/schema/ParseResult').ParseErrors>} [options.cause] - The cause of the error.
	 */
	constructor({
		url,
		message = `Provided value ${url} is not a valid URL`,
		docs = 'https://evmts.dev/reference/errors',
		cause,
	} = {}) {
		super(`${InvalidUrlError.name}: ${message}\n${docs}`)
		this.cause = cause && formatErrors(cause)
	}
}

/**
 * Safely parses a Url into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template {Url} TUrl
 * @param {TUrl} url
 * @returns {Effect.Effect<never, InvalidUrlError, TUrl>}
 * @example
 * ```javascript
 * import { parseUrlSafe } from '@evmts/schemas';
 * const parsedUrlEffect = parseUrlSafe('https://evmts.dev');
 * ```
 */
export const parseUrlSafe = (url) => {
	const out =
		/** @type {Effect.Effect<never, InvalidUrlError, TUrl>} */
		(
			parseEither(SUrl)(url).pipe(
				mapError(({ errors: cause }) => new InvalidUrlError({ url, cause })),
			)
		)
	return out
}

/**
 * Parses a Url and returns the value if no errors.
 * @template {Url} TUrl
 * @param {TUrl} url
 * @returns {TUrl}
 * @example
 * ```javascript
 * import { parseUrl } from '@evmts/schemas';
 * const parsedUrl = parseUrl('https://evmts.dev');
 * ```
 */
export const parseUrl = (url) => {
	return runSync(parseUrlSafe(url))
}
