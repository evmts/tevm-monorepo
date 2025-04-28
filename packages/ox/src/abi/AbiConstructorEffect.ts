import * as AbiConstructor from 'ox/abi/AbiConstructor'
import * as Abi from 'ox/abi'
import * as Hex from 'ox/hex'
import { Effect, Context, Layer } from 'effect'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox AbiConstructor
 */
export type AbiConstructorEffect = AbiConstructor.AbiConstructor

/**
 * Ox AbiConstructor effect service interface
 */
export interface AbiConstructorEffectService {
  /**
   * ABI-decodes the provided constructor input in an Effect
   */
  decodeEffect<const TAbiConstructor extends AbiConstructor.AbiConstructor>(
    abiConstructor: TAbiConstructor,
    options: AbiConstructor.DecodeOptions,
  ): Effect.Effect<AbiConstructor.DecodeReturnType<TAbiConstructor>, BaseErrorEffect<Error | undefined>, never>

  /**
   * ABI-encodes the provided constructor input in an Effect
   */
  encodeEffect<const TAbiConstructor extends AbiConstructor.AbiConstructor>(
    abiConstructor: TAbiConstructor,
    options: AbiConstructor.EncodeOptions<TAbiConstructor>,
  ): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

  /**
   * Formats an AbiConstructor into Human Readable ABI in an Effect
   */
  formatEffect(
    abiConstructor: AbiConstructor.AbiConstructor,
  ): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

  /**
   * Parses a JSON or Human Readable ABI Constructor into typed AbiConstructor in an Effect
   */
  fromEffect(
    abiConstructor: AbiConstructor.AbiConstructor | string | readonly string[],
  ): Effect.Effect<AbiConstructor.AbiConstructor, BaseErrorEffect<Error | undefined>, never>

  /**
   * Extracts an AbiConstructor from an Abi in an Effect
   */
  fromAbiEffect(
    abi: Abi.Abi | readonly unknown[],
  ): Effect.Effect<AbiConstructor.AbiConstructor, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for AbiConstructorEffectService dependency injection
 */
export const AbiConstructorEffectTag = Context.Tag<AbiConstructorEffectService>('@tevm/ox/AbiConstructorEffect')

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
 * Live implementation of AbiConstructorEffectService
 */
export const AbiConstructorEffectLive: AbiConstructorEffectService = {
  decodeEffect: (abiConstructor, options) =>
    catchOxErrors(Effect.try(() => AbiConstructor.decode(abiConstructor, options))),
  
  encodeEffect: (abiConstructor, options) =>
    catchOxErrors(Effect.try(() => AbiConstructor.encode(abiConstructor, options))),
  
  formatEffect: (abiConstructor) =>
    catchOxErrors(Effect.try(() => AbiConstructor.format(abiConstructor))),
  
  fromEffect: (abiConstructor) =>
    catchOxErrors(Effect.try(() => AbiConstructor.from(abiConstructor))),
  
  fromAbiEffect: (abi) =>
    catchOxErrors(Effect.try(() => AbiConstructor.fromAbi(abi))),
}

/**
 * Layer that provides the AbiConstructorEffectService implementation
 */
export const AbiConstructorEffectLayer = Layer.succeed(AbiConstructorEffectTag, AbiConstructorEffectLive)