import {
	array,
	optional,
	parseEither,
	record,
	string,
	struct,
} from '@effect/schema/Schema'
import { parseJson } from '@evmts/effect'
import {
	catchTag,
	fail,
	flatMap,
	logDebug,
	tap,
	try as tryEffect,
} from 'effect/Effect'
import { existsSync, readFileSync } from 'fs'
import * as path from 'path'

/**
 * Expected shape of tsconfig.json or jsconfig.json
 * @typedef {{ compilerOptions?: { plugins: ReadonlyArray<{ name: string }>, baseUrl?: string, paths?: Record<string, ReadonlyArray<string>> } }} TsConfig
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
const STsConfig = struct({
	compilerOptions: struct({
		baseUrl: optional(string),
		plugins: array(
			struct({
				name: string,
			}),
		),
		paths: optional(record(string, array(string))),
	}),
})

/**
 * @typedef {import("@evmts/effect").ParseJsonError | FailedToReadConfigError | InvalidTsConfigError} LoadTsConfigError
 * @internal
 */

/**
 * Asyncronously loads an EVMts config from the given path
 * @param {string} configFilePath
 * @returns {import("effect/Effect").Effect<never, LoadTsConfigError, TsConfig>} the contents of the tsconfig.json file
 * @internal
 */
export const loadTsConfig = (configFilePath) => {
	const tsConfigPath = path.join(configFilePath, 'tsconfig.json')
	const jsConfigPath = path.join(configFilePath, 'jsconfig.json')

	return tryEffect({
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
		tap((tsConfig) =>
			logDebug(
				`loading tsconfig from ${configFilePath}: ${JSON.stringify(tsConfig)}`,
			),
		),
	)
}
