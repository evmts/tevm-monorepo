import {
	array,
	boolean,
	literal,
	optional,
	parseEither,
	record,
	string,
	struct,
	undefined as SUndefined,
	union,
} from '@effect/schema/Schema'
import { pipe } from 'effect'
import { catchTag, fail, logDebug, tap, try as effectTry } from 'effect/Effect'
import { flatMap } from 'effect/Effect'

/**
 * Error thrown when the user provided config factory throws
 * @internal
 */
export class ConfigFnThrowError extends Error {
	/**
	 * @type {'ConfigFnThrowError'}
	 */
	_tag = 'ConfigFnThrowError'
	/**
	 * @param {object} options
	 * @param {unknown} options.cause
	 */
	constructor(options) {
		const message =
			typeof options.cause === 'string'
				? options.cause
				: options.cause instanceof Error
				? options.cause.message
				: ''
		super(`Provided config factory threw an error: ${message}`, options)
	}
}
/**
 * TypeError thrown when the user provided config factory is incorrectly typed
 * @internal
 */
export class InvalidConfigError extends TypeError {
	/**
	 * @type {'InvalidConfigError'}
	 */
	_tag = 'InvalidConfigError'
	/**
	 * @param {object} [options]
	 * @param {unknown} [options.cause]
	 */
	constructor(options) {
		super('Invalid EVMts CompilerConfig detected', options)
	}
}

/**
 * @typedef {ConfigFnThrowError | InvalidConfigError} ValidateUserConfigError
 * @internal
 */

/**
 * schema for the user provided config factory
 * @internal
 */
const SCompilerConfig = struct({
	name: optional(union(literal('@evmts/ts-plugin'), SUndefined)),
	foundryProject: optional(union(boolean, string, SUndefined)),
	libs: optional(union(array(string), SUndefined)),
	remappings: optional(union(record(string, string), SUndefined)),
	debug: optional(union(boolean, SUndefined)),
})

/**
 * Validates a config factory is a valid config else throws
 * @param {() => import("../types.js").CompilerConfig} untrustedConfigFactory
 * @returns {import('effect/Effect').Effect<never, ValidateUserConfigError, import("../types.js").CompilerConfig>}
 * @throws {ConfigFnThrowError} when the user provided config factory throws
 * @throws {InvalidConfigError} when the user provided config factory is incorrectly typed
 * @internal
 */
export const validateUserConfig = (untrustedConfigFactory) => {
	return pipe(
		effectTry({
			try: untrustedConfigFactory,
			catch: (cause) =>
				new ConfigFnThrowError({
					cause,
				}),
		}),
		flatMap((unvalidatedConfig) =>
			parseEither(SCompilerConfig)(unvalidatedConfig, {
				errors: 'all',
				onExcessProperty: 'error',
			}),
		),
		catchTag('ParseError', (cause) => fail(new InvalidConfigError({ cause }))),
		tap((validatedConfig) =>
			logDebug(
				`validatedConfig: Validated config successfully: ${JSON.stringify(
					validatedConfig,
				)}`,
			),
		),
	)
}
