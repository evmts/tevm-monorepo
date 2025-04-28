import * as TypedData from 'ox/core/TypedData'
import * as Hex from 'ox/core/Hex'
import type * as abitype from 'abitype'
import { Effect, Context, Layer } from 'effect'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

// Re-export types
export type {
  TypedData as TypedDataType,
  Domain,
  Parameter,
  Definition,
  EIP712DomainDefinition,
  MessageDefinition
} from 'ox/core/TypedData'

/**
 * Interface for TypedDataEffect service
 */
export interface TypedDataEffectService {
  /**
   * Asserts that EIP-712 Typed Data is valid in an Effect
   */
  assertEffect<
    const typedData extends abitype.TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | 'EIP712Domain',
  >(
    value: TypedData.assert.Value<typedData, primaryType>
  ): Effect.Effect<void, BaseErrorEffect<Error | undefined>, never>

  /**
   * Creates EIP-712 Typed Data domainSeparator for the provided domain in an Effect
   */
  domainSeparatorEffect(
    domain: abitype.TypedDataDomain
  ): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

  /**
   * Encodes typed data in EIP-712 format in an Effect
   */
  encodeEffect<
    const typedData extends abitype.TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | 'EIP712Domain',
  >(
    value: TypedData.encode.Value<typedData, primaryType>
  ): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

  /**
   * Encodes EIP-712 Typed Data schema for the provided primaryType in an Effect
   */
  encodeTypeEffect(
    value: TypedData.encodeType.Value
  ): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

  /**
   * Gets EIP-712 Typed Data schema for EIP-721 domain in an Effect
   */
  extractEip712DomainTypesEffect(
    domain: abitype.TypedDataDomain | undefined
  ): Effect.Effect<abitype.TypedDataParameter[], BaseErrorEffect<Error | undefined>, never>

  /**
   * Gets the payload to use for signing typed data in EIP-712 format in an Effect
   */
  getSignPayloadEffect<
    const typedData extends abitype.TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | 'EIP712Domain',
  >(
    value: TypedData.encode.Value<typedData, primaryType>
  ): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

  /**
   * Hashes EIP-712 Typed Data domain in an Effect
   */
  hashDomainEffect(
    value: TypedData.hashDomain.Value
  ): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

  /**
   * Hashes EIP-712 Typed Data struct in an Effect
   */
  hashStructEffect(
    value: TypedData.hashStruct.Value
  ): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

  /**
   * Serializes EIP-712 Typed Data schema into string in an Effect
   */
  serializeEffect<
    const typedData extends abitype.TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | 'EIP712Domain',
  >(
    value: TypedData.serialize.Value<typedData, primaryType>
  ): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

  /**
   * Checks if EIP-712 Typed Data is valid in an Effect
   */
  validateEffect<
    const typedData extends abitype.TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | 'EIP712Domain',
  >(
    value: TypedData.assert.Value<typedData, primaryType>
  ): Effect.Effect<boolean, never, never>
}

/**
 * Tag for TypedDataEffectService dependency injection
 */
export const TypedDataEffectTag = Context.Tag<TypedDataEffectService>('@tevm/ox/TypedDataEffect')

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
 * Live implementation of TypedDataEffectService
 */
export const TypedDataEffectLive: TypedDataEffectService = {
  assertEffect: (value) =>
    catchOxErrors(Effect.try(() => TypedData.assert(value))),

  domainSeparatorEffect: (domain) =>
    catchOxErrors(Effect.try(() => TypedData.domainSeparator(domain))),

  encodeEffect: (value) =>
    catchOxErrors(Effect.try(() => TypedData.encode(value))),

  encodeTypeEffect: (value) =>
    catchOxErrors(Effect.try(() => TypedData.encodeType(value))),

  extractEip712DomainTypesEffect: (domain) =>
    catchOxErrors(Effect.try(() => TypedData.extractEip712DomainTypes(domain))),

  getSignPayloadEffect: (value) =>
    catchOxErrors(Effect.try(() => TypedData.getSignPayload(value))),

  hashDomainEffect: (value) =>
    catchOxErrors(Effect.try(() => TypedData.hashDomain(value))),

  hashStructEffect: (value) =>
    catchOxErrors(Effect.try(() => TypedData.hashStruct(value))),

  serializeEffect: (value) =>
    catchOxErrors(Effect.try(() => TypedData.serialize(value))),

  validateEffect: (value) =>
    Effect.succeed(TypedData.validate(value))
}

/**
 * Layer that provides the TypedDataEffectService implementation
 */
export const TypedDataEffectLayer = Layer.succeed(TypedDataEffectTag, TypedDataEffectLive)