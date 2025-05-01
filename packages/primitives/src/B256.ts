import { Schema, Effect } from "effect";
import { Bytes } from "ox";
import { fixedBytesFromBytes, fixedBytesFromHex } from "./FixedBytes.js";
import type { FixedBytes } from "./FixedBytes.js";

/**
 * B256 is a 32-byte fixed array (commonly used for hashes)
 */
export type B256 = FixedBytes<32>;

/**
 * Schema for validating B256 values from Uint8Array
 */
export const B256 = fixedBytesFromBytes(32);

/**
 * Schema for validating B256 values from hex strings
 */
export const B256FromHex = fixedBytesFromHex(32);

/**
 * Converts B256 to a hexadecimal string.
 * @param bytes - The B256 instance.
 */
export const toHex = (bytes: B256): Effect.Effect<string> =>
  Effect.sync(() => Bytes.toHex(bytes));

/**
 * Converts B256 to a BigInt.
 * @param bytes - The B256 instance.
 */
export const toBigInt = (bytes: B256): Effect.Effect<bigint> =>
  Effect.sync(() => Bytes.toBigInt(bytes));

/**
 * Creates a zero-filled B256.
 */
export const zero = (): Effect.Effect<B256, Error> =>
  Effect.gen(function*(_) {
    const bytes = new Uint8Array(32).fill(0);
    return yield* _(Schema.decode(B256)(bytes));
  });

/**
 * Pads B256 from the left with zeroes.
 * @param bytes - The B256 instance.
 * @param size - Desired padded length.
 */
export const padLeft = (
  bytes: B256,
  size: number,
): Effect.Effect<B256, Error> =>
  Effect.gen(function*(_) {
    const padded = Bytes.padLeft(bytes, size);
    return yield* _(Schema.decode(B256)(padded));
  });

/**
 * Slices a B256 instance from `start` to `end`.
 * @param bytes - The B256 instance.
 * @param start - Starting index.
 * @param end - Ending index.
 */
export const slice = (
  bytes: B256,
  start: number,
  end: number,
): Effect.Effect<Uint8Array> =>
  Effect.sync(() => Bytes.slice(bytes, start, end));

/**
 * Concatenates two B256 instances.
 * @param a - First B256 instance.
 * @param b - Second B256 instance.
 */
export const concat = (a: B256, b: B256): Effect.Effect<Uint8Array> =>
  Effect.sync(() => Bytes.concat(a, b));

/**
 * Checks equality of two B256 instances.
 * @param a - First B256 instance.
 * @param b - Second B256 instance.
 */
export const isEqual = (a: B256, b: B256): Effect.Effect<boolean> =>
  Effect.sync(() => Bytes.isEqual(a, b));

/**
 * Checks if the B256 instance is all zeroes.
 * @param bytes - The B256 instance.
 */
export const isZero = (bytes: B256): Effect.Effect<boolean> =>
  Effect.sync(() => {
    for (let i = 0; i < bytes.length; i++) {
      if (bytes[i] !== 0) return false;
    }
    return true;
  });

/**
 * Performs a bitwise AND operation on two B256 instances.
 * @param a - First B256 instance.
 * @param b - Second B256 instance.
 */
export const bitAnd = (a: B256, b: B256): Effect.Effect<B256, Error> =>
  Effect.gen(function*(_) {
    const result = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      const aValue = a[i] || 0;
      const bValue = b[i] || 0;
      result[i] = aValue & bValue;
    }
    return yield* _(Schema.decode(B256)(result));
  });

/**
 * Performs a bitwise OR operation on two B256 instances.
 * @param a - First B256 instance.
 * @param b - Second B256 instance.
 */
export const bitOr = (a: B256, b: B256): Effect.Effect<B256, Error> =>
  Effect.gen(function*(_) {
    const result = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      const aValue = a[i] || 0;
      const bValue = b[i] || 0;
      result[i] = aValue | bValue;
    }
    return yield* _(Schema.decode(B256)(result));
  });

/**
 * Performs a bitwise XOR operation on two B256 instances.
 * @param a - First B256 instance.
 * @param b - Second B256 instance.
 */
export const bitXor = (a: B256, b: B256): Effect.Effect<B256, Error> =>
  Effect.gen(function*(_) {
    const result = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      const aValue = a[i] || 0;
      const bValue = b[i] || 0;
      result[i] = aValue ^ bValue;
    }
    return yield* _(Schema.decode(B256)(result));
  });

/**
 * Creates a random B256 instance.
 */
export const random = (): Effect.Effect<B256, Error> =>
  Effect.gen(function*(_) {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    return yield* _(Schema.decode(B256)(bytes));
  });