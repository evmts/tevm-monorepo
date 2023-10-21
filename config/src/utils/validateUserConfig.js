import {
	array,
	boolean,
	literal,
	optional,
	parseEither,
	record,
	string,
	struct,
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
	name: optional(literal('@evmts/ts-plugin')),
	foundryProject: optional(union(boolean, string)),
	libs: optional(array(string)),
	remappings: optional(record(string, string)),
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
				new ConfigFnThrowError('Provided config factory threw an error', {
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
