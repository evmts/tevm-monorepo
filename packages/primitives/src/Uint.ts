import { Schema, Brand, Effect } from "effect";
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
): Schema.Schema<Uint<BITS>, bigint> => {
  const maxValue = (1n << BigInt(bits)) - 1n;
  
  return Schema.BigInt.pipe(
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
export const U256FromHex = Schema.transform(
  Schema.String,
  U256,
  (hex: string) => {
    const hexWithPrefix = hex.startsWith("0x") ? hex : `0x${hex}`;
    return BigInt(hexWithPrefix);
  }
);

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
    const schema = uintSchema(bits);
    return yield* _(Schema.decode(schema)(a + b));
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
    const schema = uintSchema(bits);
    return yield* _(Schema.decode(schema)(a - b));
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
    const schema = uintSchema(bits);
    return yield* _(Schema.decode(schema)(a * b));
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
    
    const schema = uintSchema(bits);
    return yield* _(Schema.decode(schema)(a / b));
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
    
    const schema = uintSchema(bits);
    return yield* _(Schema.decode(schema)(a % b));
  });

/**
 * Converts a Uint value to bytes
 * @param value - The Uint value.
 * @param bits - The bit size of the integer.
 */
export const toBytesArray = <BITS extends number>(
  value: Uint<BITS>,
  bits: BITS
): Effect.Effect<Uint8Array> =>
  Effect.sync(() => {
    const bytes = Math.ceil(bits / 8);
    return fromHex((`0x${value.toString(16)}`), { size: bytes });
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
    const schema = uintSchema(bits);
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    const value = BigInt(`0x${hex}`);
    return yield* _(Schema.decode(schema)(value));
  });

/**
 * Parses ether units to wei (U256)
 * @param value - The ether value as a string.
 */
export const parseEtherToU256 = (value: string): Effect.Effect<U256, Error> =>
  Effect.gen(function*(_) {
    const wei = parseEther(value);
    return yield* _(Schema.decode(U256)(wei));
  });

/**
 * Parses gwei units to wei (U256)
 * @param value - The gwei value as a string.
 */
export const parseGweiToU256 = (value: string): Effect.Effect<U256, Error> =>
  Effect.gen(function*(_) {
    const wei = parseGwei(value);
    return yield* _(Schema.decode(U256)(wei));
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
    return yield* _(Schema.decode(U256)(result));
  });