import { Effect } from "effect";
import Ox from "ox";

export type AbiConstructor = Ox.AbiConstructor.AbiConstructor;

export class DecodeError extends Error {
  override name = "DecodeError";
  _tag = "DecodeError";
  constructor(cause: Ox.AbiConstructor.decode.ErrorType) {
    super("Unexpected error decoding ABI constructor with ox", {
      cause,
    });
  }
}

export function decode(
  constructorItem: Ox.AbiConstructor.AbiConstructor,
  data: Ox.Hex | Uint8Array
): Effect.Effect<Ox.AbiConstructor.decode.ReturnType, DecodeError, never> {
  return Effect.try({
    try: () => Ox.AbiConstructor.decode(constructorItem, data),
    catch: (cause) => new DecodeError(cause as Ox.AbiConstructor.decode.ErrorType),
  });
}

export class EncodeError extends Error {
  override name = "EncodeError";
  _tag = "EncodeError";
  constructor(cause: Ox.AbiConstructor.encode.ErrorType) {
    super("Unexpected error encoding ABI constructor with ox", {
      cause,
    });
  }
}

export function encode(
  constructorItem: Ox.AbiConstructor.AbiConstructor,
  args: readonly unknown[]
): Effect.Effect<Ox.AbiConstructor.encode.ReturnType, EncodeError, never> {
  return Effect.try({
    try: () => Ox.AbiConstructor.encode(constructorItem, args),
    catch: (cause) => new EncodeError(cause as Ox.AbiConstructor.encode.ErrorType),
  });
}

export class FormatError extends Error {
  override name = "FormatError";
  _tag = "FormatError";
  constructor(cause: Ox.AbiConstructor.format.ErrorType) {
    super("Unexpected error formatting ABI constructor with ox", {
      cause,
    });
  }
}

export function format(
  constructorItem: Ox.AbiConstructor.AbiConstructor
): Effect.Effect<Ox.AbiConstructor.format.ReturnType, FormatError, never> {
  return Effect.try({
    try: () => Ox.AbiConstructor.format(constructorItem),
    catch: (cause) => new FormatError(cause as Ox.AbiConstructor.format.ErrorType),
  });
}

export class FromError extends Error {
  override name = "FromError";
  _tag = "FromError";
  constructor(cause: Ox.AbiConstructor.from.ErrorType) {
    super("Unexpected error parsing ABI constructor with ox", {
      cause,
    });
  }
}

export function from(
  constructorItem: Ox.AbiItem.AbiItem | string
): Effect.Effect<Ox.AbiConstructor.from.ReturnType, FromError, never> {
  return Effect.try({
    try: () => Ox.AbiConstructor.from(constructorItem),
    catch: (cause) => new FromError(cause as Ox.AbiConstructor.from.ErrorType),
  });
}

export class FromAbiError extends Error {
  override name = "FromAbiError";
  _tag = "FromAbiError";
  constructor(cause: Ox.AbiConstructor.fromAbi.ErrorType) {
    super("Unexpected error extracting ABI constructor from ABI with ox", {
      cause,
    });
  }
}

export function fromAbi(
  abi: Ox.Abi.Abi | readonly string[]
): Effect.Effect<Ox.AbiConstructor.fromAbi.ReturnType, FromAbiError, never> {
  return Effect.try({
    try: () => Ox.AbiConstructor.fromAbi(abi),
    catch: (cause) => new FromAbiError(cause as Ox.AbiConstructor.fromAbi.ErrorType),
  });
}
