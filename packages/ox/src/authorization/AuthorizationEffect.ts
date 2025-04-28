import { Context, Effect, Layer } from 'effect'
import * as Authorization from 'ox/authorization'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox Authorization types
 */
export type {
	Authorization,
	AuthorizationRpc,
	AuthorizationList,
	AuthorizationListRpc,
	AuthorizationListSigned,
	AuthorizationSigned,
	AuthorizationTuple,
	AuthorizationTupleList,
} from 'ox/authorization'

/**
 * Ox Authorization effect service interface
 */
export interface AuthorizationEffectService {
	/**
	 * Creates an Authorization from a tuple
	 */
	fromTupleEffect(
		authorization: Authorization.AuthorizationTuple,
	): Effect.Effect<Authorization.Authorization, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Creates an Authorization from a list of tuples
	 */
	fromTupleListEffect(
		authorizations: readonly Authorization.AuthorizationTuple[],
	): Effect.Effect<Authorization.AuthorizationList, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Creates an Authorization from an RPC representation
	 */
	fromRpcEffect(
		authorization: Authorization.AuthorizationRpc,
	): Effect.Effect<Authorization.Authorization, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Creates an Authorization from a list of RPC representations
	 */
	fromRpcListEffect(
		authorizations: readonly Authorization.AuthorizationRpc[],
	): Effect.Effect<Authorization.AuthorizationList, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Hashes an Authorization for signing
	 */
	hashEffect(
		authorization: Authorization.Authorization,
	): Effect.Effect<Uint8Array, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Creates the payload to sign for an Authorization
	 */
	getSignPayloadEffect(
		authorization: Authorization.Authorization,
	): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts an Authorization to an RPC representation
	 */
	toRpcEffect(
		authorization: Authorization.Authorization,
	): Effect.Effect<Authorization.AuthorizationRpc, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts a list of Authorizations to a list of RPC representations
	 */
	toRpcListEffect(
		authorizations: Authorization.AuthorizationList,
	): Effect.Effect<readonly Authorization.AuthorizationRpc[], BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts an Authorization to a tuple
	 */
	toTupleEffect(
		authorization: Authorization.Authorization,
	): Effect.Effect<Authorization.AuthorizationTuple, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts a list of Authorizations to a list of tuples
	 */
	toTupleListEffect(
		authorizations: Authorization.AuthorizationList,
	): Effect.Effect<readonly Authorization.AuthorizationTuple[], BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for AuthorizationEffectService dependency injection
 */
export const AuthorizationEffectTag = Context.Tag<AuthorizationEffectService>('@tevm/ox/AuthorizationEffect')

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
 * Live implementation of AuthorizationEffectService
 */
export const AuthorizationEffectLive: AuthorizationEffectService = {
	fromTupleEffect: (authorization) => catchOxErrors(Effect.try(() => Authorization.fromTuple(authorization))),

	fromTupleListEffect: (authorizations) => catchOxErrors(Effect.try(() => Authorization.fromTupleList(authorizations))),

	fromRpcEffect: (authorization) => catchOxErrors(Effect.try(() => Authorization.fromRpc(authorization))),

	fromRpcListEffect: (authorizations) => catchOxErrors(Effect.try(() => Authorization.fromRpcList(authorizations))),

	hashEffect: (authorization) => catchOxErrors(Effect.try(() => Authorization.hash(authorization))),

	getSignPayloadEffect: (authorization) => catchOxErrors(Effect.try(() => Authorization.getSignPayload(authorization))),

	toRpcEffect: (authorization) => catchOxErrors(Effect.try(() => Authorization.toRpc(authorization))),

	toRpcListEffect: (authorizations) => catchOxErrors(Effect.try(() => Authorization.toRpcList(authorizations))),

	toTupleEffect: (authorization) => catchOxErrors(Effect.try(() => Authorization.toTuple(authorization))),

	toTupleListEffect: (authorizations) => catchOxErrors(Effect.try(() => Authorization.toTupleList(authorizations))),
}

/**
 * Layer that provides the AuthorizationEffectService implementation
 */
export const AuthorizationEffectLayer = Layer.succeed(AuthorizationEffectTag, AuthorizationEffectLive)
