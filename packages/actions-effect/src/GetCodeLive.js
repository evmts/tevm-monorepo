import { Effect, Layer } from 'effect'
import { GetCodeService } from './GetCodeService.js'
import { StateManagerService } from '@tevm/state-effect'
import { InvalidParamsError } from '@tevm/errors-effect'

/**
 * @module @tevm/actions-effect/GetCodeLive
 * @description Live implementation of the GetCode service using StateManagerService
 */

/**
 * Converts a Uint8Array to a hex string
 * @param {Uint8Array} bytes - Bytes to convert
 * @returns {`0x${string}`} - Hex string
 */
const bytesToHex = (bytes) => {
	if (!bytes || bytes.length === 0) return '0x'
	return /** @type {`0x${string}`} */ (`0x${Buffer.from(bytes).toString('hex')}`)
}

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
 *
 * @type {import('effect').Layer.Layer<
 *   import('./GetCodeService.js').GetCodeService,
 *   never,
 *   import('@tevm/state-effect').StateManagerService
 * >}
 */
export const GetCodeLive = Layer.effect(
	GetCodeService,
	Effect.gen(function* () {
		const stateManager = yield* StateManagerService

		return {
			/**
			 * @param {import('./types.js').GetCodeParams} params
			 * @returns {import('effect').Effect.Effect<`0x${string}`, import('@tevm/errors-effect').InvalidParamsError, never>}
			 */
			getCode: (params) =>
				Effect.gen(function* () {
					// Validate address format
					const address = yield* validateAddress(params.address)

					// Get code from state manager
					const code = yield* stateManager.getCode(address)

					// Convert to hex and return
					return bytesToHex(code)
				}),
		}
	}),
)
