import { Effect } from "effect";
import Ox from "ox";

// Export types
export type Authorization = Ox.Authorization.Authorization;
export type AuthorizationRpc = Ox.Authorization.AuthorizationRpc;
export type AuthorizationList = Ox.Authorization.AuthorizationList;
export type AuthorizationListRpc = Ox.Authorization.AuthorizationListRpc;
export type AuthorizationListSigned = Ox.Authorization.AuthorizationListSigned;
export type AuthorizationSigned = Ox.Authorization.AuthorizationSigned;
export type AuthorizationTuple = Ox.Authorization.AuthorizationTuple;
export type AuthorizationTupleList = Ox.Authorization.AuthorizationTupleList;

/**
 * Error class for fromTuple function
 */
export class FromTupleError extends Error {
  override name = "FromTupleError";
  _tag = "FromTupleError";
  constructor(cause: unknown) {
    super("Failed to create Authorization from tuple with ox", {
      cause,
    });
  }
}

/**
 * Creates an Authorization from a tuple
 * @param authorization The authorization tuple to convert
 * @returns An Effect that succeeds with an Authorization
 */
export function fromTuple(
  authorization: Ox.Authorization.AuthorizationTuple
): Effect.Effect<Ox.Authorization.Authorization, FromTupleError, never> {
  return Effect.try({
    try: () => Ox.Authorization.fromTuple(authorization),
    catch: (cause) => new FromTupleError(cause),
  });
}

/**
 * Error class for fromTupleList function
 */
export class FromTupleListError extends Error {
  override name = "FromTupleListError";
  _tag = "FromTupleListError";
  constructor(cause: unknown) {
    super("Failed to create AuthorizationList from tuple list with ox", {
      cause,
    });
  }
}

/**
 * Creates an AuthorizationList from a list of tuples
 * @param authorizations The list of authorization tuples to convert
 * @returns An Effect that succeeds with an AuthorizationList
 */
export function fromTupleList(
  authorizations: readonly Ox.Authorization.AuthorizationTuple[]
): Effect.Effect<Ox.Authorization.AuthorizationList, FromTupleListError, never> {
  return Effect.try({
    try: () => Ox.Authorization.fromTupleList(authorizations),
    catch: (cause) => new FromTupleListError(cause),
  });
}

/**
 * Error class for fromRpc function
 */
export class FromRpcError extends Error {
  override name = "FromRpcError";
  _tag = "FromRpcError";
  constructor(cause: unknown) {
    super("Failed to create Authorization from RPC with ox", {
      cause,
    });
  }
}

/**
 * Creates an Authorization from an RPC representation
 * @param authorization The RPC authorization to convert
 * @returns An Effect that succeeds with an Authorization
 */
export function fromRpc(
  authorization: Ox.Authorization.AuthorizationRpc
): Effect.Effect<Ox.Authorization.Authorization, FromRpcError, never> {
  return Effect.try({
    try: () => Ox.Authorization.fromRpc(authorization),
    catch: (cause) => new FromRpcError(cause),
  });
}

/**
 * Error class for fromRpcList function
 */
export class FromRpcListError extends Error {
  override name = "FromRpcListError";
  _tag = "FromRpcListError";
  constructor(cause: unknown) {
    super("Failed to create AuthorizationList from RPC list with ox", {
      cause,
    });
  }
}

/**
 * Creates an AuthorizationList from a list of RPC representations
 * @param authorizations The list of RPC authorizations to convert
 * @returns An Effect that succeeds with an AuthorizationList
 */
export function fromRpcList(
  authorizations: readonly Ox.Authorization.AuthorizationRpc[]
): Effect.Effect<Ox.Authorization.AuthorizationList, FromRpcListError, never> {
  return Effect.try({
    try: () => Ox.Authorization.fromRpcList(authorizations),
    catch: (cause) => new FromRpcListError(cause),
  });
}

/**
 * Error class for hash function
 */
export class HashError extends Error {
  override name = "HashError";
  _tag = "HashError";
  constructor(cause: unknown) {
    super("Failed to hash Authorization with ox", {
      cause,
    });
  }
}

/**
 * Hashes an Authorization for signing
 * @param authorization The authorization to hash
 * @returns An Effect that succeeds with the hash as a Uint8Array
 */
export function hash(
  authorization: Ox.Authorization.Authorization
): Effect.Effect<Uint8Array, HashError, never> {
  return Effect.try({
    try: () => Ox.Authorization.hash(authorization),
    catch: (cause) => new HashError(cause),
  });
}

/**
 * Error class for getSignPayload function
 */
export class GetSignPayloadError extends Error {
  override name = "GetSignPayloadError";
  _tag = "GetSignPayloadError";
  constructor(cause: unknown) {
    super("Failed to get sign payload for Authorization with ox", {
      cause,
    });
  }
}

/**
 * Creates the payload to sign for an Authorization
 * @param authorization The authorization to create a sign payload for
 * @returns An Effect that succeeds with the sign payload as a string
 */
export function getSignPayload(
  authorization: Ox.Authorization.Authorization
): Effect.Effect<string, GetSignPayloadError, never> {
  return Effect.try({
    try: () => Ox.Authorization.getSignPayload(authorization),
    catch: (cause) => new GetSignPayloadError(cause),
  });
}

/**
 * Error class for toRpc function
 */
export class ToRpcError extends Error {
  override name = "ToRpcError";
  _tag = "ToRpcError";
  constructor(cause: unknown) {
    super("Failed to convert Authorization to RPC with ox", {
      cause,
    });
  }
}

/**
 * Converts an Authorization to an RPC representation
 * @param authorization The authorization to convert
 * @returns An Effect that succeeds with an RPC representation
 */
export function toRpc(
  authorization: Ox.Authorization.Authorization
): Effect.Effect<Ox.Authorization.AuthorizationRpc, ToRpcError, never> {
  return Effect.try({
    try: () => Ox.Authorization.toRpc(authorization),
    catch: (cause) => new ToRpcError(cause),
  });
}

/**
 * Error class for toRpcList function
 */
export class ToRpcListError extends Error {
  override name = "ToRpcListError";
  _tag = "ToRpcListError";
  constructor(cause: unknown) {
    super("Failed to convert AuthorizationList to RPC list with ox", {
      cause,
    });
  }
}

/**
 * Converts a list of Authorizations to a list of RPC representations
 * @param authorizations The list of authorizations to convert
 * @returns An Effect that succeeds with a list of RPC representations
 */
export function toRpcList(
  authorizations: Ox.Authorization.AuthorizationList
): Effect.Effect<readonly Ox.Authorization.AuthorizationRpc[], ToRpcListError, never> {
  return Effect.try({
    try: () => Ox.Authorization.toRpcList(authorizations),
    catch: (cause) => new ToRpcListError(cause),
  });
}

/**
 * Error class for toTuple function
 */
export class ToTupleError extends Error {
  override name = "ToTupleError";
  _tag = "ToTupleError";
  constructor(cause: unknown) {
    super("Failed to convert Authorization to tuple with ox", {
      cause,
    });
  }
}

/**
 * Converts an Authorization to a tuple
 * @param authorization The authorization to convert
 * @returns An Effect that succeeds with a tuple representation
 */
export function toTuple(
  authorization: Ox.Authorization.Authorization
): Effect.Effect<Ox.Authorization.AuthorizationTuple, ToTupleError, never> {
  return Effect.try({
    try: () => Ox.Authorization.toTuple(authorization),
    catch: (cause) => new ToTupleError(cause),
  });
}

/**
 * Error class for toTupleList function
 */
export class ToTupleListError extends Error {
  override name = "ToTupleListError";
  _tag = "ToTupleListError";
  constructor(cause: unknown) {
    super("Failed to convert AuthorizationList to tuple list with ox", {
      cause,
    });
  }
}

/**
 * Converts a list of Authorizations to a list of tuples
 * @param authorizations The list of authorizations to convert
 * @returns An Effect that succeeds with a list of tuple representations
 */
export function toTupleList(
  authorizations: Ox.Authorization.AuthorizationList
): Effect.Effect<readonly Ox.Authorization.AuthorizationTuple[], ToTupleListError, never> {
  return Effect.try({
    try: () => Ox.Authorization.toTupleList(authorizations),
    catch: (cause) => new ToTupleListError(cause),
  });
}

/**
 * Error class for from function
 */
export class FromError extends Error {
  override name = "FromError";
  _tag = "FromError";
  constructor(cause: unknown) {
    super("Failed to create Authorization with ox", {
      cause,
    });
  }
}

/**
 * Creates an Authorization from its properties
 * @param authorization The authorization properties
 * @returns An Effect that succeeds with an Authorization
 */
export function from(
  authorization: Partial<Ox.Authorization.Authorization>
): Effect.Effect<Ox.Authorization.Authorization, FromError, never> {
  return Effect.try({
    try: () => Ox.Authorization.from(authorization),
    catch: (cause) => new FromError(cause),
  });
}