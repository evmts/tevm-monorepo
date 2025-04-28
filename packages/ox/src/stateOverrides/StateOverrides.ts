import { Effect } from 'effect'
import Ox from 'ox'

/**
 * Export the core types
 */
export type StateOverrides<bigintType = bigint> = Ox.StateOverrides.StateOverrides<bigintType>
export type Rpc = Ox.StateOverrides.Rpc
export type AccountOverrides<bigintType = bigint> = Ox.StateOverrides.AccountOverrides<bigintType>
export type RpcAccountOverrides = Ox.StateOverrides.RpcAccountOverrides
export type AccountStorage = Ox.StateOverrides.AccountStorage

/**
 * Error class for fromRpc function
 */
export class FromRpcError extends Error {
  override name = "FromRpcError"
  _tag = "FromRpcError"
  constructor(cause: unknown) {
    super("Unexpected error converting RPC state overrides to StateOverrides with ox", {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Converts RPC state overrides to StateOverrides
 */
export function fromRpc(
  rpcStateOverrides: Rpc
): Effect.Effect<StateOverrides, FromRpcError, never> {
  return Effect.try({
    try: () => Ox.StateOverrides.fromRpc(rpcStateOverrides),
    catch: (cause) => new FromRpcError(cause),
  })
}

/**
 * Error class for toRpc function
 */
export class ToRpcError extends Error {
  override name = "ToRpcError"
  _tag = "ToRpcError"
  constructor(cause: unknown) {
    super("Unexpected error converting StateOverrides to RPC state overrides with ox", {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Converts StateOverrides to RPC state overrides
 */
export function toRpc(
  stateOverrides: StateOverrides
): Effect.Effect<Rpc, ToRpcError, never> {
  return Effect.try({
    try: () => Ox.StateOverrides.toRpc(stateOverrides),
    catch: (cause) => new ToRpcError(cause),
  })
}