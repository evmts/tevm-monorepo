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
import { Effect, pipe } from 'effect'
import { catchTag, fail } from 'effect/Effect'
import { flatMap } from 'effect/Effect'

/**
 * Error thrown when the user provided config factory throws
 */
export class ConfigFnThrowError extends Error {
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
 */
export class InvalidConfigError extends TypeError {
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
 */

/**
 * schema for the user provided config factory
 */
const SCompilerConfig = struct({
	name: optional(union(literal('@evmts/ts-plugin'), SUndefined)),
	foundryProject: optional(union(boolean, string, SUndefined)),
	libs: optional(union(array(string), SUndefined)),
	remappings: optional(union(record(string, string), SUndefined)),
})

/**
 * Validates a config factory is a valid config else throws
 * @param {() => import("../types.js").CompilerConfig} untrustedConfigFactory
 * @returns {import('effect/Effect').Effect<never, ValidateUserConfigError, import("../types.js").CompilerConfig>}
 * @throws {ConfigFnThrowError} when the user provided config factory throws
 * @throws {InvalidConfigError} when the user provided config factory is incorrectly typed
 */
export const validateUserConfig = (untrustedConfigFactory) => {
	return pipe(
		Effect.try({
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
	)
}
