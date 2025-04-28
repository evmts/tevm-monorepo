import { Effect } from "effect";
import Ox from "ox";

/**
 * Export type from Ox
 */
export type RpcSchema<T extends Ox.JsonRpcSchema.RpcSchema = Ox.JsonRpcSchema.RpcSchema> = Ox.JsonRpcSchema.RpcSchema<T>;

/**
 * Error class for from function
 */
export class FromError extends Error {
  override name = "FromError";
  _tag = "FromError";
  constructor(cause: unknown) {
    super("Unexpected error creating RPC schema with ox", {
      cause: cause instanceof Error ? cause : undefined,
    });
  }
}

/**
 * Creates a statically typed RPC schema
 */
export function from<T extends Ox.JsonRpcSchema.RpcSchema>(
  schema: T
): Effect.Effect<T, FromError, never> {
  return Effect.try({
    try: () => Ox.JsonRpcSchema.from(schema),
    catch: (cause) => new FromError(cause),
  });
}