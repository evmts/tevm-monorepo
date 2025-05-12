import { Brand, Effect, Schema } from "effect";
import { Bytes } from "ox";

/**
 * Branded type representing a Uint8Array of fixed length N.
 */
export type FixedBytes<N extends number> = Uint8Array &
  Brand.Brand<`FixedBytes${N}`>;

export const fixedBytes = <N extends number>(
  length: N,
): Schema.Schema<FixedBytes<N>, readonly number[]> =>
  Schema.Uint8Array.pipe(
    Schema.filter((bytes) => bytes.length === length, {
      message: () => `Expected Uint8Array of length ${length}`,
    }),
    Schema.brand(`FixedBytes${length}`),
  );

export const fixedBytesFromHex = <N extends number>(
  length: N,
): Schema.Schema<FixedBytes<N>, string> =>
  Schema.transform(Schema.String, fixedBytes(length), {
    decode: (fromA: string) => {
      const hexWithPrefix = fromA.startsWith("0x") ? fromA : `0x${fromA}`;
      const bytes = Bytes.fromHex(hexWithPrefix as `0x${string}`);
      return Array.from(bytes) as readonly number[];
    },
    encode: (_: readonly number[], toA: FixedBytes<N>) =>
      Bytes.toHex(toA) as string,
    strict: true,
  });

/**
 * Creates a Schema enforcing a Uint8Array of fixed length N branded as FixedBytes<N>.
 *
 * @param length - The exact length required
 */
export const fixedBytesFromBytes = <N extends number>(
  length: N,
): Schema.Schema<FixedBytes<N>, Uint8Array> =>
  Schema.transform(Schema.Uint8ArrayFromSelf, fixedBytes(length), {
    decode: (fromA: Uint8Array) => Array.from(fromA) as readonly number[],
    encode: (_: readonly number[], toA: FixedBytes<N>) => toA as Uint8Array,
    strict: true,
  });

/**
 * Example: FixedBytes schema for 32-byte arrays.
 */
export const FixedBytes32 = fixedBytesFromBytes(32);

/**
 * Helper type alias for FixedBytes of length 32.
 */
export type FB32 = FixedBytes<32>;

/**
 * Converts FixedBytes to a hexadecimal string.
 * @param bytes - The FixedBytes instance.
 */
export const toHex = (bytes: FB32): Effect.Effect<string> =>
  Effect.sync(() => Bytes.toHex(bytes));

/**
 * Converts FixedBytes to a BigInt.
 * @param bytes - The FixedBytes instance.
 */
export const toBigInt = (bytes: FB32): Effect.Effect<bigint> =>
  Effect.sync(() => Bytes.toBigInt(bytes));

/**
 * Pads FixedBytes from the left with zeroes.
 * @param bytes - The FixedBytes instance.
 * @param size - Desired padded length.
 */
export const padLeft = (
  bytes: FB32,
  size: number,
): Effect.Effect<FB32, Error> =>
  Effect.gen(function* (_) {
    const padded = Bytes.padLeft(bytes, size);
    return yield* _(Schema.decode(FixedBytes32)(padded));
  });

/**
 * Slices a FixedBytes instance from `start` to `end`.
 * @param bytes - The FixedBytes instance.
 * @param start - Starting index.
 * @param end - Ending index.
 */
export const slice = (
  bytes: FB32,
  start: number,
  end: number,
): Effect.Effect<Uint8Array> =>
  Effect.sync(() => Bytes.slice(bytes, start, end));

/**
 * Concatenates two FixedBytes instances.
 * @param a - First FixedBytes instance.
 * @param b - Second FixedBytes instance.
 */
export const concat = (a: FB32, b: FB32): Effect.Effect<Uint8Array> =>
  Effect.sync(() => Bytes.concat(a, b));

/**
 * Checks equality of two FixedBytes instances.
 * @param a - First FixedBytes instance.
 * @param b - Second FixedBytes instance.
 */
export const isEqual = (a: FB32, b: FB32): Effect.Effect<boolean> =>
  Effect.sync(() => Bytes.isEqual(a, b));
