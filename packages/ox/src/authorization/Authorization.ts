import { Effect } from "effect";
import Ox from "ox";

// Export types from Ox Authorization module
export type {
  Authorization,
  AuthorizationRpc,
  AuthorizationList,
  AuthorizationListRpc,
  AuthorizationListSigned,
  AuthorizationSigned,
  AuthorizationTuple,
  AuthorizationTupleList,
} from "ox/authorization";

// Error classes for each function

export class FromTupleError extends Error {
  override name = "FromTupleError";
  _tag = "FromTupleError";
  constructor(cause: Ox.Authorization.fromTuple.ErrorType) {
    super("Unexpected error creating Authorization from tuple with ox", {
      cause,
    });
  }
}

export class FromTupleListError extends Error {
  override name = "FromTupleListError";
  _tag = "FromTupleListError";
  constructor(cause: Ox.Authorization.fromTupleList.ErrorType) {
    super("Unexpected error creating Authorization list from tuple list with ox", {
      cause,
    });
  }
}

export class FromRpcError extends Error {
  override name = "FromRpcError";
  _tag = "FromRpcError";
  constructor(cause: Ox.Authorization.fromRpc.ErrorType) {
    super("Unexpected error creating Authorization from RPC with ox", {
      cause,
    });
  }
}

export class FromRpcListError extends Error {
  override name = "FromRpcListError";
  _tag = "FromRpcListError";
  constructor(cause: Ox.Authorization.fromRpcList.ErrorType) {
    super("Unexpected error creating Authorization list from RPC list with ox", {
      cause,
    });
  }
}

export class HashError extends Error {
  override name = "HashError";
  _tag = "HashError";
  constructor(cause: Ox.Authorization.hash.ErrorType) {
    super("Unexpected error hashing Authorization with ox", {
      cause,
    });
  }
}

export class GetSignPayloadError extends Error {
  override name = "GetSignPayloadError";
  _tag = "GetSignPayloadError";
  constructor(cause: Ox.Authorization.getSignPayload.ErrorType) {
    super("Unexpected error getting sign payload for Authorization with ox", {
      cause,
    });
  }
}

export class ToRpcError extends Error {
  override name = "ToRpcError";
  _tag = "ToRpcError";
  constructor(cause: Ox.Authorization.toRpc.ErrorType) {
    super("Unexpected error converting Authorization to RPC format with ox", {
      cause,
    });
  }
}

export class ToRpcListError extends Error {
  override name = "ToRpcListError";
  _tag = "ToRpcListError";
  constructor(cause: Ox.Authorization.toRpcList.ErrorType) {
    super("Unexpected error converting Authorization list to RPC format with ox", {
      cause,
    });
  }
}

export class ToTupleError extends Error {
  override name = "ToTupleError";
  _tag = "ToTupleError";
  constructor(cause: Ox.Authorization.toTuple.ErrorType) {
    super("Unexpected error converting Authorization to tuple with ox", {
      cause,
    });
  }
}

export class ToTupleListError extends Error {
  override name = "ToTupleListError";
  _tag = "ToTupleListError";
  constructor(cause: Ox.Authorization.toTupleList.ErrorType) {
    super("Unexpected error converting Authorization list to tuple list with ox", {
      cause,
    });
  }
}

// Function implementations

/**
 * Creates an Authorization from a tuple
 */
export function fromTuple(
  authorization: Ox.Authorization.AuthorizationTuple,
): Effect.Effect<Ox.Authorization.Authorization, FromTupleError, never> {
  return Effect.try({
    try: () => Ox.Authorization.fromTuple(authorization),
    catch: (cause) => new FromTupleError(cause as Ox.Authorization.fromTuple.ErrorType),
  });
}

/**
 * Creates an Authorization from a list of tuples
 */
export function fromTupleList(
  authorizations: readonly Ox.Authorization.AuthorizationTuple[],
): Effect.Effect<Ox.Authorization.AuthorizationList, FromTupleListError, never> {
  return Effect.try({
    try: () => Ox.Authorization.fromTupleList(authorizations),
    catch: (cause) => new FromTupleListError(cause as Ox.Authorization.fromTupleList.ErrorType),
  });
}

/**
 * Creates an Authorization from an RPC representation
 */
export function fromRpc(
  authorization: Ox.Authorization.AuthorizationRpc,
): Effect.Effect<Ox.Authorization.Authorization, FromRpcError, never> {
  return Effect.try({
    try: () => Ox.Authorization.fromRpc(authorization),
    catch: (cause) => new FromRpcError(cause as Ox.Authorization.fromRpc.ErrorType),
  });
}

/**
 * Creates an Authorization from a list of RPC representations
 */
export function fromRpcList(
  authorizations: readonly Ox.Authorization.AuthorizationRpc[],
): Effect.Effect<Ox.Authorization.AuthorizationList, FromRpcListError, never> {
  return Effect.try({
    try: () => Ox.Authorization.fromRpcList(authorizations),
    catch: (cause) => new FromRpcListError(cause as Ox.Authorization.fromRpcList.ErrorType),
  });
}

/**
 * Hashes an Authorization for signing
 */
export function hash(
  authorization: Ox.Authorization.Authorization,
): Effect.Effect<Uint8Array, HashError, never> {
  return Effect.try({
    try: () => Ox.Authorization.hash(authorization),
    catch: (cause) => new HashError(cause as Ox.Authorization.hash.ErrorType),
  });
}

/**
 * Creates the payload to sign for an Authorization
 */
export function getSignPayload(
  authorization: Ox.Authorization.Authorization,
): Effect.Effect<string, GetSignPayloadError, never> {
  return Effect.try({
    try: () => Ox.Authorization.getSignPayload(authorization),
    catch: (cause) => new GetSignPayloadError(cause as Ox.Authorization.getSignPayload.ErrorType),
  });
}

/**
 * Converts an Authorization to an RPC representation
 */
export function toRpc(
  authorization: Ox.Authorization.Authorization,
): Effect.Effect<Ox.Authorization.AuthorizationRpc, ToRpcError, never> {
  return Effect.try({
    try: () => Ox.Authorization.toRpc(authorization),
    catch: (cause) => new ToRpcError(cause as Ox.Authorization.toRpc.ErrorType),
  });
}

/**
 * Converts a list of Authorizations to a list of RPC representations
 */
export function toRpcList(
  authorizations: Ox.Authorization.AuthorizationList,
): Effect.Effect<readonly Ox.Authorization.AuthorizationRpc[], ToRpcListError, never> {
  return Effect.try({
    try: () => Ox.Authorization.toRpcList(authorizations),
    catch: (cause) => new ToRpcListError(cause as Ox.Authorization.toRpcList.ErrorType),
  });
}

/**
 * Converts an Authorization to a tuple
 */
export function toTuple(
  authorization: Ox.Authorization.Authorization,
): Effect.Effect<Ox.Authorization.AuthorizationTuple, ToTupleError, never> {
  return Effect.try({
    try: () => Ox.Authorization.toTuple(authorization),
    catch: (cause) => new ToTupleError(cause as Ox.Authorization.toTuple.ErrorType),
  });
}

/**
 * Converts a list of Authorizations to a list of tuples
 */
export function toTupleList(
  authorizations: Ox.Authorization.AuthorizationList,
): Effect.Effect<readonly Ox.Authorization.AuthorizationTuple[], ToTupleListError, never> {
  return Effect.try({
    try: () => Ox.Authorization.toTupleList(authorizations),
    catch: (cause) => new ToTupleListError(cause as Ox.Authorization.toTupleList.ErrorType),
  });
}