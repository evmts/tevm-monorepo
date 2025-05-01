import { Schema, Effect } from "effect";
import { B256, type B256 as B256Type } from "./B256.js";
import { Address, type Address as AddressType } from "./Address.js";
import { U256, type U256 as U256Type } from "./Uint.js";
import { keccak256 as viemKeccak256 } from "viem";
import { fromHex } from "viem/utils";

/**
 * Transaction hash, represented as a 32-byte array
 */
export type TxHash = B256Type;

/**
 * Schema for validating TxHash values
 */
export const TxHash = B256;

/**
 * Transaction types as defined in Ethereum
 */
export enum TxKind {
  Legacy = 0,
  EIP2930 = 1,
  EIP1559 = 2
}

/**
 * Schema for validating TxKind values
 */
export const TxKindSchema = Schema.Enums(TxKind);

/**
 * Type for storage keys (32-byte)
 */
export type StorageKey = B256Type;

/**
 * Schema for validating StorageKey values
 */
export const StorageKey = B256;

/**
 * Type for storage values (U256)
 */
export type StorageValue = U256Type;

/**
 * Schema for validating StorageValue values
 */
export const StorageValue = U256;

/**
 * Computes the transaction hash for given RLP-encoded transaction bytes
 * @param bytes - The RLP-encoded transaction bytes.
 */
export const computeTxHash = (bytes: Uint8Array): Effect.Effect<TxHash, Error> =>
  Effect.gen(function*(_) {
    // Convert to hex
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    const hexWithPrefix = `0x${hex}`;
    
    // Hash with keccak256
    const hashHex = viemKeccak256(hexWithPrefix);
    
    // Convert to bytes
    const hashBytes = fromHex(hashHex);
    
    return yield* _(Schema.decode(TxHash)(hashBytes));
  });

/**
 * Computes a contract address created by a transaction from an account
 * @param sender - The sender address.
 * @param nonce - The account nonce.
 */
export const computeContractAddress = (
  sender: AddressType,
  nonce: bigint
): Effect.Effect<AddressType, Error> =>
  Effect.gen(function*(_) {
    // Imports
    const { Bytes } = await import("ox");
    const { getContractAddress } = await import("viem/utils");
    
    // Convert to hex
    const senderHex = Bytes.toHex(sender);
    
    // Compute address using viem
    const addressHex = getContractAddress({
      from: senderHex,
      nonce
    });
    
    // Convert back to bytes
    const addressBytes = fromHex(addressHex);
    
    return yield* _(Schema.decode(Address)(addressBytes));
  });

/**
 * Computes a contract address created by a CREATE2 transaction
 * @param sender - The sender address.
 * @param salt - A 32-byte salt.
 * @param initCodeHash - The hash of the contract init code.
 */
export const computeCreate2Address = (
  sender: AddressType,
  salt: B256Type,
  initCodeHash: B256Type
): Effect.Effect<AddressType, Error> =>
  Effect.gen(function*(_) {
    // Imports
    const { Bytes } = await import("ox");
    const { getCreate2Address } = await import("viem/utils");
    
    // Convert to hex
    const senderHex = Bytes.toHex(sender);
    const saltHex = Bytes.toHex(salt);
    const initCodeHashHex = Bytes.toHex(initCodeHash);
    
    // Compute address using viem
    const addressHex = getCreate2Address({
      from: senderHex,
      salt: saltHex,
      bytecode: initCodeHashHex
    });
    
    // Convert back to bytes
    const addressBytes = fromHex(addressHex);
    
    return yield* _(Schema.decode(Address)(addressBytes));
  });