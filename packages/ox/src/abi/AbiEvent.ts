import { Effect } from "effect";
import Ox from "ox";

export type AbiEvent = Ox.AbiEvent.AbiEvent;

export class AssertArgsError extends Error {
  override name = "AssertArgsError";
  _tag = "AssertArgsError";
  constructor(cause: Ox.AbiEvent.assertArgs.ErrorType) {
    super("Unexpected error asserting ABI event args with ox", {
      cause,
    });
  }
}

export function assertArgs(
  eventItem: Ox.AbiEvent.AbiEvent,
  args: readonly unknown[]
): Effect.Effect<Ox.AbiEvent.assertArgs.ReturnType, AssertArgsError, never> {
  return Effect.try({
    try: () => Ox.AbiEvent.assertArgs(eventItem, args),
    catch: (cause) => new AssertArgsError(cause as Ox.AbiEvent.assertArgs.ErrorType),
  });
}

export class DecodeError extends Error {
  override name = "DecodeError";
  _tag = "DecodeError";
  constructor(cause: Ox.AbiEvent.decode.ErrorType) {
    super("Unexpected error decoding ABI event with ox", {
      cause,
    });
  }
}

export function decode(
  eventItem: Ox.AbiEvent.AbiEvent,
  data: Ox.Hex | Uint8Array,
  topics: ReadonlyArray<Ox.Hex | Uint8Array>,
): Effect.Effect<Ox.AbiEvent.decode.ReturnType, DecodeError, never> {
  return Effect.try({
    try: () => Ox.AbiEvent.decode(eventItem, data, topics),
    catch: (cause) => new DecodeError(cause as Ox.AbiEvent.decode.ErrorType),
  });
}

export class EncodeError extends Error {
  override name = "EncodeError";
  _tag = "EncodeError";
  constructor(cause: Ox.AbiEvent.encode.ErrorType) {
    super("Unexpected error encoding ABI event with ox", {
      cause,
    });
  }
}

export function encode(
  eventItem: Ox.AbiEvent.AbiEvent,
  args: readonly unknown[] | Record<string, unknown>
): Effect.Effect<Ox.AbiEvent.encode.ReturnType, EncodeError, never> {
  return Effect.try({
    try: () => Ox.AbiEvent.encode(eventItem, args),
    catch: (cause) => new EncodeError(cause as Ox.AbiEvent.encode.ErrorType),
  });
}

export class FormatError extends Error {
  override name = "FormatError";
  _tag = "FormatError";
  constructor(cause: Ox.AbiEvent.format.ErrorType) {
    super("Unexpected error formatting ABI event with ox", {
      cause,
    });
  }
}

export function format(
  eventItem: Ox.AbiEvent.AbiEvent
): Effect.Effect<Ox.AbiEvent.format.ReturnType, FormatError, never> {
  return Effect.try({
    try: () => Ox.AbiEvent.format(eventItem),
    catch: (cause) => new FormatError(cause as Ox.AbiEvent.format.ErrorType),
  });
}

export class FromError extends Error {
  override name = "FromError";
  _tag = "FromError";
  constructor(cause: Ox.AbiEvent.from.ErrorType) {
    super("Unexpected error parsing ABI event with ox", {
      cause,
    });
  }
}

export function from(
  eventItem: Ox.AbiItem.AbiItem | string
): Effect.Effect<Ox.AbiEvent.from.ReturnType, FromError, never> {
  return Effect.try({
    try: () => Ox.AbiEvent.from(eventItem),
    catch: (cause) => new FromError(cause as Ox.AbiEvent.from.ErrorType),
  });
}

export class FromAbiError extends Error {
  override name = "FromAbiError";
  _tag = "FromAbiError";
  constructor(cause: Ox.AbiEvent.fromAbi.ErrorType) {
    super("Unexpected error extracting ABI event from ABI with ox", {
      cause,
    });
  }
}

export function fromAbi(
  abi: Ox.Abi.Abi | readonly string[],
  nameOrSignatureOrIndex?: string | number
): Effect.Effect<Ox.AbiEvent.fromAbi.ReturnType, FromAbiError, never> {
  return Effect.try({
    try: () => Ox.AbiEvent.fromAbi(abi, nameOrSignatureOrIndex),
    catch: (cause) => new FromAbiError(cause as Ox.AbiEvent.fromAbi.ErrorType),
  });
}

export class GetSelectorError extends Error {
  override name = "GetSelectorError";
  _tag = "GetSelectorError";
  constructor(cause: Ox.AbiEvent.getSelector.ErrorType) {
    super("Unexpected error getting ABI event selector with ox", {
      cause,
    });
  }
}

export function getSelector(
  eventItem: Ox.AbiEvent.AbiEvent
): Effect.Effect<Ox.AbiEvent.getSelector.ReturnType, GetSelectorError, never> {
  return Effect.try({
    try: () => Ox.AbiEvent.getSelector(eventItem),
    catch: (cause) => new GetSelectorError(cause as Ox.AbiEvent.getSelector.ErrorType),
  });
}
