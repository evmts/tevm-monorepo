import { Effect } from "effect";
import Ox from "ox";
import type { Hex } from "ox/Hex";

// Export types
export type BlsPoint = Ox.BlsPoint.BlsPoint;
export type G1 = Ox.BlsPoint.G1;
export type G2 = Ox.BlsPoint.G2;
export type Fp = Ox.BlsPoint.Fp;
export type Fp2 = Ox.BlsPoint.Fp2;

/**
 * Error class for toBytes function
 */
export class ToBytesError extends Error {
  override name = "ToBytesError";
  _tag = "ToBytesError";
  constructor(cause: unknown) {
    super("Failed to convert BLS point to bytes with ox", {
      cause,
    });
  }
}

/**
 * Converts BLS point to bytes
 * @param point The BLS point to convert
 * @returns An Effect that succeeds with the point as bytes
 */
export function toBytes(
  point: BlsPoint
): Effect.Effect<Uint8Array, ToBytesError, never> {
  return Effect.try({
    try: () => Ox.BlsPoint.toBytes(point),
    catch: (cause) => new ToBytesError(cause),
  });
}

/**
 * Error class for toHex function
 */
export class ToHexError extends Error {
  override name = "ToHexError";
  _tag = "ToHexError";
  constructor(cause: unknown) {
    super("Failed to convert BLS point to hex with ox", {
      cause,
    });
  }
}

/**
 * Converts BLS point to hex
 * @param point The BLS point to convert
 * @returns An Effect that succeeds with the point as hex
 */
export function toHex(
  point: BlsPoint
): Effect.Effect<Hex, ToHexError, never> {
  return Effect.try({
    try: () => Ox.BlsPoint.toHex(point),
    catch: (cause) => new ToHexError(cause),
  });
}

/**
 * Error class for fromBytes function
 */
export class FromBytesError extends Error {
  override name = "FromBytesError";
  _tag = "FromBytesError";
  constructor(cause: unknown) {
    super("Failed to create BLS point from bytes with ox", {
      cause,
    });
  }
}

/**
 * Creates a BLS point from bytes
 * @param bytes The bytes to convert
 * @param type The type of point ('G1' or 'G2')
 * @returns An Effect that succeeds with a BLS point
 */
export function fromBytes(
  bytes: Uint8Array,
  type: 'G1' | 'G2'
): Effect.Effect<BlsPoint, FromBytesError, never> {
  return Effect.try({
    try: () => Ox.BlsPoint.fromBytes(bytes, type),
    catch: (cause) => new FromBytesError(cause),
  });
}

/**
 * Error class for fromHex function
 */
export class FromHexError extends Error {
  override name = "FromHexError";
  _tag = "FromHexError";
  constructor(cause: unknown) {
    super("Failed to create BLS point from hex with ox", {
      cause,
    });
  }
}

/**
 * Creates a BLS point from hex
 * @param hex The hex to convert
 * @param type The type of point ('G1' or 'G2')
 * @returns An Effect that succeeds with a BLS point
 */
export function fromHex(
  hex: Hex,
  type: 'G1' | 'G2'
): Effect.Effect<BlsPoint, FromHexError, never> {
  return Effect.try({
    try: () => Ox.BlsPoint.fromHex(hex, type),
    catch: (cause) => new FromHexError(cause),
  });
}