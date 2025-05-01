import { Schema, Effect } from "effect";
import { fixedBytesFromBytes, fixedBytesFromHex } from "./FixedBytes.js";
import type { FixedBytes } from "./FixedBytes.js";
import type { Address as AddressType } from "./Address.js";
import type { B256 as B256Type } from "./B256.js";
import { keccak256 } from "./Keccak256.js";

/**
 * 256-byte bloom filter
 */
export type Bloom = FixedBytes<256>;

/**
 * Schema for validating Bloom values from Uint8Array
 */
export const Bloom = fixedBytesFromBytes(256);

/**
 * Schema for validating Bloom values from hex strings
 */
export const BloomFromHex = fixedBytesFromHex(256);

/**
 * Bloom filter constants
 */
export const BLOOM_BITS_PER_ITEM = 3;
export const BLOOM_SIZE_BYTES = 256;
export const BLOOM_SIZE_BITS = BLOOM_SIZE_BYTES * 8;

/**
 * Input types for bloom filters
 */
export enum BloomInputType {
  Raw, // Raw input to be hashed
  Hash  // Already hashed input
}

/**
 * Creates a new empty Bloom filter
 */
export const empty = (): Effect.Effect<Bloom, Error> =>
  Effect.gen(function*(_) {
    const bytes = new Uint8Array(BLOOM_SIZE_BYTES).fill(0);
    return yield* _(Schema.decode(Bloom)(bytes));
  });

/**
 * Sets the bit at the specified index in the bloom filter
 * @param bloom - The bloom filter.
 * @param bitIndex - The bit index to set.
 */
export const setBit = (bloom: Bloom, bitIndex: number): Effect.Effect<Bloom, Error> =>
  Effect.gen(function*(_) {
    // Create a mutable copy of the bloom filter
    const result = new Uint8Array(bloom);
    
    // Calculate byte index and bit position within the byte
    const byteIndex = Math.floor(bitIndex / 8);
    const bitPosition = bitIndex % 8;
    
    // Ensure we don't go out of bounds
    if (byteIndex < BLOOM_SIZE_BYTES && byteIndex >= 0) {
      // Set the bit - ensure we handle undefined
      const currentByte = result[byteIndex] || 0;
      result[byteIndex] = currentByte | (1 << bitPosition);
    }
    
    return yield* _(Schema.decode(Bloom)(result));
  });

/**
 * Checks if the bit at the specified index is set in the bloom filter
 * @param bloom - The bloom filter.
 * @param bitIndex - The bit index to check.
 */
export const hasBit = (bloom: Bloom, bitIndex: number): Effect.Effect<boolean> =>
  Effect.sync(() => {
    // Calculate byte index and bit position within the byte
    const byteIndex = Math.floor(bitIndex / 8);
    const bitPosition = bitIndex % 8;
    
    // Ensure we don't go out of bounds
    if (byteIndex >= BLOOM_SIZE_BYTES || byteIndex < 0) return false;
    
    // Check if the bit is set - ensure we handle undefined
    const currentByte = bloom[byteIndex] || 0;
    return (currentByte & (1 << bitPosition)) !== 0;
  });

/**
 * Calculates the bit indexes for a given input
 * @param input - The input bytes.
 */
export const getBitIndexes = (input: Uint8Array): Effect.Effect<number[], Error> =>
  Effect.gen(function*(_) {
    // Hash the input first
    const hash = yield* _(keccak256(input));
    
    // Calculate bit indexes (3 bits per item in Ethereum's bloom filter)
    const indexes: number[] = [];
    
    for (let i = 0; i < BLOOM_BITS_PER_ITEM; i++) {
      // Make sure we don't go out of bounds
      if (i*2 + 1 >= hash.length) break;
      
      // For each bit we need to set, we take 2 bytes from the hash at different positions
      // and use them to determine the bit position in the bloom filter
      const byte1 = hash[i*2] || 0;
      const byte2 = hash[i*2 + 1] || 0;
      
      const bitPos = (
        ((byte1 << 8) + byte2) & // Take 2 consecutive bytes
        (BLOOM_SIZE_BITS - 1) // Ensure we don't exceed the size of the bloom filter
      );
      indexes.push(bitPos);
    }
    
    return indexes;
  });

/**
 * Adds an item to the bloom filter
 * @param bloom - The bloom filter.
 * @param input - The input bytes to add.
 * @param inputType - Whether the input is raw or already hashed.
 */
export const accrue = (
  bloom: Bloom,
  input: Uint8Array,
  inputType: BloomInputType = BloomInputType.Raw
): Effect.Effect<Bloom, Error> =>
  Effect.gen(function*(_) {
    let hashBytes: Uint8Array;
    
    // If the input is raw, hash it first
    if (inputType === BloomInputType.Raw) {
      hashBytes = yield* _(keccak256(input));
    } else {
      // Input is already a hash, just ensure it's the right length
      if (input.length !== 32) {
        return yield* _(Effect.fail(new Error("Hash input must be 32 bytes")));
      }
      hashBytes = input;
    }
    
    // Get the bit indexes to set
    const indexes = yield* _(getBitIndexes(hashBytes));
    
    // Start with the current bloom filter
    let result = bloom;
    
    // Set each bit
    for (const index of indexes) {
      result = yield* _(setBit(result, index));
    }
    
    return result;
  });

/**
 * Combines two bloom filters using bitwise OR
 * @param bloomA - First bloom filter.
 * @param bloomB - Second bloom filter.
 */
export const accrueBloom = (bloomA: Bloom, bloomB: Bloom): Effect.Effect<Bloom, Error> =>
  Effect.gen(function*(_) {
    // Use bitwise OR to combine the bloom filters
    const result = new Uint8Array(BLOOM_SIZE_BYTES);
    
    for (let i = 0; i < BLOOM_SIZE_BYTES; i++) {
      result[i] = bloomA[i] | bloomB[i];
    }
    
    return yield* _(Schema.decode(Bloom)(result));
  });

/**
 * Checks if a bloom filter might contain an item
 * @param bloom - The bloom filter.
 * @param input - The input bytes to check.
 * @param inputType - Whether the input is raw or already hashed.
 */
export const containsInput = (
  bloom: Bloom,
  input: Uint8Array,
  inputType: BloomInputType = BloomInputType.Raw
): Effect.Effect<boolean, Error> =>
  Effect.gen(function*(_) {
    let hashBytes: Uint8Array;
    
    // If the input is raw, hash it first
    if (inputType === BloomInputType.Raw) {
      hashBytes = yield* _(keccak256(input));
    } else {
      // Input is already a hash, just ensure it's the right length
      if (input.length !== 32) {
        return yield* _(Effect.fail(new Error("Hash input must be 32 bytes")));
      }
      hashBytes = input;
    }
    
    // Get the bit indexes to check
    const indexes = yield* _(getBitIndexes(hashBytes));
    
    // Check if all required bits are set
    for (const index of indexes) {
      const isSet = yield* _(hasBit(bloom, index));
      if (!isSet) {
        return false;
      }
    }
    
    return true;
  });

/**
 * Checks if a bloom filter contains all bits set in another bloom filter
 * @param bloomA - The bloom filter to check in.
 * @param bloomB - The bloom filter to check for.
 */
export const contains = (bloomA: Bloom, bloomB: Bloom): Effect.Effect<boolean> =>
  Effect.sync(() => {
    // Check if all bits set in bloomB are also set in bloomA
    for (let i = 0; i < BLOOM_SIZE_BYTES; i++) {
      // If any bit set in bloomB is not set in bloomA, return false
      if ((bloomA[i] & bloomB[i]) !== bloomB[i]) {
        return false;
      }
    }
    
    return true;
  });

/**
 * Adds a log entry to the bloom filter
 * @param bloom - The bloom filter.
 * @param address - The log address.
 * @param topics - The log topics.
 */
export const accrueLog = (
  bloom: Bloom,
  address: AddressType,
  topics: B256Type[]
): Effect.Effect<Bloom, Error> =>
  Effect.gen(function*(_) {
    // Add the address
    let result = yield* _(accrue(bloom, address));
    
    // Add each topic that exists
    for (const topic of topics) {
      if (topic) {
        result = yield* _(accrue(result, topic, BloomInputType.Hash));
      }
    }
    
    return result;
  });

/**
 * Checks if a bloom filter might contain a log entry
 * @param bloom - The bloom filter.
 * @param address - The log address.
 * @param topics - The log topics.
 */
export const containsLog = (
  bloom: Bloom,
  address: AddressType,
  topics: B256Type[]
): Effect.Effect<boolean, Error> =>
  Effect.gen(function*(_) {
    // Check the address
    const hasAddress = yield* _(containsInput(bloom, address));
    if (!hasAddress) {
      return false;
    }
    
    // Check each topic that exists
    for (const topic of topics) {
      if (topic) {
        const hasTopic = yield* _(containsInput(bloom, topic, BloomInputType.Hash));
        if (!hasTopic) {
          return false;
        }
      }
    }
    
    return true;
  });