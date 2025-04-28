import { Effect } from "effect";
import Ox from "ox";

export type AbiFunction = Ox.AbiFunction.AbiFunction;

export class DecodeDataError extends Error {
  override name = "DecodeDataError";
  _tag = "DecodeDataError";
  constructor(cause: Ox.AbiFunction.decodeData.ErrorType) {
    super("Unexpected error decoding ABI function data with ox", {
      cause,
    });
  }
}

export function decodeData(
  functionItem: Ox.AbiFunction.AbiFunction,
  data: Ox.Hex | Uint8Array
): Effect.Effect<Ox.AbiFunction.decodeData.ReturnType, DecodeDataError, never> {
  return Effect.try({
    try: () => Ox.AbiFunction.decodeData(functionItem, data),
    catch: (cause) => new DecodeDataError(cause as Ox.AbiFunction.decodeData.ErrorType),
  });
}

export class DecodeResultError extends Error {
  override name = "DecodeResultError";
  _tag = "DecodeResultError";
  constructor(cause: Ox.AbiFunction.decodeResult.ErrorType) {
    super("Unexpected error decoding ABI function result with ox", {
      cause,
    });
  }
}

export function decodeResult(
  functionItem: Ox.AbiFunction.AbiFunction,
  data: Ox.Hex | Uint8Array
): Effect.Effect<Ox.AbiFunction.decodeResult.ReturnType, DecodeResultError, never> {
  return Effect.try({
    try: () => Ox.AbiFunction.decodeResult(functionItem, data),
    catch: (cause) => new DecodeResultError(cause as Ox.AbiFunction.decodeResult.ErrorType),
  });
}

export class EncodeDataError extends Error {
  override name = "EncodeDataError";
  _tag = "EncodeDataError";
  constructor(cause: Ox.AbiFunction.encodeData.ErrorType) {
    super("Unexpected error encoding ABI function data with ox", {
      cause,
    });
  }
}

export function encodeData(
  functionItem: Ox.AbiFunction.AbiFunction,
  args: readonly unknown[] | Record<string, unknown>
): Effect.Effect<Ox.AbiFunction.encodeData.ReturnType, EncodeDataError, never> {
  return Effect.try({
    try: () => Ox.AbiFunction.encodeData(functionItem, args),
    catch: (cause) => new EncodeDataError(cause as Ox.AbiFunction.encodeData.ErrorType),
  });
}

export class EncodeResultError extends Error {
  override name = "EncodeResultError";
  _tag = "EncodeResultError";
  constructor(cause: Ox.AbiFunction.encodeResult.ErrorType) {
    super("Unexpected error encoding ABI function result with ox", {
      cause,
    });
  }
}

export function encodeResult(
  functionItem: Ox.AbiFunction.AbiFunction,
  values: readonly unknown[] | Record<string, unknown>
): Effect.Effect<Ox.AbiFunction.encodeResult.ReturnType, EncodeResultError, never> {
  return Effect.try({
    try: () => Ox.AbiFunction.encodeResult(functionItem, values),
    catch: (cause) => new EncodeResultError(cause as Ox.AbiFunction.encodeResult.ErrorType),
  });
}

export class FormatError extends Error {
  override name = "FormatError";
  _tag = "FormatError";
  constructor(cause: Ox.AbiFunction.format.ErrorType) {
    super("Unexpected error formatting ABI function with ox", {
      cause,
    });
  }
}

export function format(
  functionItem: Ox.AbiFunction.AbiFunction
): Effect.Effect<Ox.AbiFunction.format.ReturnType, FormatError, never> {
  return Effect.try({
    try: () => Ox.AbiFunction.format(functionItem),
    catch: (cause) => new FormatError(cause as Ox.AbiFunction.format.ErrorType),
  });
}

export class FromError extends Error {
  override name = "FromError";
  _tag = "FromError";
  constructor(cause: Ox.AbiFunction.from.ErrorType) {
    super("Unexpected error parsing ABI function with ox", {
      cause,
    });
  }
}

export function from(
  functionItem: Ox.AbiItem.AbiItem | string
): Effect.Effect<Ox.AbiFunction.from.ReturnType, FromError, never> {
  return Effect.try({
    try: () => Ox.AbiFunction.from(functionItem),
    catch: (cause) => new FromError(cause as Ox.AbiFunction.from.ErrorType),
  });
}

export class FromAbiError extends Error {
  override name = "FromAbiError";
  _tag = "FromAbiError";
  constructor(cause: Ox.AbiFunction.fromAbi.ErrorType) {
    super("Unexpected error extracting ABI function from ABI with ox", {
      cause,
    });
  }
}

export function fromAbi(
  abi: Ox.Abi.Abi | readonly string[],
  nameOrSignatureOrIndex?: string | number
): Effect.Effect<Ox.AbiFunction.fromAbi.ReturnType, FromAbiError, never> {
  return Effect.try({
    try: () => Ox.AbiFunction.fromAbi(abi, nameOrSignatureOrIndex),
    catch: (cause) => new FromAbiError(cause as Ox.AbiFunction.fromAbi.ErrorType),
  });
}

export class GetSelectorError extends Error {
  override name = "GetSelectorError";
  _tag = "GetSelectorError";
  constructor(cause: Ox.AbiFunction.getSelector.ErrorType) {
    super("Unexpected error getting ABI function selector with ox", {
      cause,
    });
  }
}

export function getSelector(
  functionItem: Ox.AbiFunction.AbiFunction
): Effect.Effect<Ox.AbiFunction.getSelector.ReturnType, GetSelectorError, never> {
  return Effect.try({
    try: () => Ox.AbiFunction.getSelector(functionItem),
    catch: (cause) => new GetSelectorError(cause as Ox.AbiFunction.getSelector.ErrorType),
  });
}
