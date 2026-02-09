import {
	decodeUnknownEither,
	Literal,
	optional,
	Record,
	Array as SArray,
	Boolean as SBoolean,
	String as SString,
	Struct,
	Undefined,
	Union,
} from 'effect/Schema'
import { TreeFormatter } from 'effect/ParseResult'
import { pipe } from 'effect'
import { try as effectTry, fail, flatMap, logDebug, succeed, tap } from 'effect/Effect'
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
	foundryProject: optional(Union(SBoolean, SString, Undefined)),
	libs: optional(Union(SArray(SString), Undefined)),
	remappings: optional(Union(Record({ key: SString, value: SString }), Undefined)),
	debug: optional(Union(SBoolean, Undefined)),
	cacheDir: optional(Union(SString, Undefined)),
	jsonAsConst: optional(Union(SString, SArray(SString), Undefined)), // Updated property
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
				onLeft: (left) => fail(new InvalidConfigError(TreeFormatter.formatErrorSync(left), { cause: left })),
				onRight: (right) => succeed(right),
			})
		}),
		tap((validatedConfig) =>
			logDebug(`validatedConfig: Validated config successfully: ${JSON.stringify(validatedConfig)}`),
		),
	)
}
