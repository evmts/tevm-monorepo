import { Schema, Effect } from "effect";
import { Bytes } from "ox";
import { fixedBytesFromBytes, fixedBytesFromHex } from "./FixedBytes.js";
import type { FixedBytes } from "./FixedBytes.js";
import { Address, type Address as AddressType } from "./Address.js";
import { Selector, type Selector as SelectorType } from "./Selector.js";
import { B256, type B256 as B256Type } from "./B256.js";

/**
 * Ethereum ABI function pointer: address (20 bytes) + selector (4 bytes)
 */
export type Function = FixedBytes<24>;

/**
 * Schema for validating Function values from Uint8Array
 */
export const Function = fixedBytesFromBytes(24);

/**
 * Schema for validating Function values from hex strings
 */
export const FunctionFromHex = fixedBytesFromHex(24);

/**
 * Converts Function to a hexadecimal string.
 * @param fn - The Function instance.
 */
export const toHex = (fn: Function): Effect.Effect<string> =>
  Effect.sync(() => Bytes.toHex(fn));

/**
 * Creates a Function from an address and a selector
 * @param address - The Address instance (20 bytes).
 * @param selector - The Selector instance (4 bytes).
 */
export const fromAddressAndSelector = (
  address: AddressType,
  selector: SelectorType
): Effect.Effect<Function, Error> =>
  Effect.gen(function*(_) {
    const combined = Bytes.concat(address, selector);
    return yield* _(Schema.decode(Function)(combined));
  });

/**
 * Extracts the address and selector from a Function
 * @param fn - The Function instance.
 */
export const toAddressAndSelector = (
  fn: Function
): Effect.Effect<[AddressType, SelectorType], Error> =>
  Effect.gen(function*(_) {
    const addressBytes = Bytes.slice(fn, 0, 20);
    const selectorBytes = Bytes.slice(fn, 20, 24);
    
    const address = yield* _(Schema.decode(Address)(addressBytes));
    const selector = yield* _(Schema.decode(Selector)(selectorBytes));
    
    return [address, selector] as [AddressType, SelectorType];
  });

/**
 * Creates a Function from a word (32-byte array)
 * by taking the first 24 bytes
 * @param word - The 32-byte array.
 */
export const fromWord = (word: B256Type): Effect.Effect<Function, Error> =>
  Effect.gen(function*(_) {
    const bytes = Bytes.slice(word, 0, 24);
    return yield* _(Schema.decode(Function)(bytes));
  });

/**
 * Converts a Function to a word (32-byte array)
 * by padding with zeroes
 * @param fn - The Function instance.
 */
export const intoWord = (fn: Function): Effect.Effect<B256Type, Error> =>
  Effect.gen(function*(_) {
    const padded = Bytes.padRight(fn, 32);
    return yield* _(Schema.decode(B256)(padded));
  });

/**
 * Creates a zero-filled Function.
 */
export const zero = (): Effect.Effect<Function, Error> =>
  Effect.gen(function*(_) {
    const bytes = new Uint8Array(24).fill(0);
    return yield* _(Schema.decode(Function)(bytes));
  });

/**
 * Checks equality of two Function instances.
 * @param a - First Function instance.
 * @param b - Second Function instance.
 */
export const isEqual = (a: Function, b: Function): Effect.Effect<boolean> =>
  Effect.sync(() => Bytes.isEqual(a, b));