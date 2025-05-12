import { Effect, Schema } from "effect";
import { Bytes } from "ox";
import { fixedBytesFromBytes, fixedBytesFromHex } from "./FixedBytes.js";
import type { FixedBytes } from "./FixedBytes.js";

/**
 * B160 is a 20-byte fixed array
 */
export type B160 = FixedBytes<20>;

/**
 * Schema for validating B160 values from Uint8Array
 */
export const B160 = fixedBytesFromBytes(20);

/**
 * Schema for validating B160 values from hex strings
 */
export const B160FromHex = fixedBytesFromHex(20);

/**
 * Converts B160 to a hexadecimal string.
 * @param bytes - The B160 instance.
 */
export const toHex = (bytes: B160): Effect.Effect<string> =>
  Effect.sync(() => Bytes.toHex(bytes));

/**
 * Converts B160 to a BigInt.
 * @param bytes - The B160 instance.
 */
export const toBigInt = (bytes: B160): Effect.Effect<bigint> =>
  Effect.sync(() => Bytes.toBigInt(bytes));

/**
 * Creates a zero-filled B160.
 */
export const zero = (): Effect.Effect<B160, Error> =>
  Effect.gen(function* (_) {
    const bytes = new Uint8Array(20).fill(0);
    return yield* _(Schema.decode(B160)(bytes));
  });

/**
 * Pads B160 from the left with zeroes.
 * @param bytes - The B160 instance.
 * @param size - Desired padded length.
 */
export const padLeft = (
  bytes: B160,
  size: number,
): Effect.Effect<B160, Error> =>
  Effect.gen(function* (_) {
    const padded = Bytes.padLeft(bytes, size);
    return yield* _(Schema.decode(B160)(padded));
  });

/**
 * Slices a B160 instance from `start` to `end`.
 * @param bytes - The B160 instance.
 * @param start - Starting index.
 * @param end - Ending index.
 */
export const slice = (
  bytes: B160,
  start: number,
  end: number,
): Effect.Effect<Uint8Array> =>
  Effect.sync(() => Bytes.slice(bytes, start, end));

/**
 * Concatenates two B160 instances.
 * @param a - First B160 instance.
 * @param b - Second B160 instance.
 */
export const concat = (a: B160, b: B160): Effect.Effect<Uint8Array> =>
  Effect.sync(() => Bytes.concat(a, b));

/**
 * Checks equality of two B160 instances.
 * @param a - First B160 instance.
 * @param b - Second B160 instance.
 */
export const isEqual = (a: B160, b: B160): Effect.Effect<boolean> =>
  Effect.sync(() => Bytes.isEqual(a, b));

/**
 * Checks if the B160 instance is all zeroes.
 * @param bytes - The B160 instance.
 */
export const isZero = (bytes: B160): Effect.Effect<boolean> =>
  Effect.sync(() => {
    for (let i = 0; i < bytes.length; i++) {
      if (bytes[i] !== 0) return false;
    }
    return true;
  });

/**
 * Performs a bitwise AND operation on two B160 instances.
 * @param a - First B160 instance.
 * @param b - Second B160 instance.
 */
export const bitAnd = (a: B160, b: B160): Effect.Effect<B160, Error> =>
  Effect.gen(function* (_) {
    const result = new Uint8Array(20);
    for (let i = 0; i < 20; i++) {
      const aValue = a[i] || 0;
      const bValue = b[i] || 0;
      result[i] = aValue & bValue;
    }
    return yield* _(Schema.decode(B160)(result));
  });

/**
 * Performs a bitwise OR operation on two B160 instances.
 * @param a - First B160 instance.
 * @param b - Second B160 instance.
 */
export const bitOr = (a: B160, b: B160): Effect.Effect<B160, Error> =>
  Effect.gen(function* (_) {
    const result = new Uint8Array(20);
    for (let i = 0; i < 20; i++) {
      const aValue = a[i] || 0;
      const bValue = b[i] || 0;
      result[i] = aValue | bValue;
    }
    return yield* _(Schema.decode(B160)(result));
  });

/**
 * Performs a bitwise XOR operation on two B160 instances.
 * @param a - First B160 instance.
 * @param b - Second B160 instance.
 */
export const bitXor = (a: B160, b: B160): Effect.Effect<B160, Error> =>
  Effect.gen(function* (_) {
    const result = new Uint8Array(20);
    for (let i = 0; i < 20; i++) {
      const aValue = a[i] || 0;
      const bValue = b[i] || 0;
      result[i] = aValue ^ bValue;
    }
    return yield* _(Schema.decode(B160)(result));
  });

/**
 * Creates a random B160 instance.
 */
export const random = (): Effect.Effect<B160, Error> =>
  Effect.gen(function* (_) {
    const bytes = crypto.getRandomValues(new Uint8Array(20));
    return yield* _(Schema.decode(B160)(bytes));
  });
