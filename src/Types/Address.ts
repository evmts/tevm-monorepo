import { Brand, Effect, Schema } from "effect";
import { Bytes, Address as OxAddress } from "ox";
import { B160, type B160 as B160Type } from "./B160.js";
import { B256, type B256 as B256Type } from "./B256.js";

/**
 * Ethereum address, represented as a 20-byte fixed array with an Address brand
 */
export type Address = B160Type & Brand.Brand<"Address">;

/**
 * Schema for validating Address values from Uint8Array
 */
export const Address = B160.pipe(Schema.brand("Address"));

/**
 * Schema for validating Address values from hex strings
 */
export const AddressFromHex = Schema.transform(Schema.String, Address, {
  decode: (hex) => {
    const hexWithPrefix = hex.startsWith("0x") ? hex : `0x${hex}`;
    // Use Ox Address for validation and checksumming
    const formatted = OxAddress.checksum(hexWithPrefix);
    const bytes = Bytes.fromHex(formatted);
    // First create a B160, then convert to Address
    const b160 = Schema.decodeSync(B160)(bytes);
    return Schema.decodeSync(Address)(b160);
  },
  encode: (address) => {
    return OxAddress.checksum(Bytes.toHex(address));
  },
});

/**
 * Converts Address to checksummed hex string
 * @param address - The Address instance.
 */
export const toChecksummedHex = (address: Address): Effect.Effect<string> =>
  Effect.sync(() => OxAddress.checksum(Bytes.toHex(address)));

/**
 * Creates a zero address (0x0000...0000)
 */
export const zero = (): Effect.Effect<Address, Error> =>
  Effect.gen(function* (_) {
    const bytes = new Uint8Array(20).fill(0);
    // First as B160, then as Address for branding
    const b160 = yield* _(Schema.decode(B160)(bytes));
    return yield* _(Schema.decode(Address)(b160));
  });

/**
 * Creates an address from a word (32-byte array) by taking the last 20 bytes
 * @param word - The 32-byte array.
 */
export const fromWord = (word: B256Type): Effect.Effect<Address, Error> =>
  Effect.gen(function* (_) {
    const bytes = Bytes.slice(word, 12, 32); // Take last 20 bytes
    // First we decode as B160, then as Address to ensure proper branding
    const b160 = yield* _(Schema.decode(B160)(bytes));
    return yield* _(Schema.decode(Address)(b160));
  });

/**
 * Converts an address to a word (32-byte array) by padding with zeroes
 * @param address - The Address instance.
 */
export const intoWord = (address: Address): Effect.Effect<B256Type, Error> =>
  Effect.gen(function* (_) {
    const padded = Bytes.padLeft(address, 32);
    return yield* _(Schema.decode(B256)(padded));
  });
