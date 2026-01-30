import { Effect, Layer } from 'effect'
import { SetAccountService } from './SetAccountService.js'
import { StateManagerService } from '@tevm/state-effect'
import { InvalidParamsError, InternalError } from '@tevm/errors-effect'
import { keccak256 as keccak256Utils, createAccount } from '@tevm/utils'

/**
 * @module @tevm/actions-effect/SetAccountLive
 * @description Live implementation of the SetAccount service using StateManagerService
 */

/**
 * Empty code hash constant (keccak256 of empty bytes)
 * @type {`0x${string}`}
 */
const EMPTY_CODE_HASH = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'

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
 * Computes keccak256 hash of hex data
 * @param {string} hex - Hex string to hash
 * @returns {`0x${string}`} - Keccak256 hash
 */
const keccak256 = (hex) => {
	const bytes = hexToBytes(hex)
	return /** @type {`0x${string}`} */ (keccak256Utils(bytes))
}

/**
 * Validates the address format
 * @param {string} address - Address to validate
 * @returns {import('effect').Effect.Effect<`0x${string}`, import('@tevm/errors-effect').InvalidParamsError, never>}
 */
const validateAddress = (address, method = 'tevm_setAccount') =>
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
 * Validates hex string format
 * @param {string | undefined} hex - Hex string to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {import('effect').Effect.Effect<`0x${string}` | undefined, import('@tevm/errors-effect').InvalidParamsError, never>}
 */
const validateHex = (hex, fieldName, method = 'tevm_setAccount') =>
	Effect.gen(function* () {
		if (hex === undefined) return undefined
		if (typeof hex !== 'string' || !hex.startsWith('0x')) {
			return yield* Effect.fail(
				new InvalidParamsError({
					method,
					params: { [fieldName]: hex },
					message: `${fieldName} must be a hex string starting with 0x`,
				}),
			)
		}
		if (!/^0x[a-fA-F0-9]*$/.test(hex)) {
			return yield* Effect.fail(
				new InvalidParamsError({
					method,
					params: { [fieldName]: hex },
					message: `${fieldName} contains invalid hex characters`,
				}),
			)
		}
		return /** @type {`0x${string}`} */ (hex)
	})

/**
 * Validates bigint value
 * @param {bigint | undefined} value - Value to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {import('effect').Effect.Effect<bigint | undefined, import('@tevm/errors-effect').InvalidParamsError, never>}
 */
const validateBigInt = (value, fieldName, method = 'tevm_setAccount') =>
	Effect.gen(function* () {
		if (value === undefined) return undefined
		if (typeof value !== 'bigint') {
			return yield* Effect.fail(
				new InvalidParamsError({
					method,
					params: { [fieldName]: value },
					message: `${fieldName} must be a bigint`,
				}),
			)
		}
		if (value < 0n) {
			return yield* Effect.fail(
				new InvalidParamsError({
					method,
					params: { [fieldName]: value },
					message: `${fieldName} cannot be negative`,
				}),
			)
		}
		return value
	})

/**
 * Creates the SetAccount service implementation.
 *
 * This layer provides account modification functionality using the StateManagerService.
 * It supports setting account balance, nonce, bytecode, and storage.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { SetAccountService, SetAccountLive } from '@tevm/actions-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 *
 * const program = Effect.gen(function* () {
 *   const { setAccount } = yield* SetAccountService
 *   yield* setAccount({
 *     address: '0x1234567890123456789012345678901234567890',
 *     balance: 1000000000000000000n,
 *   })
 * })
 *
 * // Compose layers
 * const AppLayer = SetAccountLive.pipe(
 *   Layer.provide(StateManagerLocal)
 * )
 *
 * Effect.runPromise(program.pipe(Effect.provide(AppLayer)))
 * ```
 *
 * @type {import('effect').Layer.Layer<
 *   import('./SetAccountService.js').SetAccountService,
 *   never,
 *   import('@tevm/state-effect').StateManagerService
 * >}
 */
export const SetAccountLive = Layer.effect(
	SetAccountService,
	Effect.gen(function* () {
		const stateManager = yield* StateManagerService

		return {
			/**
			 * @param {import('./types.js').SetAccountParams} params
			 * @returns {import('effect').Effect.Effect<
			 *   import('./types.js').SetAccountSuccess,
			 *   import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError,
			 *   never
			 * >}
			 */
			setAccount: (params) =>
				Effect.gen(function* () {
					// Validate address format
					const address = yield* validateAddress(params.address)

					// Validate parameters
					const balance = yield* validateBigInt(params.balance, 'balance')
					const nonce = yield* validateBigInt(params.nonce, 'nonce')
					const deployedBytecode = yield* validateHex(params.deployedBytecode, 'deployedBytecode')
					const storageRoot = yield* validateHex(params.storageRoot, 'storageRoot')

					// Validate state/stateDiff mutual exclusivity
					if (params.state !== undefined && params.stateDiff !== undefined) {
						return yield* Effect.fail(
							new InvalidParamsError({
								method: 'tevm_setAccount',
								params: { state: params.state, stateDiff: params.stateDiff },
								message: 'Cannot provide both state and stateDiff - they are mutually exclusive',
							}),
						)
					}

					// Get existing account to merge values
					const existingAccount = yield* stateManager.getAccount(address).pipe(
						Effect.catchAll(() => Effect.succeed(undefined)),
					)

					// Merge with existing values
					const finalNonce = nonce ?? existingAccount?.nonce ?? 0n
					const finalBalance = balance ?? existingAccount?.balance ?? 0n

					// Build storage root and code hash
					let finalStorageRoot = storageRoot ? hexToBytes(storageRoot) : undefined
					let finalCodeHash = undefined

					if (deployedBytecode) {
						const codeHashHex = keccak256(deployedBytecode)
						finalCodeHash = hexToBytes(codeHashHex)
					}

					// Use existing values if not provided
					if (!finalStorageRoot && existingAccount?.storageRoot) {
						finalStorageRoot = existingAccount.storageRoot
					}
					if (!finalCodeHash && existingAccount?.codeHash) {
						finalCodeHash = existingAccount.codeHash
					}

					// Create account data for EthjsAccount
					/** @type {{ nonce: bigint; balance: bigint; storageRoot?: Uint8Array; codeHash?: Uint8Array }} */
					const accountData = {
						nonce: finalNonce,
						balance: finalBalance,
					}
					if (finalStorageRoot) {
						accountData.storageRoot = finalStorageRoot
					}
					if (finalCodeHash) {
						accountData.codeHash = finalCodeHash
					}

					// Create checkpoint for atomic state modifications
					yield* stateManager.checkpoint().pipe(
						Effect.mapError(
							(e) =>
								new InternalError({
									message: `Failed to create checkpoint: ${e.message}`,
									meta: { address, operation: 'checkpoint' },
									cause: e,
								}),
						),
					)

					// Wrap state modifications with commit/revert pattern
					yield* Effect.gen(function* () {
						// Put account into state manager using createAccount() for proper EthjsAccount instance
						yield* stateManager.putAccount(address, createAccount(accountData)).pipe(
							Effect.mapError(
								(e) =>
									new InternalError({
										message: `Failed to put account: ${e.message}`,
										meta: { address, operation: 'putAccount' },
										cause: e,
									}),
							),
						)

						// Put contract code if provided
						if (deployedBytecode) {
							yield* stateManager.putCode(address, hexToBytes(deployedBytecode)).pipe(
								Effect.mapError(
									(e) =>
										new InternalError({
											message: `Failed to put code: ${e.message}`,
											meta: { address, operation: 'putCode' },
											cause: e,
										}),
								),
							)
						}

						// Handle storage modifications
						// If `state` is provided, clear storage first
						if (params.state !== undefined) {
							yield* stateManager.clearStorage(address).pipe(
								Effect.mapError(
									(e) =>
										new InternalError({
											message: `Failed to clear storage: ${e.message}`,
											meta: { address, operation: 'clearStorage' },
											cause: e,
										}),
								),
							)
						}

						// Apply storage changes (from state or stateDiff)
						const storageChanges = params.state ?? params.stateDiff
						if (storageChanges !== undefined) {
							for (const [key, value] of Object.entries(storageChanges)) {
								// Validate storage key hex format
								if (typeof key !== 'string' || !key.startsWith('0x')) {
									return yield* Effect.fail(
										new InvalidParamsError({
											method: 'tevm_setAccount',
											params: { storageKey: key },
											message: `Invalid storage key: ${key}. Must be a hex string starting with 0x`,
										}),
									)
								}
								if (!/^0x[a-fA-F0-9]+$/.test(key)) {
									return yield* Effect.fail(
										new InvalidParamsError({
											method: 'tevm_setAccount',
											params: { storageKey: key },
											message: `Invalid storage key: ${key}. Contains invalid hex characters`,
										}),
									)
								}
								// Validate storage value hex format
								if (typeof value !== 'string' || !value.startsWith('0x')) {
									return yield* Effect.fail(
										new InvalidParamsError({
											method: 'tevm_setAccount',
											params: { storageKey: key, storageValue: value },
											message: `Invalid storage value for key ${key}: ${value}. Must be a hex string starting with 0x`,
										}),
									)
								}
								if (!/^0x[a-fA-F0-9]+$/.test(value)) {
									return yield* Effect.fail(
										new InvalidParamsError({
											method: 'tevm_setAccount',
											params: { storageKey: key, storageValue: value },
											message: `Invalid storage value for key ${key}: ${value}. Contains invalid hex characters`,
										}),
									)
								}
								const keyBytes = hexToBytes(key, { size: 32 })
								const valueBytes = hexToBytes(value)
								yield* stateManager.putStorage(address, keyBytes, valueBytes).pipe(
									Effect.mapError(
										(e) =>
											new InternalError({
												message: `Failed to put storage at ${key}: ${e.message}`,
												meta: { address, key, operation: 'putStorage' },
												cause: e,
											}),
									),
								)
							}
						}
					}).pipe(
						// On success, commit the changes
						Effect.tap(() =>
							stateManager.commit().pipe(
								Effect.mapError(
									(e) =>
										new InternalError({
											message: `Failed to commit state changes: ${e.message}`,
											meta: { address, operation: 'commit' },
											cause: e,
										}),
								),
							),
						),
						// On failure, revert the checkpoint (ignoring revert errors to preserve original error)
						Effect.tapError(() => stateManager.revert().pipe(Effect.catchAll(() => Effect.void))),
					)

					/** @type {import('./types.js').SetAccountSuccess} */
					const result = {
						address,
					}

					return result
				}),
		}
	}),
)
