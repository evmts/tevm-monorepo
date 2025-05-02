import { Effect, Schema } from 'effect'
import { Bytes } from 'ox'
import { keccak256 as viemKeccak256 } from 'viem'
import { fromHex } from 'viem/utils'
import { B256, type B256 as B256Type } from './B256.js'

/**
 * Keccak-256 hash output, represented as a 32-byte array
 */
export type KeccakOutput = B256Type

/**
 * Schema for validating KeccakOutput values
 */
export const KeccakOutput = B256

/**
 * Computes the Keccak-256 hash of the given bytes
 * @param bytes - The input bytes to hash.
 */
export const keccak256 = (bytes: Uint8Array): Effect.Effect<KeccakOutput, Error> =>
	Effect.gen(function* (_) {
		const hexString = Bytes.toHex(bytes)
		const hashHex = viemKeccak256(hexString as `0x${string}`)
		const hashBytes = fromHex(hashHex, 'bytes')
		return yield* _(Schema.decode(KeccakOutput)(hashBytes))
	})

/**
 * Computes the Keccak-256 hash of the given hex string
 * @param hex - The input hex string to hash.
 */
export const keccak256FromHex = (hex: string): Effect.Effect<KeccakOutput, Error> =>
	Effect.gen(function* (_) {
		const hexWithPrefix = hex.startsWith('0x') ? hex : `0x${hex}`
		const hashHex = viemKeccak256(hexWithPrefix as `0x${string}`)
		const hashBytes = fromHex(hashHex, 'bytes')
		return yield* _(Schema.decode(KeccakOutput)(hashBytes))
	})

/**
 * Computes the EIP-191 prefixed message hash
 * @param message - The message bytes to hash.
 */
export const eip191HashMessage = (message: Uint8Array): Effect.Effect<KeccakOutput, Error> =>
	Effect.gen(function* (_) {
		// Create the Ethereum signed message prefix
		const prefix = `\x19Ethereum Signed Message:\n${message.length}`
		const prefixBytes = new TextEncoder().encode(prefix)

		// Concatenate prefix and message
		const prefixedMessage = Bytes.concat(prefixBytes, message)

		// Hash the prefixed message
		return yield* _(keccak256(prefixedMessage))
	})
