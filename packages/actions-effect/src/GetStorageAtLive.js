import { InternalError, InvalidParamsError } from '@tevm/errors-effect'
import { StateManagerService } from '@tevm/state-effect'
import { Effect, Layer } from 'effect'
import { GetStorageAtService } from './GetStorageAtService.js'

/**
 * @module @tevm/actions-effect/GetStorageAtLive
 * @description Live implementation of the GetStorageAt service using StateManagerService
 */

/**
 * Converts a Uint8Array to a hex string, padded to 32 bytes (browser-compatible implementation)
 * Named bytesToHex32 to distinguish from bytesToHex in other files which don't pad (Issue #9 fix)
 * @param {Uint8Array} bytes - Bytes to convert
 * @returns {`0x${string}`} - Hex string (64 chars + 0x prefix)
 */
const bytesToHex32 = (bytes) => {
	if (!bytes || bytes.length === 0) {
		// Return 32 bytes of zeros for empty storage
		return '0x0000000000000000000000000000000000000000000000000000000000000000'
	}
	let hex = ''
	for (let i = 0; i < bytes.length; i++) {
		const byte = bytes[i]
		if (byte !== undefined) {
			hex += byte.toString(16).padStart(2, '0')
		}
	}
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
	// Normalize odd-length hex strings by left-padding with a single '0'
	// This prevents silent data truncation (e.g., "0xabc" becomes "0abc" -> [0x0a, 0xbc])
	const normalizedHex = cleanHex.length % 2 === 1 ? `0${cleanHex}` : cleanHex
	const paddedHex = options?.size ? normalizedHex.padStart(options.size * 2, '0') : normalizedHex
	const bytes = new Uint8Array(paddedHex.length / 2)
	for (let i = 0; i < bytes.length; i++) {
		bytes[i] = Number.parseInt(paddedHex.slice(i * 2, i * 2 + 2), 16)
	}
	return bytes
}

/**
 * Validates blockTag parameter - only 'latest' or undefined are supported
 * @param {import('./types.js').BlockParam} [blockTag] - Block tag to validate
 * @param {string} method - Method name for error messages
 * @returns {import('effect').Effect.Effect<'latest', import('@tevm/errors-effect').InvalidParamsError, never>}
 */
const validateBlockTag = (blockTag, method = 'eth_getStorageAt') =>
	Effect.gen(function* () {
		// Only 'latest' and undefined are supported
		// Historical block queries require TransportService for fork mode which is not yet implemented
		if (blockTag === undefined || blockTag === 'latest') {
			return /** @type {'latest'} */ ('latest')
		}
		return yield* Effect.fail(
			new InvalidParamsError({
				method,
				params: { blockTag },
				message: `Unsupported blockTag: ${String(blockTag)}. Only 'latest' is currently supported. Historical block queries require fork mode which is not yet implemented in actions-effect.`,
			}),
		)
	})

/**
 * Validates the address format
 * @param {string} address - Address to validate
 * @returns {import('effect').Effect.Effect<`0x${string}`, import('@tevm/errors-effect').InvalidParamsError, never>}
 */
const validateAddress = (address, method = 'eth_getStorageAt') =>
	Effect.gen(function* () {
		if (!address || typeof address !== 'string') {
			return yield* Effect.fail(
				new InvalidParamsError({
					method,
					params: { address },
					message: 'Address is required and must be a string',
				}),
			)
		}
		if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
			return yield* Effect.fail(
				new InvalidParamsError({
					method,
					params: { address },
					message: `Invalid address format: ${address}. Must be a 40-character hex string prefixed with 0x`,
				}),
			)
		}
		return /** @type {`0x${string}`} */ (address.toLowerCase())
	})

/**
 * Validates the storage position format
 * @param {string} position - Storage position to validate
 * @returns {import('effect').Effect.Effect<`0x${string}`, import('@tevm/errors-effect').InvalidParamsError, never>}
 */
const validatePosition = (position, method = 'eth_getStorageAt') =>
	Effect.gen(function* () {
		if (!position || typeof position !== 'string') {
			return yield* Effect.fail(
				new InvalidParamsError({
					method,
					params: { position },
					message: 'Storage position is required and must be a string',
				}),
			)
		}
		if (!position.startsWith('0x')) {
			return yield* Effect.fail(
				new InvalidParamsError({
					method,
					params: { position },
					message: `Invalid storage position format: ${position}. Must be a hex string prefixed with 0x`,
				}),
			)
		}
		if (!/^0x[a-fA-F0-9]+$/.test(position)) {
			return yield* Effect.fail(
				new InvalidParamsError({
					method,
					params: { position },
					message: `Invalid storage position format: ${position}. Contains invalid hex characters`,
				}),
			)
		}
		return /** @type {`0x${string}`} */ (position.toLowerCase())
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
 *     position: '0x0'
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
 */
export const GetStorageAtLive = Layer.effect(
	GetStorageAtService,
	Effect.gen(function* () {
		const stateManager = yield* StateManagerService

		return {
			/**
			 * @param {import('./types.js').GetStorageAtParams} params
			 */
			getStorageAt: (params) =>
				Effect.gen(function* () {
					// Validate address format
					const address = yield* validateAddress(params.address)

					// Validate blockTag - only 'latest' is supported
					yield* validateBlockTag(params.blockTag)

					// Validate position format
					const position = yield* validatePosition(params.position)

					// Convert position to bytes (32 bytes)
					const positionBytes = hexToBytes(position, { size: 32 })

					// Get storage value from state manager, wrapping any errors as InternalError
					const value = yield* stateManager.getStorage(address, positionBytes).pipe(
						Effect.mapError(
							(e) =>
								new InternalError({
									message: `Failed to get storage at ${position}: ${e instanceof Error ? e.message : String(e)}`,
									meta: { address, position, operation: 'getStorage' },
									cause: e,
								}),
						),
					)

					// Convert to hex and return (padded to 32 bytes for storage values)
					return bytesToHex32(value)
				}),
		}
	}),
)
