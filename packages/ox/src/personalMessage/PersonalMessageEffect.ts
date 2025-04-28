import * as PersonalMessage from 'ox/core/PersonalMessage'
import { Effect, Context, Layer } from 'effect'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'
import type { Bytes } from 'ox/core/Bytes'
import type { Hex } from 'ox/core/Hex'

/**
 * Interface for PersonalMessageEffect service
 */
export interface PersonalMessageEffectService {
  /**
   * Encodes a personal sign message in ERC-191 format
   */
  encodeEffect(
    data: Hex | Bytes
  ): Effect.Effect<Hex, BaseErrorEffect<Error | undefined>, never>

  /**
   * Gets the payload to use for signing an ERC-191 formatted personal message
   */
  getSignPayloadEffect(
    data: Hex | Bytes
  ): Effect.Effect<Hex, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for PersonalMessageEffectService dependency injection
 */
export const PersonalMessageEffectTag = Context.Tag<PersonalMessageEffectService>('@tevm/ox/PersonalMessageEffect')

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
 * Live implementation of PersonalMessageEffectService
 */
export const PersonalMessageEffectLive: PersonalMessageEffectService = {
  encodeEffect: (data) =>
    catchOxErrors(Effect.try(() => PersonalMessage.encode(data))),

  getSignPayloadEffect: (data) =>
    catchOxErrors(Effect.try(() => PersonalMessage.getSignPayload(data)))
}

/**
 * Layer that provides the PersonalMessageEffectService implementation
 */
export const PersonalMessageEffectLayer = Layer.succeed(PersonalMessageEffectTag, PersonalMessageEffectLive)