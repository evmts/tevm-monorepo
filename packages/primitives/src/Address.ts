import { Schema, Effect } from "effect";
import { Bytes } from "ox";
import { B160, type B160 as B160Type } from "./B160.js";
import { B256, type B256 as B256Type } from "./B256.js";
import { getAddress, getContractAddress, getCreate2Address } from "viem/utils";
import { keccak256 as viemKeccak256 } from "viem";
import { fromHex } from "viem/utils";

/**
 * Ethereum address, represented as a 20-byte fixed array
 */
export type Address = B160Type;

/**
 * Schema for validating Address values from Uint8Array
 */
export const Address = B160;

/**
 * Schema for validating Address values from hex strings
 */
export const AddressFromHex = Schema.transform(
  Schema.String,
  Address,
  (hex: string) => {
    const hexWithPrefix = hex.startsWith("0x") ? hex : `0x${hex}`;
    return fromHex(getAddress(hexWithPrefix));
  }
);

/**
 * Converts Address to checksummed hex string
 * @param address - The Address instance.
 */
export const toChecksummedHex = (address: Address): Effect.Effect<string> =>
  Effect.sync(() => getAddress(Bytes.toHex(address)));

/**
 * Creates a zero address (0x0000...0000)
 */
export const zero = (): Effect.Effect<Address, Error> =>
  Effect.gen(function*(_) {
    const bytes = new Uint8Array(20).fill(0);
    return yield* _(Schema.decode(Address)(bytes));
  });

/**
 * Creates an address from a word (32-byte array) by taking the last 20 bytes
 * @param word - The 32-byte array.
 */
export const fromWord = (word: B256Type): Effect.Effect<Address, Error> =>
  Effect.gen(function*(_) {
    const bytes = Bytes.slice(word, 12, 32);  // Take last 20 bytes
    return yield* _(Schema.decode(Address)(bytes));
  });

/**
 * Converts an address to a word (32-byte array) by padding with zeroes
 * @param address - The Address instance.
 */
export const intoWord = (address: Address): Effect.Effect<B256Type, Error> =>
  Effect.gen(function*(_) {
    const padded = Bytes.padLeft(address, 32);
    return yield* _(Schema.decode(B256)(padded));
  });

/**
 * Computes the contract address for a deployment from the specified address with the given nonce
 * @param address - The sender address.
 * @param nonce - The nonce of the sender.
 */
export const create = (
  address: Address,
  nonce: bigint
): Effect.Effect<Address, Error> =>
  Effect.gen(function*(_) {
    const hexAddress = Bytes.toHex(address);
    const contractHex = getContractAddress({
      from: hexAddress,
      nonce
    });
    return yield* _(Schema.decode(AddressFromHex)(contractHex));
  });

/**
 * Computes the contract address for a CREATE2 deployment
 * @param address - The sender address.
 * @param salt - A 32-byte value.
 * @param initCodeHash - The Keccak-256 hash of the init code.
 */
export const create2 = (
  address: Address,
  salt: B256Type,
  initCodeHash: B256Type
): Effect.Effect<Address, Error> =>
  Effect.gen(function*(_) {
    const hexAddress = Bytes.toHex(address);
    const hexSalt = Bytes.toHex(salt);
    const hexInitCodeHash = Bytes.toHex(initCodeHash);
    
    const contractHex = getCreate2Address({
      from: hexAddress,
      salt: hexSalt,
      bytecode: hexInitCodeHash
    });
    
    return yield* _(Schema.decode(AddressFromHex)(contractHex));
  });

/**
 * Computes the contract address for a CREATE2 deployment from the init code
 * @param address - The sender address.
 * @param salt - A 32-byte value.
 * @param initCode - The init code.
 */
export const create2FromCode = (
  address: Address,
  salt: B256Type,
  initCode: Uint8Array
): Effect.Effect<Address, Error> =>
  Effect.gen(function*(_) {
    const hexAddress = Bytes.toHex(address);
    const hexSalt = Bytes.toHex(salt);
    const hexInitCode = Bytes.toHex(initCode);
    
    // Hash the init code
    const initCodeHash = viemKeccak256(hexInitCode);
    
    const contractHex = getCreate2Address({
      from: hexAddress,
      salt: hexSalt,
      bytecode: initCodeHash
    });
    
    return yield* _(Schema.decode(AddressFromHex)(contractHex));
  });