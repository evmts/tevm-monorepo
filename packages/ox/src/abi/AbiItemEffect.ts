import * as AbiItem from 'ox/abi/AbiItem'
import { Effect, Context, Layer } from 'effect'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox AbiItem types
 */
export type {
  AbiItem as AbiItemType,
  Component,
  Items,
  Param,
  ParseFunction,
  Signature
} from 'ox/abi/AbiItem'

/**
 * Ox AbiItem effect service interface
 */
export interface AbiItemEffectService {
  /**
   * Parses a string as an ABI component in an Effect
   */
  parseComponentEffect(type: string): Effect.Effect<AbiItem.Component, BaseErrorEffect<Error | undefined>, never>

  /**
   * Parses a string as an ABI component with name in an Effect
   */
  parseParamEffect(param: string): Effect.Effect<AbiItem.Param, BaseErrorEffect<Error | undefined>, never>

  /**
   * Formats a component to a string in an Effect
   */
  formatComponentEffect(param: AbiItem.Component): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

  /**
   * Formats a param to a string in an Effect
   */
  formatParamEffect(param: AbiItem.Param): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

  /**
   * Returns a function that parses the ABI item signature in an Effect
   */
  parseAbiItemEffect<type extends string>(
    type: type
  ): Effect.Effect<AbiItem.ParseFunction<type>, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for AbiItemEffectService dependency injection
 */
export const AbiItemEffectTag = Context.Tag<AbiItemEffectService>('@tevm/ox/AbiItemEffect')

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
 * Live implementation of AbiItemEffectService
 */
export const AbiItemEffectLive: AbiItemEffectService = {
  parseComponentEffect: (type) =>
    catchOxErrors(Effect.try(() => AbiItem.parseComponent(type))),

  parseParamEffect: (param) =>
    catchOxErrors(Effect.try(() => AbiItem.parseParam(param))),

  formatComponentEffect: (param) =>
    catchOxErrors(Effect.try(() => AbiItem.formatComponent(param))),

  formatParamEffect: (param) =>
    catchOxErrors(Effect.try(() => AbiItem.formatParam(param))),

  parseAbiItemEffect: (type) =>
    catchOxErrors(Effect.try(() => AbiItem.parseAbiItem(type)))
}

/**
 * Layer that provides the AbiItemEffectService implementation
 */
export const AbiItemEffectLayer = Layer.succeed(AbiItemEffectTag, AbiItemEffectLive)