import * as AbiEvent from 'ox/core/AbiEvent'
import * as AbiItem from 'ox/core/AbiItem'
import * as Hex from 'ox/core/Hex'
import { Effect, Context, Layer } from 'effect'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox AbiEvent
 */
export type AbiEventEffect = AbiItem.AbiEvent

/**
 * Type for log data structure
 */
export type LogData = {
  data: Hex.Hex
  topics: readonly Hex.Hex[]
}

/**
 * Ox AbiEvent effect service interface
 */
export interface AbiEventEffectService {
  /**
   * Asserts that the provided arguments match the decoded log arguments
   */
  assertArgsEffect(
    abiEvent: AbiEvent.AbiEvent,
    args: unknown,
    matchArgs: unknown,
  ): Effect.Effect<void, BaseErrorEffect<Error | undefined>, never>

  /**
   * ABI-Decodes the provided Log Topics and Data according to the ABI Event's parameter types (inputs)
   */
  decodeEffect(
    abiEvent: AbiEvent.AbiEvent,
    log: LogData,
  ): Effect.Effect<unknown, BaseErrorEffect<Error | undefined>, never>

  /**
   * ABI-encodes the provided event input (inputs) into an array of Event Topics
   */
  encodeEffect(
    abiEvent: AbiEvent.AbiEvent,
    args?: readonly unknown[] | Record<string, unknown>,
  ): Effect.Effect<{ topics: readonly Hex.Hex[] }, BaseErrorEffect<Error | undefined>, never>

  /**
   * Formats an AbiEvent into a Human Readable ABI Error
   */
  formatEffect(
    abiEvent: AbiEvent.AbiEvent,
  ): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

  /**
   * Parses an arbitrary JSON ABI Event or Human Readable ABI Event into a typed AbiEvent
   */
  fromEffect(
    abiEvent: string | readonly string[] | AbiItem.AbiItemish,
    options?: AbiItem.FromOptions,
  ): Effect.Effect<AbiEvent.AbiEvent, BaseErrorEffect<Error | undefined>, never>

  /**
   * Extracts an AbiEvent from an Abi given a name and optional arguments
   */
  fromAbiEffect(
    abi: readonly AbiItem.AbiItemish[],
    name: string | Hex.Hex,
    options?: AbiItem.FromAbiOptions,
  ): Effect.Effect<AbiEvent.AbiEvent, BaseErrorEffect<Error | undefined>, never>

  /**
   * Computes the event selector (hash of event signature) for an AbiEvent
   */
  getSelectorEffect(
    abiItem: string | readonly string[] | AbiItem.AbiItemish,
  ): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for AbiEventEffectService dependency injection
 */
export const AbiEventEffectTag = Context.Tag<AbiEventEffectService>('@tevm/ox/AbiEventEffect')

/**
 * Catch Ox errors and convert them to BaseErrorEffect
 */
function catchOxErrors<A>(effect: Effect.Effect<A, unknown, never>): Effect.Effect<A, BaseErrorEffect<Error | undefined>, never> {
  return Effect.catchAll(effect, (error) => {
    if (error instanceof Error) {
      return Effect.fail(new BaseErrorEffect(error.message, { cause: error }))
    }
    return Effect.fail(new BaseErrorEffect('Unknown error', { cause: error instanceof Error ? error : undefined }))
  })
}

/**
 * Live implementation of AbiEventEffectService
 */
export const AbiEventEffectLive: AbiEventEffectService = {
  assertArgsEffect: (abiEvent, args, matchArgs) =>
    catchOxErrors(Effect.try(() => AbiEvent.assertArgs(abiEvent, args, matchArgs))),

  decodeEffect: (abiEvent, log) =>
    catchOxErrors(Effect.try(() => AbiEvent.decode(abiEvent, log))),

  encodeEffect: (abiEvent, args) =>
    catchOxErrors(Effect.try(() => args ? AbiEvent.encode(abiEvent, args) : AbiEvent.encode(abiEvent))),

  formatEffect: (abiEvent) =>
    catchOxErrors(Effect.try(() => AbiEvent.format(abiEvent))),

  fromEffect: (abiEvent, options) =>
    catchOxErrors(Effect.try(() => AbiEvent.from(abiEvent, options))),

  fromAbiEffect: (abi, name, options) =>
    catchOxErrors(Effect.try(() => AbiEvent.fromAbi(abi, name, options))),

  getSelectorEffect: (abiItem) =>
    catchOxErrors(Effect.try(() => AbiEvent.getSelector(abiItem))),
}

/**
 * Layer that provides the AbiEventEffectService implementation
 */
export const AbiEventEffectLayer = Layer.succeed(AbiEventEffectTag, AbiEventEffectLive)