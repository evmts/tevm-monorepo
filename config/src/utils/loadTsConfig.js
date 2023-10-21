import { parseJson } from './parseJson.js'
import {
	array,
	optional,
	parseEither,
	string,
	struct,
} from '@effect/schema/Schema'
import { Effect } from 'effect'
import { catchTag, fail, flatMap } from 'effect/Effect'
import { existsSync, readFileSync } from 'fs'
import * as path from 'path'

/**
 * Expected shape of tsconfig.json or jsconfig.json
 * @typedef {{ compilerOptions?: { plugins: ReadonlyArray<{ name: string }>, baseUrl?: string } }} TsConfig
 */

export class FailedToReadConfigError extends Error {
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
 */
export class InvalidTsConfigError extends TypeError {
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
 */
const STsConfig = struct({
	compilerOptions: struct({
		baseUrl: optional(string),
		plugins: array(
			struct({
				name: string,
			}),
		),
	}),
})

/**
 * @typedef {import("./parseJson.js").ParseJsonError | FailedToReadConfigError | InvalidTsConfigError} LoadTsConfigError
 */

/**
 * Asyncronously loads an EVMts config from the given path
 * @param {string} configFilePath
 * @returns {import("effect/Effect").Effect<never, LoadTsConfigError, TsConfig>} the contents of the tsconfig.json file
 */
export const loadTsConfig = (configFilePath) => {
	const tsConfigPath = path.join(configFilePath, 'tsconfig.json')
	const jsConfigPath = path.join(configFilePath, 'jsconfig.json')

	return Effect.try({
		try: () =>
			existsSync(jsConfigPath)
				? readFileSync(jsConfigPath, 'utf8')
				: readFileSync(tsConfigPath, 'utf8'),
		catch: (cause) => new FailedToReadConfigError(configFilePath, { cause }),
	}).pipe(
		flatMap(parseJson),
		flatMap((unvalidatedConfig) =>
			parseEither(STsConfig)(unvalidatedConfig, {
				errors: 'all',
				onExcessProperty: 'ignore',
			}),
		),
		catchTag('ParseError', (cause) =>
			fail(new InvalidTsConfigError({ cause })),
		),
	)
}
