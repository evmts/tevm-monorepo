import { Effect, Layer } from 'effect'
import { GetCodeService } from './GetCodeService.js'
import { StateManagerService } from '@tevm/state-effect'
import { InvalidParamsError, InternalError } from '@tevm/errors-effect'

/**
 * @module @tevm/actions-effect/GetCodeLive
 * @description Live implementation of the GetCode service using StateManagerService
 */

/**
 * Converts a Uint8Array to a hex string (browser-compatible implementation)
 * @param {Uint8Array} bytes - Bytes to convert
 * @returns {`0x${string}`} - Hex string
 */
const bytesToHex = (bytes) => {
	if (!bytes || bytes.length === 0) return '0x'
	let hex = ''
	for (let i = 0; i < bytes.length; i++) {
		const byte = bytes[i]
		if (byte !== undefined) {
			hex += byte.toString(16).padStart(2, '0')
		}
	}
	return /** @type {`0x${string}`} */ (`0x${hex}`)
}

/**
 * Validates blockTag parameter - only 'latest' or undefined are supported
 * @param {import('./types.js').BlockParam} [blockTag] - Block tag to validate
 * @param {string} method - Method name for error messages
 * @returns {import('effect').Effect.Effect<'latest', import('@tevm/errors-effect').InvalidParamsError, never>}
 */
const validateBlockTag = (blockTag, method = 'eth_getCode') =>
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
const validateAddress = (address, method = 'eth_getCode') =>
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
 * Creates the GetCode service implementation.
 *
 * This layer provides contract bytecode query functionality using the StateManagerService.
 * Implements the eth_getCode JSON-RPC method.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { GetCodeService, GetCodeLive } from '@tevm/actions-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 *
 * const program = Effect.gen(function* () {
 *   const { getCode } = yield* GetCodeService
 *   const code = yield* getCode({
 *     address: '0x1234567890123456789012345678901234567890'
 *   })
 *   return code
 * })
 *
 * // Compose layers
 * const AppLayer = GetCodeLive.pipe(
 *   Layer.provide(StateManagerLocal)
 * )
 *
 * Effect.runPromise(program.pipe(Effect.provide(AppLayer)))
 * ```
 */
export const GetCodeLive = Layer.effect(
	GetCodeService,
	Effect.gen(function* () {
		const stateManager = yield* StateManagerService

		return {
			/**
			 * @param {import('./types.js').GetCodeParams} params
			 */
			getCode: (params) =>
				Effect.gen(function* () {
					// Validate address format
					const address = yield* validateAddress(params.address)

					// Validate blockTag - only 'latest' is supported
					yield* validateBlockTag(params.blockTag)

					// Get code from state manager, wrapping any errors as InternalError
					const code = yield* stateManager.getCode(address).pipe(
						Effect.mapError(
							(e) =>
								new InternalError({
									message: `Failed to get code: ${e instanceof Error ? e.message : String(e)}`,
									meta: { address, operation: 'getCode' },
									cause: e,
								}),
						),
					)

					// Convert to hex and return
					return bytesToHex(code)
				}),
		}
	}),
)
