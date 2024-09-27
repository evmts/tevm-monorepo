import {
	Undefined,
	Array,
	Boolean,
	Literal,
	optional,
	Record,
	String,
	Struct,
	Union,
	decodeUnknownEither,
} from '@effect/schema/Schema'
import { formatErrorSync } from '@effect/schema/TreeFormatter'
import { pipe } from 'effect'
import { try as effectTry, fail, logDebug, succeed, tap } from 'effect/Effect'
import { flatMap } from 'effect/Effect'
import { match } from 'effect/Either'

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
			typeof options.cause === 'string' ? options.cause : options.cause instanceof Error ? options.cause.message : ''
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
	constructor(message = 'Invalid Tevm CompilerConfig detected', options) {
		super(message, options)
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
const SCompilerConfig = Struct({
	name: optional(Union(Literal('@tevm/ts-plugin'), Undefined)),
	foundryProject: optional(Union(Boolean, String, Undefined)),
	libs: optional(Union(Array(String), Undefined)),
	remappings: optional(Union(Record({ key: String, value: String }), Undefined)),
	debug: optional(Union(Boolean, Undefined)),
	cacheDir: optional(Union(String, Undefined)),
})

/**
 * Validates a config factory is a valid config else throws
 * @param {() => import("../types.js").CompilerConfig} untrustedConfigFactory
 * @returns {import('effect/Effect').Effect<import("../types.js").CompilerConfig, ValidateUserConfigError, never>}
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
		flatMap((unvalidatedConfig) => {
			const res = decodeUnknownEither(SCompilerConfig)(unvalidatedConfig, {
				errors: 'all',
				onExcessProperty: 'error',
			})
			return match(res, {
				onLeft: (left) => fail(new InvalidConfigError(formatErrorSync(left), { cause: left })),
				onRight: (right) => succeed(right)
			})
		}
		),
		tap((validatedConfig) =>
			logDebug(`validatedConfig: Validated config successfully: ${JSON.stringify(validatedConfig)}`),
		),
	)
}
