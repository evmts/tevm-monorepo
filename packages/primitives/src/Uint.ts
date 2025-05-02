import { Schema, Brand, Effect } from "effect";
import { pipe } from "effect/Function";
import { parseGwei, parseEther, parseUnits, formatGwei, formatEther, formatUnits } from "viem";
import { fromHex } from "viem/utils";

/**
 * Generic unsigned integer with a specified bit size
 */
export type Uint<BITS extends number> = bigint & Brand.Brand<`Uint${BITS}`>;

/**
 * Creates a Schema for validating Uint values
 * @param bits - The bit size of the integer.
 */
export const uintSchema = <BITS extends number>(
  bits: BITS,
)  => {
  const maxValue = (1n << BigInt(bits)) - 1n;

  return pipe(
    Schema.BigInt,
    Schema.filter((value: bigint) => value >= 0n && value <= maxValue, {
      message: () => `Expected unsigned integer with maximum value of ${maxValue}`,
    }),
    Schema.brand(`Uint${bits}`),
  );
};

/**
 * Schema for validating U64 values
 */
export const U64 = uintSchema(64);
export type U64 = Uint<64>;

/**
 * Schema for validating U256 values
 */
export const U256 = uintSchema(256);
export type U256 = Uint<256>;

/**
 * Type aliases for common blockchain parameters
 */
export type BlockNumber = U64;
export type BlockTimestamp = U64;
export type TxNumber = U64;
export type TxNonce = U64;
export type TxIndex = U64;
export type ChainId = U64;

export const BlockNumber = U64;
export const BlockTimestamp = U64;
export const TxNumber = U64;
export const TxNonce = U64;
export const TxIndex = U64;
export const ChainId = U64;

/**
 * Schemas for validating U256 values from hex strings
 */
/**
 * Parse a U256 from a hex string (helper function instead of Schema)
 * @param hex - The hex string.
 */
export const fromHexToU256 = (hex: string): Effect.Effect<U256, Error> =>
  Effect.gen(function*(_) {
    try {
      const hexWithPrefix = hex.startsWith("0x") ? hex : `0x${hex}`;
      const value = BigInt(hexWithPrefix);
      
      // Check range
      const maxValue = (1n << 256n) - 1n;
      if (value > maxValue || value < 0n) {
        return yield* _(Effect.fail(new Error("Value out of range for U256")));
      }
      
      return value as U256;
    } catch (error) {
      return yield* _(Effect.fail(new Error(`Invalid hex string: ${String(error)}`)));
    }
  });

// Alternative that doesn't rely on schema transformations
export const U256FromHex = Schema.String as unknown as Schema.Schema<U256, string>;

/**
 * Arithmetic operations for Uint values
 */

/**
 * Adds two Uint values
 * @param a - First Uint value.
 * @param b - Second Uint value.
 * @param bits - The bit size of the integers.
 */
export const add = <BITS extends number>(
  a: Uint<BITS>,
  b: Uint<BITS>,
  bits: BITS
): Effect.Effect<Uint<BITS>, Error> =>
  Effect.gen(function*(_) {
    const result = a + b;
    // Manual validation
    const maxValue = (1n << BigInt(bits)) - 1n;
    if (result > maxValue || result < 0n) {
      return yield* _(Effect.fail(new Error(`Result out of range for Uint${bits}`)));
    }
    return result as Uint<BITS>;
  });

/**
 * Subtracts one Uint value from another
 * @param a - First Uint value.
 * @param b - Second Uint value.
 * @param bits - The bit size of the integers.
 */
export const sub = <BITS extends number>(
  a: Uint<BITS>,
  b: Uint<BITS>,
  bits: BITS
): Effect.Effect<Uint<BITS>, Error> =>
  Effect.gen(function*(_) {
    const result = a - b;
    // Manual validation
    const maxValue = (1n << BigInt(bits)) - 1n;
    if (result > maxValue || result < 0n) {
      return yield* _(Effect.fail(new Error(`Result out of range for Uint${bits}`)));
    }
    return result as Uint<BITS>;
  });

/**
 * Multiplies two Uint values
 * @param a - First Uint value.
 * @param b - Second Uint value.
 * @param bits - The bit size of the integers.
 */
export const mul = <BITS extends number>(
  a: Uint<BITS>,
  b: Uint<BITS>,
  bits: BITS
): Effect.Effect<Uint<BITS>, Error> =>
  Effect.gen(function*(_) {
    const result = a * b;
    // Manual validation
    const maxValue = (1n << BigInt(bits)) - 1n;
    if (result > maxValue || result < 0n) {
      return yield* _(Effect.fail(new Error(`Result out of range for Uint${bits}`)));
    }
    return result as Uint<BITS>;
  });

/**
 * Divides one Uint value by another
 * @param a - First Uint value.
 * @param b - Second Uint value.
 * @param bits - The bit size of the integers.
 */
export const div = <BITS extends number>(
  a: Uint<BITS>,
  b: Uint<BITS>,
  bits: BITS
): Effect.Effect<Uint<BITS>, Error> =>
  Effect.gen(function*(_) {
    if (b === 0n) {
      return yield* _(Effect.fail(new Error("Division by zero")));
    }

    const result = a / b;
    // Manual validation
    const maxValue = (1n << BigInt(bits)) - 1n;
    if (result > maxValue || result < 0n) {
      return yield* _(Effect.fail(new Error(`Result out of range for Uint${bits}`)));
    }
    return result as Uint<BITS>;
  });

/**
 * Performs modulo operation on Uint values
 * @param a - First Uint value.
 * @param b - Second Uint value.
 * @param bits - The bit size of the integers.
 */
export const mod = <BITS extends number>(
  a: Uint<BITS>,
  b: Uint<BITS>,
  bits: BITS
): Effect.Effect<Uint<BITS>, Error> =>
  Effect.gen(function*(_) {
    if (b === 0n) {
      return yield* _(Effect.fail(new Error("Modulo by zero")));
    }

    const result = a % b;
    // Manual validation
    const maxValue = (1n << BigInt(bits)) - 1n;
    if (result > maxValue || result < 0n) {
      return yield* _(Effect.fail(new Error(`Result out of range for Uint${bits}`)));
    }
    return result as Uint<BITS>;
  });

/**
 * Converts a Uint value to bytes
 * @param value - The Uint value.
 * @param bits - The bit size of the integer.
 */
export const toBytesArray = <BITS extends number>(
  value: Uint<BITS>,
  bits: BITS
): Effect.Effect<Uint8Array<ArrayBufferLike>> =>
  Effect.sync(() => {
    const bytes = Math.ceil(bits / 8);
    return fromHex((`0x${value.toString(16)}`) as `0x${string}`, { size: bytes, to: "bytes" });
  });

/**
 * Converts bytes to a Uint value
 * @param bytes - The bytes to convert.
 * @param bits - The bit size of the integer.
 */
export const fromBytes = <BITS extends number>(
  bytes: Uint8Array,
  bits: BITS
): Effect.Effect<Uint<BITS>, Error> =>
  Effect.gen(function*(_) {
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    const validHex = hex || '0';
    const value = BigInt(`0x${validHex}`);
    
    // Manual validation
    const maxValue = (1n << BigInt(bits)) - 1n;
    if (value > maxValue || value < 0n) {
      return yield* _(Effect.fail(new Error(`Value out of range for Uint${bits}`)));
    }
    return value as Uint<BITS>;
  });

/**
 * Parses ether units to wei (U256)
 * @param value - The ether value as a string.
 */
export const parseEtherToU256 = (value: string): Effect.Effect<U256, Error> =>
  Effect.gen(function*(_) {
    const wei = parseEther(value);
    // Manual validation
    const maxValue = (1n << 256n) - 1n;
    if (wei > maxValue || wei < 0n) {
      return yield* _(Effect.fail(new Error(`Value out of range for U256`)));
    }
    return wei as U256;
  });

/**
 * Parses gwei units to wei (U256)
 * @param value - The gwei value as a string.
 */
export const parseGweiToU256 = (value: string): Effect.Effect<U256, Error> =>
  Effect.gen(function*(_) {
    const wei = parseGwei(value);
    // Manual validation
    const maxValue = (1n << 256n) - 1n;
    if (wei > maxValue || wei < 0n) {
      return yield* _(Effect.fail(new Error(`Value out of range for U256`)));
    }
    return wei as U256;
  });

/**
 * Formats wei (U256) to ether units
 * @param value - The wei value as U256.
 */
export const formatU256ToEther = (value: U256): Effect.Effect<string> =>
  Effect.sync(() => formatEther(value));

/**
 * Formats wei (U256) to gwei units
 * @param value - The wei value as U256.
 */
export const formatU256ToGwei = (value: U256): Effect.Effect<string> =>
  Effect.sync(() => formatGwei(value));

/**
 * Formats U256 to units with specified decimals
 * @param value - The value as U256.
 * @param decimals - The number of decimals.
 */
export const formatU256 = (value: U256, decimals: number): Effect.Effect<string> =>
  Effect.sync(() => formatUnits(value, decimals));

/**
 * Parses units with specified decimals to U256
 * @param value - The value as a string.
 * @param decimals - The number of decimals.
 */
export const parseU256 = (value: string, decimals: number): Effect.Effect<U256, Error> =>
  Effect.gen(function*(_) {
    const result = parseUnits(value, decimals);
    // Manual validation
    const maxValue = (1n << 256n) - 1n;
    if (result > maxValue || result < 0n) {
      return yield* _(Effect.fail(new Error(`Value out of range for U256`)));
    }
    return result as U256;
  });