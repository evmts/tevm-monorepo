import { existsSync, readFileSync } from 'node:fs'
import * as path from 'node:path'
import {
	decodeUnknownEither,
	optional,
	Record,
	Array as SArray,
	String as SString,
	Struct,
} from '@effect/schema/Schema'
import { parseJson } from '@tevm/effect'
import { catchTag, fail, flatMap, logDebug, succeed, tap, try as tryEffect } from 'effect/Effect'
import { match } from 'effect/Either'

/**
 * Expected shape of tsconfig.json or jsconfig.json
 * @typedef {{ compilerOptions: { plugins?: ReadonlyArray<{ name: string }> | undefined, baseUrl?: string | undefined, paths?: Record<string, ReadonlyArray<string>> | undefined } }} TsConfig
 * @internal
 */

export class FailedToReadConfigError extends Error {
	/**
	 * @type {'FailedToReadConfigError'}
	 */
	_tag = 'FailedToReadConfigError'
	/**
	 * @param {string} configFilePath
	 * @param {object} [options]
	 * @param {unknown} [options.cause]
	 */
	constructor(configFilePath, options) {
		super(`Failed to find ${configFilePath}/tsconfig.json`, options)
	}
}

/**
 * TypeError thrown when the user provided config factory is incorrectly typed
 * @internal
 */
export class InvalidTsConfigError extends TypeError {
	/**
	 * @type {'InvalidConfigError'}
	 */
	_tag = 'InvalidConfigError'
	/**
	 * @param {object} [options]
	 * @param {unknown} [options.cause]
	 */
	constructor(options) {
		super('Invalid tsconfig.json detected', options)
	}
}

/**
 * schema for tsconfig shape
 * @internal
 */
const STsConfig = Struct({
	compilerOptions: Struct({
		baseUrl: optional(SString),
		plugins: optional(
			SArray(
				Struct({
					name: SString,
				}),
			),
		),
		paths: optional(Record({ key: SString, value: SArray(SString) })),
	}),
})

/**
 * @typedef {import("@tevm/effect").ParseJsonError | FailedToReadConfigError | InvalidTsConfigError} LoadTsConfigError
 * @internal
 */

/**
 * Syncronously loads an Tevm config from the given path
 * @param {string} configFilePath
 * @returns {import("effect/Effect").Effect<TsConfig, LoadTsConfigError, never>} the contents of the tsconfig.json file
 * @internal
 */
export const loadTsConfig = (configFilePath) => {
	const tsConfigPath = path.join(configFilePath, 'tsconfig.json')
	const jsConfigPath = path.join(configFilePath, 'jsconfig.json')

	return /** @type {import("effect/Effect").Effect<TsConfig, LoadTsConfigError, never>} */ (
		tryEffect({
			try: () => (existsSync(jsConfigPath) ? readFileSync(jsConfigPath, 'utf8') : readFileSync(tsConfigPath, 'utf8')),
			catch: (cause) => new FailedToReadConfigError(configFilePath, { cause }),
		}).pipe(
			// parse the json
			flatMap(parseJson),
			// parse the tsconfig without plugins
			flatMap((unvalidatedConfig) => {
				const res = decodeUnknownEither(STsConfig)(unvalidatedConfig, {
					errors: 'all',
					onExcessProperty: 'ignore',
				})
				return match(res, {
					onLeft: (left) => fail(new InvalidTsConfigError({ cause: left })),
					onRight: (right) => succeed(right),
				})
			}),
			flatMap((unvalidatedConfig) => {
				const res = decodeUnknownEither(STsConfig)(unvalidatedConfig, {
					errors: 'all',
					onExcessProperty: 'ignore',
				})
				return match(res, {
					onLeft: (left) => fail(new InvalidTsConfigError({ cause: left })),
					onRight: (right) => succeed(right),
				})
			}),
			catchTag('ParseJsonError', (cause) => fail(new InvalidTsConfigError({ cause }))),
			tap((tsConfig) => logDebug(`loading tsconfig from ${configFilePath}: ${JSON.stringify(tsConfig)}`)),
		)
	)
}
