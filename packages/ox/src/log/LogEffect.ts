import { Context, Effect, Layer } from 'effect'
import * as Address from 'ox/core/Address'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import * as Log from 'ox/execution/log'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox Log
 */
export type LogEffect = Log.Log

/**
 * Ox Log effect service interface
 */
export interface LogEffectService {
	/**
	 * Asserts if the given value is a valid Log in an Effect
	 */
	assertEffect(value: unknown): Effect.Effect<void, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Checks if the given value is a valid Log in an Effect
	 */
	isLogEffect(value: unknown): Effect.Effect<boolean, never, never>

	/**
	 * Validates the given value as a Log in an Effect
	 */
	validateEffect(value: unknown): Effect.Effect<boolean, never, never>

	/**
	 * Parses raw log data from RPC response in an Effect
	 */
	parseEffect(log: Log.LogJson): Effect.Effect<Log.Log, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Formats a Log object into a LogJson object in an Effect
	 */
	formatEffect(log: Log.Log): Effect.Effect<Log.LogJson, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Creates a new Log object from components in an Effect
	 */
	createEffect(options: {
		address: Address.Address
		blockHash?: Hex.Hex | Bytes.Bytes
		blockNumber?: bigint
		data?: Hex.Hex | Bytes.Bytes
		logIndex?: bigint
		removed?: boolean
		topics?: readonly (Hex.Hex | Bytes.Bytes)[]
		transactionHash?: Hex.Hex | Bytes.Bytes
		transactionIndex?: bigint
	}): Effect.Effect<Log.Log, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for LogEffectService dependency injection
 */
export const LogEffectTag = Context.Tag<LogEffectService>('@tevm/ox/LogEffect')

/**
 * Catch Ox errors and convert them to BaseErrorEffect
 */
function catchOxErrors<A>(
	effect: Effect.Effect<A, unknown, never>,
): Effect.Effect<A, BaseErrorEffect<Error | undefined>, never> {
	return Effect.catchAll(effect, (error) => {
		if (error instanceof Error) {
			return Effect.fail(new BaseErrorEffect(error.message, { cause: error }))
		}
		return Effect.fail(new BaseErrorEffect('Unknown error', { cause: error instanceof Error ? error : undefined }))
	})
}

/**
 * Live implementation of LogEffectService
 */
export const LogEffectLive: LogEffectService = {
	assertEffect: (value) =>
		catchOxErrors(
			Effect.try(() => {
				Log.assert(value)
			}),
		),

	isLogEffect: (value) => Effect.succeed(Log.isLog(value)),

	validateEffect: (value) => Effect.succeed(Log.validate(value)),

	parseEffect: (log) => catchOxErrors(Effect.try(() => Log.parse(log))),

	formatEffect: (log) => catchOxErrors(Effect.try(() => Log.format(log))),

	createEffect: (options) => catchOxErrors(Effect.try(() => Log.create(options))),
}

/**
 * Layer that provides the LogEffectService implementation
 */
export const LogEffectLayer = Layer.succeed(LogEffectTag, LogEffectLive)
