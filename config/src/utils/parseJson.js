import { try as tryEffect } from 'effect/Effect'
import { parse } from 'jsonc-parser'

export class ParseJsonError extends Error {
	_tag = 'ParseJsonError'
	/**
	 * @param {object} [options]
	 * @param {unknown} [options.cause]
	 */
	constructor(options = {}) {
		super('Failed to parse tsconfig.json', options)
	}
}

/**
 * Parses a json string
 * @param {string} jsonStr
 * @returns {import("effect/Effect").Effect<never, ParseJsonError, {compilerOptions?: {plugins: Array<{name: string}>}}>}
 * @throws {ParseJsonError} when the tsconfig.json file is not valid json
 * @example
 * ```ts
 * const jsonEffect = parseJson('{ "compilerOptions": { "plugins": [{ "name": "@evmts/ts-plugin" }] } }')
 * ````
 */
export const parseJson = (jsonStr) => {
	return tryEffect({
		try: () => {
			const errors = /** @type {import("jsonc-parser").ParseError[]}*/ ([])
			const res = parse(jsonStr, errors, {
				disallowComments: false,
				allowTrailingComma: true,
				allowEmptyContent: false,
			})
			if (errors.length > 0) {
				throw new AggregateError(errors)
			}
			return res
		},
		catch: (cause) => new ParseJsonError({ cause }),
	})
}
