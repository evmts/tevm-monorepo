import { Effect } from "effect";
import Ox from "ox";

export type Abi = Ox.Abi.Abi;

export class FormatError extends Error {
  override name = "FormatError";
  _tag = "FormatError";
  constructor(cause: Ox.Abi.format.ErrorType) {
    super("Unexpected error formatting ABI with ox", {
      cause,
    });
  }
}

export function format(
  abi: Ox.Abi.Abi | readonly string[],
): Effect.Effect<Ox.Abi.format.ReturnType, FormatError, never> {
  return Effect.try({
    try: () => Ox.Abi.format(abi),
    catch: (cause) => new FormatError(cause as Ox.Abi.format.ErrorType),
  });
}

export class FromError extends Error {
  override name = "FromError";
  _tag = "FromError";
  constructor(cause: Ox.Abi.from.ErrorType) {
    super("Unexpected error parsing ABI with ox", {
      cause,
    });
  }
}

export function from(
  abi: Ox.Abi.Abi | readonly string[],
): Effect.Effect<Ox.Abi.from.ReturnType, FromError, never> {
  return Effect.try({
    try: () => Ox.Abi.from(abi),
    catch: (cause) => new FromError(cause as Ox.Abi.from.ErrorType),
  });
}
