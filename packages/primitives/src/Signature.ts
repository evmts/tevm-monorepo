import { Schema, Effect } from "effect";
import { Bytes } from "ox";
import { type B256, B256 as B256Schema } from "./B256.js";
import { type Address } from "./Address.js";
import { fromHex } from "viem/utils";
import { toBytes } from "viem/utils";

/**
 * An Ethereum ECDSA signature
 */
export interface Signature {
  r: B256;
  s: B256;
  v: number; // recid (recovery identifier)
  yParity: 0 | 1; // Recovery identifier in compact form
}

/**
 * Schema for validating Signature objects
 */
export const Signature = Schema.Struct({
  r: B256Schema,
  s: B256Schema,
  v: Schema.Number,
  yParity: Schema.Union(Schema.Literal(0), Schema.Literal(1))
});

/**
 * Creates a Signature from raw components
 * @param r - The r component of the signature.
 * @param s - The s component of the signature.
 * @param v - The v component of the signature (recid).
 */
export const fromComponents = (
  r: B256,
  s: B256,
  v: number
): Effect.Effect<Signature, Error> =>
  Effect.gen(function*(_) {
    const yParity = v % 2 === 0 ? 0 : 1;
    
    return {
      r,
      s,
      v,
      yParity: yParity as (0 | 1)
    };
  });

/**
 * Creates a Signature from a raw byte array
 * @param bytes - The raw signature bytes.
 */
export const fromRaw = (bytes: Uint8Array): Effect.Effect<Signature, Error> =>
  Effect.gen(function*(_) {
    if (bytes.length !== 65) {
      return yield* _(Effect.fail(new Error("Signature must be 65 bytes")));
    }
    
    const r = bytes.slice(0, 32);
    const s = bytes.slice(32, 64);
    const v = bytes[64];
    
    return yield* _(fromComponents(r, s, v));
  });

/**
 * Creates a Signature from a hex string
 * @param hex - The hex string.
 */
export const fromHexString = (hex: string): Effect.Effect<Signature, Error> =>
  Effect.gen(function*(_) {
    const hexWithPrefix = hex.startsWith("0x") ? hex : `0x${hex}`;
    
    if (hexWithPrefix.length !== 132) { // 0x + 65 bytes * 2 hex chars
      return yield* _(Effect.fail(new Error("Signature hex must be 130 characters (65 bytes)")));
    }
    
    const bytes = fromHex(hexWithPrefix);
    return yield* _(fromRaw(bytes));
  });

/**
 * Creates a Signature from ERC-2098 compact format (64 bytes)
 * @param bytes - The compact signature bytes.
 */
export const fromErc2098 = (bytes: Uint8Array): Effect.Effect<Signature, Error> =>
  Effect.gen(function*(_) {
    if (bytes.length !== 64) {
      return yield* _(Effect.fail(new Error("ERC-2098 signature must be 64 bytes")));
    }
    
    const r = bytes.slice(0, 32);
    const s = bytes.slice(32, 64);
    
    // Extract yParity from the highest bit of s
    const yParity = (s[0] & 0x80) ? 1 : 0;
    
    // Clear the highest bit of s
    const sCopy = new Uint8Array(s);
    sCopy[0] = sCopy[0] & 0x7f;
    
    // Calculate v
    const v = yParity + 27;
    
    return {
      r,
      s: sCopy,
      v,
      yParity: yParity as (0 | 1)
    };
  });

/**
 * Converts a Signature to raw bytes
 * @param signature - The Signature.
 */
export const toRaw = (signature: Signature): Effect.Effect<Uint8Array> =>
  Effect.sync(() => {
    const result = new Uint8Array(65);
    result.set(signature.r, 0);
    result.set(signature.s, 32);
    result[64] = signature.v;
    return result;
  });

/**
 * Converts a Signature to a hex string
 * @param signature - The Signature.
 */
export const toHex = (signature: Signature): Effect.Effect<string> =>
  Effect.gen(function*(_) {
    const bytes = yield* _(toRaw(signature));
    return Bytes.toHex(bytes);
  });

/**
 * Converts a Signature to ERC-2098 compact format
 * @param signature - The Signature.
 */
export const toErc2098 = (signature: Signature): Effect.Effect<Uint8Array> =>
  Effect.sync(() => {
    const result = new Uint8Array(64);
    result.set(signature.r, 0);
    
    // Create a copy of s
    const sCopy = new Uint8Array(signature.s);
    
    // Set the highest bit of s according to yParity
    if (signature.yParity === 1) {
      sCopy[0] = sCopy[0] | 0x80;
    } else {
      sCopy[0] = sCopy[0] & 0x7f;
    }
    
    result.set(sCopy, 32);
    return result;
  });

/**
 * Recovers the signer's address from a signature and message 
 * (Note: Currently a placeholder as we need viem account interface)
 * @param signature - The Signature.
 * @param message - The original message that was signed.
 */
export const recoverAddressFromMsg = (
  signature: Signature,
  message: Uint8Array
): Effect.Effect<Address, Error> =>
  Effect.fail(new Error("Not implemented yet - needs viem account interface"))

/**
 * Recovers the signer's address from a signature and message hash
 * (Note: Currently a placeholder as we need viem account interface)
 * @param signature - The Signature.
 * @param messageHash - The hash of the message that was signed.
 */
export const recoverAddressFromHash = (
  signature: Signature,
  messageHash: B256
): Effect.Effect<Address, Error> =>
  Effect.fail(new Error("Not implemented yet - needs viem account interface"))

/**
 * Normalizes the 's' value of a signature according to EIP-2
 * @param signature - The Signature.
 */
export const normalizeS = (signature: Signature): Effect.Effect<Signature, Error> =>
  Effect.gen(function*(_) {
    // Define the secp256k1 curve order / 2
    const SECP256K1_N_DIV_2 = 0x7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0n;
    
    // Convert s to bigint
    const s = Bytes.toBigInt(signature.s);
    
    // If s is already normalized, return the signature as is
    if (s <= SECP256K1_N_DIV_2) {
      return signature;
    }
    
    // Otherwise, calculate N - s
    const SECP256K1_N = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;
    const normalizedS = SECP256K1_N - s;
    
    // Convert back to bytes
    const normalizedSBytes = fromHex(`0x${normalizedS.toString(16).padStart(64, '0')}`);
    
    // Decode into a B256
    const normalizedSB256 = yield* _(Schema.decode(B256Schema)(normalizedSBytes));
    
    // Flip v/yParity
    const newYParity = signature.yParity === 0 ? 1 : 0;
    const newV = signature.v % 2 === 0 ? signature.v + 1 : signature.v - 1;
    
    // Return the normalized signature
    return {
      r: signature.r,
      s: normalizedSB256,
      v: newV,
      yParity: newYParity
    };
  });