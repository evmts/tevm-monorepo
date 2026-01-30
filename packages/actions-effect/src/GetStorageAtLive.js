import { Effect, Layer } from 'effect'
import { GetStorageAtService } from './GetStorageAtService.js'
import { StateManagerService } from '@tevm/state-effect'
import { InvalidParamsError } from '@tevm/errors-effect'

/**
 * @module @tevm/actions-effect/GetStorageAtLive
 * @description Live implementation of the GetStorageAt service using StateManagerService
 */

/**
 * Converts a Uint8Array to a hex string, padded to 32 bytes
 * @param {Uint8Array} bytes - Bytes to convert
 * @returns {`0x${string}`} - Hex string (64 chars + 0x prefix)
 */
const bytesToHex = (bytes) => {
	if (!bytes || bytes.length === 0) {
		// Return 32 bytes of zeros for empty storage
		return '0x0000000000000000000000000000000000000000000000000000000000000000'
	}
	const hex = Buffer.from(bytes).toString('hex')
	// Pad to 32 bytes (64 hex chars)
	const paddedHex = hex.padStart(64, '0')
	return /** @type {`0x${string}`} */ (`0x${paddedHex}`)
}

/**
 * Converts a hex string to Uint8Array
 * @param {string} hex - Hex string to convert
 * @param {Object} [options] - Conversion options
 * @param {number} [options.size] - Expected size in bytes
 * @returns {Uint8Array} - Byte array
 */
const hexToBytes = (hex, options) => {
	const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex
	const paddedHex = options?.size ? cleanHex.padStart(options.size * 2, '0') : cleanHex
	const bytes = new Uint8Array(paddedHex.length / 2)
	for (let i = 0; i < bytes.length; i++) {
		bytes[i] = Number.parseInt(paddedHex.slice(i * 2, i * 2 + 2), 16)
	}
	return bytes
}

/**
 * Validates the address format
 * @param {string} address - Address to validate
 * @returns {import('effect').Effect.Effect<`0x${string}`, import('@tevm/errors-effect').InvalidParamsError, never>}
 */
const validateAddress = (address) =>
	Effect.gen(function* () {
		if (!address || typeof address !== 'string') {
			return yield* Effect.fail(
				new InvalidParamsError({
					message: 'Address is required and must be a string',
					code: -32602,
				}),
			)
		}
		if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
			return yield* Effect.fail(
				new InvalidParamsError({
					message: `Invalid address format: ${address}. Must be a 40-character hex string prefixed with 0x`,
					code: -32602,
				}),
			)
		}
		return /** @type {`0x${string}`} */ (address.toLowerCase())
	})

/**
 * Validates the storage slot format
 * @param {string} slot - Storage slot to validate
 * @returns {import('effect').Effect.Effect<`0x${string}`, import('@tevm/errors-effect').InvalidParamsError, never>}
 */
const validateSlot = (slot) =>
	Effect.gen(function* () {
		if (!slot || typeof slot !== 'string') {
			return yield* Effect.fail(
				new InvalidParamsError({
					message: 'Storage slot is required and must be a string',
					code: -32602,
				}),
			)
		}
		if (!slot.startsWith('0x')) {
			return yield* Effect.fail(
				new InvalidParamsError({
					message: `Invalid storage slot format: ${slot}. Must be a hex string prefixed with 0x`,
					code: -32602,
				}),
			)
		}
		if (!/^0x[a-fA-F0-9]+$/.test(slot)) {
			return yield* Effect.fail(
				new InvalidParamsError({
					message: `Invalid storage slot format: ${slot}. Contains invalid hex characters`,
					code: -32602,
				}),
			)
		}
		return /** @type {`0x${string}`} */ (slot.toLowerCase())
	})

/**
 * Creates the GetStorageAt service implementation.
 *
 * This layer provides storage query functionality using the StateManagerService.
 * Implements the eth_getStorageAt JSON-RPC method.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { GetStorageAtService, GetStorageAtLive } from '@tevm/actions-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 *
 * const program = Effect.gen(function* () {
 *   const { getStorageAt } = yield* GetStorageAtService
 *   const value = yield* getStorageAt({
 *     address: '0x1234567890123456789012345678901234567890',
 *     slot: '0x0'
 *   })
 *   return value
 * })
 *
 * // Compose layers
 * const AppLayer = GetStorageAtLive.pipe(
 *   Layer.provide(StateManagerLocal)
 * )
 *
 * Effect.runPromise(program.pipe(Effect.provide(AppLayer)))
 * ```
 *
 * @type {import('effect').Layer.Layer<
 *   import('./GetStorageAtService.js').GetStorageAtService,
 *   never,
 *   import('@tevm/state-effect').StateManagerService
 * >}
 */
export const GetStorageAtLive = Layer.effect(
	GetStorageAtService,
	Effect.gen(function* () {
		const stateManager = yield* StateManagerService

		return {
			/**
			 * @param {import('./types.js').GetStorageAtParams} params
			 * @returns {import('effect').Effect.Effect<`0x${string}`, import('@tevm/errors-effect').InvalidParamsError, never>}
			 */
			getStorageAt: (params) =>
				Effect.gen(function* () {
					// Validate address format
					const address = yield* validateAddress(params.address)

					// Validate slot format
					const slot = yield* validateSlot(params.slot)

					// Convert slot to bytes (32 bytes)
					const slotBytes = hexToBytes(slot, { size: 32 })

					// Get storage value from state manager
					const value = yield* stateManager.getStorage(address, slotBytes)

					// Convert to hex and return
					return bytesToHex(value)
				}),
		}
	}),
)
