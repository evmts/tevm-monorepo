/**
 * @module @tevm/memory-client-effect/MemoryClientLive
 * Layer implementation for the Effect-based memory client
 */

import { Effect, Layer, Ref } from 'effect'
import { MemoryClientService } from './MemoryClientService.js'
import { StateManagerService } from '@tevm/state-effect'
import { VmService } from '@tevm/vm-effect'
import { CommonService } from '@tevm/common-effect'
// Note: Action services are created inline in createActionServices() to ensure
// deepCopy creates services bound to the copied state manager
import { SnapshotService } from '@tevm/node-effect'
import { InvalidParamsError, InternalError } from '@tevm/errors-effect'

/**
 * Helper to convert address to EthjsAddress
 * @param {string} address - Hex address string
 * @returns {Promise<import('@tevm/utils').EthjsAddress>}
 */
const createEthjsAddress = async (address) => {
	const { createAddressFromString } = await import('@tevm/utils')
	return createAddressFromString(address)
}

/**
 * Validates basic Ethereum address format (40 hex characters with 0x prefix).
 * Note: This is a sync format check only. EIP-55 checksum validation is handled
 * by validateAddressWithChecksum() which uses viem's getAddress function.
 *
 * @param {string} address
 * @returns {boolean}
 */
const isValidAddressFormat = (address) => {
	return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Validates an Ethereum address with full EIP-55 checksum support.
 * - Lowercase addresses (0x...) are accepted (no checksum to verify)
 * - Uppercase addresses (0x...) are accepted (no checksum to verify)
 * - Mixed-case addresses must have valid EIP-55 checksum
 *
 * @param {string} address - The address to validate
 * @returns {Promise<{valid: boolean, checksumAddress?: string, error?: string}>}
 */
const validateAddressWithChecksum = async (address) => {
	// Basic format check first
	if (!isValidAddressFormat(address)) {
		return { valid: false, error: `Invalid address format: ${address}` }
	}

	try {
		// Import getAddress from viem for EIP-55 checksum validation
		const { getAddress } = await import('viem')
		// getAddress will throw if the checksum is invalid for mixed-case addresses
		// and will return the properly checksummed address
		const checksumAddress = getAddress(address)
		return { valid: true, checksumAddress }
	} catch (e) {
		return {
			valid: false,
			error: `Invalid EIP-55 checksum: ${e instanceof Error ? e.message : String(e)}`
		}
	}
}

/**
 * Legacy sync validator for backwards compatibility.
 * Only checks format, not EIP-55 checksum.
 * @deprecated Use validateAddressWithChecksum for full validation
 * @param {string} address
 * @returns {boolean}
 */
const isValidAddress = (address) => {
	return isValidAddressFormat(address)
}

/**
 * Validates that a string contains only valid hexadecimal characters.
 * @param {string} str - The string to validate (without 0x prefix)
 * @returns {boolean} True if valid hex, false otherwise
 */
const isValidHex = (str) => /^[0-9a-fA-F]*$/.test(str)

/**
 * Converts bytes to hex string (browser-compatible implementation)
 * @param {Uint8Array} bytes
 * @returns {import('./types.js').Hex}
 */
const bytesToHex = (bytes) => {
	if (!bytes || /** @type {Uint8Array} */ (bytes).length === 0) return /** @type {import('./types.js').Hex} */ ('0x')
	let hex = '0x'
	for (let i = 0; i < bytes.length; i++) {
		hex += /** @type {number} */ (bytes[i]).toString(16).padStart(2, '0')
	}
	return /** @type {import('./types.js').Hex} */ (hex)
}

/**
 * @typedef {Object} ActionServices
 * @property {(params: import('@tevm/actions-effect').GetAccountParams) => import('effect').Effect.Effect<import('@tevm/actions-effect').GetAccountSuccess, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError>} getAccount
 * @property {(params: import('@tevm/actions-effect').SetAccountParams) => import('effect').Effect.Effect<import('@tevm/actions-effect').SetAccountSuccess, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError>} setAccount
 * @property {(params: import('@tevm/actions-effect').GetBalanceParams) => import('effect').Effect.Effect<bigint, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError>} getBalance
 * @property {(params: import('@tevm/actions-effect').GetCodeParams) => import('effect').Effect.Effect<import('./types.js').Hex, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError>} getCode
 * @property {(params: import('@tevm/actions-effect').GetStorageAtParams) => import('effect').Effect.Effect<import('./types.js').Hex, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError>} getStorageAt
 */

/**
 * Creates action service wrappers bound to a specific StateManagerShape.
 * This allows deepCopy to create services that operate on the copied state.
 *
 * @param {import('@tevm/state-effect').StateManagerShape} stateManager
 * @returns {ActionServices} Action service implementations
 */
const createActionServices = (stateManager) => {
	return {
		/**
		 * Get account implementation using the provided stateManager
		 * @param {import('@tevm/actions-effect').GetAccountParams} params
		 * @returns {import('effect').Effect.Effect<import('@tevm/actions-effect').GetAccountSuccess, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError>}
		 */
		getAccount: (params) =>
			Effect.gen(function* () {
				// Validate address with EIP-55 checksum support (Issue #312 fix)
				if (!params.address) {
					return yield* Effect.fail(
						new InvalidParamsError({
							method: 'getAccount',
							params,
							message: 'Missing address parameter',
						})
					)
				}

				// Validate EIP-55 checksum for mixed-case addresses
				const addressValidation = yield* Effect.tryPromise({
					try: () => validateAddressWithChecksum(params.address),
					catch: (e) =>
						new InternalError({
							message: `Address validation failed: ${/** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e).message : String(e)}`,
							cause: /** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e) : undefined,
						}),
				})

				if (!addressValidation.valid) {
					return yield* Effect.fail(
						new InvalidParamsError({
							method: 'getAccount',
							params,
							message: addressValidation.error || `Invalid address: ${params.address}`,
						})
					)
				}

				// Use the checksummed address for internal operations
				const normalizedAddress = addressValidation.checksumAddress || params.address
				const ethjsAddress = yield* Effect.tryPromise({
					try: () => createEthjsAddress(normalizedAddress.toLowerCase()),
					catch: (e) =>
						new InternalError({
							message: `Failed to create address: ${/** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e).message : String(e)}`,
							cause: /** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e) : undefined,
						}),
				})

				const account = yield* stateManager.getAccount(ethjsAddress).pipe(
					Effect.mapError(
						(e) =>
							new InternalError({
								message: `Failed to get account: ${/** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e).message : String(e)}`,
								cause: /** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e) : undefined,
							})
					)
				)

				const code = yield* stateManager.getCode(ethjsAddress).pipe(
					Effect.mapError(
						(e) =>
							new InternalError({
								message: `Failed to get code: ${/** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e).message : String(e)}`,
								cause: /** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e) : undefined,
							})
					)
				)

				const nonce = account?.nonce ?? 0n
				const balance = account?.balance ?? 0n
				const storageRoot = account ? bytesToHex(account.storageRoot) : '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
				const codeHash = account ? bytesToHex(account.codeHash) : '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'

				return {
					// Return EIP-55 checksummed address (Issue #312 fix)
					address: /** @type {import('./types.js').Address} */ (normalizedAddress),
					nonce,
					balance,
					deployedBytecode: bytesToHex(code),
					storageRoot: /** @type {import('./types.js').Hex} */ (storageRoot),
					codeHash: /** @type {import('./types.js').Hex} */ (codeHash),
					isContract: code.length > 0,
					isEmpty: nonce === 0n && balance === 0n && code.length === 0,
				}
			}),

		/**
		 * Set account implementation using the provided stateManager
		 * @param {import('@tevm/actions-effect').SetAccountParams} params
		 * @returns {import('effect').Effect.Effect<import('@tevm/actions-effect').SetAccountSuccess, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError>}
		 */
		setAccount: (params) =>
			Effect.gen(function* () {
				// Validate address with EIP-55 checksum support (Issue #312 fix)
				if (!params.address) {
					return yield* Effect.fail(
						new InvalidParamsError({
							method: 'setAccount',
							params,
							message: 'Missing address parameter',
						})
					)
				}

				// Validate EIP-55 checksum for mixed-case addresses
				const addressValidation = yield* Effect.tryPromise({
					try: () => validateAddressWithChecksum(params.address),
					catch: (e) =>
						new InternalError({
							message: `Address validation failed: ${/** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e).message : String(e)}`,
							cause: /** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e) : undefined,
						}),
				})

				if (!addressValidation.valid) {
					return yield* Effect.fail(
						new InvalidParamsError({
							method: 'setAccount',
							params,
							message: addressValidation.error || `Invalid address: ${params.address}`,
						})
					)
				}

				// Use the checksummed address for internal operations
				const normalizedAddress = addressValidation.checksumAddress || params.address
				const ethjsAddress = yield* Effect.tryPromise({
					try: () => createEthjsAddress(normalizedAddress.toLowerCase()),
					catch: (e) =>
						new InternalError({
							message: `Failed to create address: ${/** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e).message : String(e)}`,
							cause: /** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e) : undefined,
						}),
				})
				const { Account } = yield* Effect.tryPromise({
					try: () => import('@ethereumjs/util'),
					catch: (e) =>
						new InternalError({
							message: `Failed to import @ethereumjs/util: ${/** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e).message : String(e)}`,
							cause: /** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e) : undefined,
						}),
				})

				// Create checkpoint for atomic operation (RFC §6.3)
				yield* stateManager.checkpoint().pipe(
					Effect.mapError(
						(e) =>
							new InternalError({
								message: `Failed to checkpoint: ${/** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e).message : String(e)}`,
								cause: /** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e) : undefined,
							})
					)
				)

				// Build the core operations that should be reverted on failure (RFC §6.3)
				// Using Effect patterns instead of try/catch for proper error channel handling
				const coreOperations = Effect.gen(function* () {
					// Cast to unknown first to allow instanceof check, then use any to bypass private property mismatch
					const account = /** @type {any} */ (new Account(params.nonce ?? 0n, params.balance ?? 0n))
					yield* stateManager.putAccount(ethjsAddress, account).pipe(
						Effect.mapError(
							(e) =>
								new InternalError({
									message: `Failed to put account: ${/** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e).message : String(e)}`,
									cause: /** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e) : undefined,
								})
						)
					)

					// Set code if provided
					if (params.deployedBytecode) {
						const codeHex = params.deployedBytecode.startsWith('0x')
							? params.deployedBytecode.slice(2)
							: params.deployedBytecode
						// Validate hex characters BEFORE parsing to prevent silent data corruption (Issue #304 fix)
						/* c8 ignore start - defensive validation for corrupt input */
						if (!isValidHex(codeHex)) {
							return yield* Effect.fail(
								new InvalidParamsError({
									method: 'setAccount',
									params,
									message: `Invalid hex in deployedBytecode: contains non-hexadecimal characters`,
								})
							)
						}
						/* c8 ignore stop */
						const normalizedHex = codeHex.length % 2 === 1 ? '0' + codeHex : codeHex
						const codeBytes = new Uint8Array(normalizedHex.length / 2)
						for (let i = 0; i < codeBytes.length; i++) {
							codeBytes[i] = parseInt(normalizedHex.substring(i * 2, i * 2 + 2), 16)
						}
						yield* stateManager.putCode(ethjsAddress, codeBytes).pipe(
							Effect.mapError(
								(e) =>
									new InternalError({
										message: `Failed to put code: ${/** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e).message : String(e)}`,
										cause: /** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e) : undefined,
									})
							)
						)
					}

					// Set storage if provided
					if (params.state) {
						for (const [key, value] of Object.entries(params.state)) {
							const keyHex = key.startsWith('0x') ? key.slice(2) : key
							const valueHex = value.startsWith('0x') ? value.slice(2) : value
							// Validate hex characters BEFORE parsing to prevent silent data corruption (Issue #305 fix)
							/* c8 ignore start - defensive validation for corrupt input */
							if (!isValidHex(keyHex)) {
								return yield* Effect.fail(
									new InvalidParamsError({
										method: 'setAccount',
										params,
										message: `Invalid hex in storage key '${key}': contains non-hexadecimal characters`,
									})
								)
							}
							if (!isValidHex(valueHex)) {
								return yield* Effect.fail(
									new InvalidParamsError({
										method: 'setAccount',
										params,
										message: `Invalid hex in storage value for key '${key}': contains non-hexadecimal characters`,
									})
								)
							}
							/* c8 ignore stop */
							const keyBytes = new Uint8Array(32)
							const valueBytes = new Uint8Array(32)

							const normalizedKey = keyHex.padStart(64, '0')
							const normalizedValue = valueHex.padStart(64, '0')

							for (let i = 0; i < 32; i++) {
								keyBytes[i] = parseInt(normalizedKey.substring(i * 2, i * 2 + 2), 16)
								valueBytes[i] = parseInt(normalizedValue.substring(i * 2, i * 2 + 2), 16)
							}

							yield* stateManager.putStorage(ethjsAddress, keyBytes, valueBytes).pipe(
								Effect.mapError(
									(e) =>
										new InternalError({
											message: `Failed to put storage: ${/** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e).message : String(e)}`,
											cause: /** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e) : undefined,
										})
								)
							)
						}
					}

					// Commit on success
					yield* stateManager.commit().pipe(
						Effect.mapError(
							(e) =>
								new InternalError({
									message: `Failed to commit: ${/** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e).message : String(e)}`,
									cause: /** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e) : undefined,
								})
						)
					)

					return {
						// Return EIP-55 checksummed address (Issue #312 fix)
						address: /** @type {import('./types.js').Address} */ (normalizedAddress),
					}
				})

				// Use tapError to revert on any failure, then propagate the original error
				return yield* coreOperations.pipe(
					Effect.tapError(() =>
						// Suppress revert errors to preserve original error (RFC §6.3)
						stateManager.revert().pipe(Effect.catchAll(() => Effect.void))
					)
				)
			}),

		/**
		 * Get balance implementation using the provided stateManager
		 * @param {import('@tevm/actions-effect').GetBalanceParams} params
		 * @returns {import('effect').Effect.Effect<bigint, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError>}
		 */
		getBalance: (params) =>
			Effect.gen(function* () {
				// Validate address with EIP-55 checksum support (Issue #312 fix)
				if (!params.address) {
					return yield* Effect.fail(
						new InvalidParamsError({
							method: 'getBalance',
							params,
							message: 'Missing address parameter',
						})
					)
				}

				// Validate EIP-55 checksum for mixed-case addresses
				const addressValidation = yield* Effect.tryPromise({
					try: () => validateAddressWithChecksum(params.address),
					catch: (e) =>
						new InternalError({
							message: `Address validation failed: ${/** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e).message : String(e)}`,
							cause: /** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e) : undefined,
						}),
				})

				if (!addressValidation.valid) {
					return yield* Effect.fail(
						new InvalidParamsError({
							method: 'getBalance',
							params,
							message: addressValidation.error || `Invalid address: ${params.address}`,
						})
					)
				}

				// Use the checksummed address for internal operations
				const normalizedAddress = addressValidation.checksumAddress || params.address
				const ethjsAddress = yield* Effect.tryPromise({
					try: () => createEthjsAddress(normalizedAddress.toLowerCase()),
					catch: (e) =>
						new InternalError({
							message: `Failed to create address: ${/** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e).message : String(e)}`,
							cause: /** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e) : undefined,
						}),
				})

				const account = yield* stateManager.getAccount(ethjsAddress).pipe(
					Effect.mapError(
						(e) =>
							new InternalError({
								message: `Failed to get account: ${/** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e).message : String(e)}`,
								cause: /** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e) : undefined,
							})
					)
				)

				return account?.balance ?? 0n
			}),

		/**
		 * Get code implementation using the provided stateManager
		 * @param {import('@tevm/actions-effect').GetCodeParams} params
		 * @returns {import('effect').Effect.Effect<import('./types.js').Hex, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError>}
		 */
		getCode: (params) =>
			Effect.gen(function* () {
				// Validate address with EIP-55 checksum support (Issue #312 fix)
				if (!params.address) {
					return yield* Effect.fail(
						new InvalidParamsError({
							method: 'getCode',
							params,
							message: 'Missing address parameter',
						})
					)
				}

				// Validate EIP-55 checksum for mixed-case addresses
				const addressValidation = yield* Effect.tryPromise({
					try: () => validateAddressWithChecksum(params.address),
					catch: (e) =>
						new InternalError({
							message: `Address validation failed: ${/** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e).message : String(e)}`,
							cause: /** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e) : undefined,
						}),
				})

				if (!addressValidation.valid) {
					return yield* Effect.fail(
						new InvalidParamsError({
							method: 'getCode',
							params,
							message: addressValidation.error || `Invalid address: ${params.address}`,
						})
					)
				}

				// Use the checksummed address for internal operations
				const normalizedAddress = addressValidation.checksumAddress || params.address
				const ethjsAddress = yield* Effect.tryPromise({
					try: () => createEthjsAddress(normalizedAddress.toLowerCase()),
					catch: (e) =>
						new InternalError({
							message: `Failed to create address: ${/** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e).message : String(e)}`,
							cause: /** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e) : undefined,
						}),
				})

				const code = yield* stateManager.getCode(ethjsAddress).pipe(
					Effect.mapError(
						(e) =>
							new InternalError({
								message: `Failed to get code: ${/** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e).message : String(e)}`,
								cause: /** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e) : undefined,
							})
					)
				)

				return bytesToHex(code)
			}),

		/**
		 * Get storage at implementation using the provided stateManager
		 * @param {import('@tevm/actions-effect').GetStorageAtParams} params
		 * @returns {import('effect').Effect.Effect<import('./types.js').Hex, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError>}
		 */
		getStorageAt: (params) =>
			Effect.gen(function* () {
				// Validate address with EIP-55 checksum support (Issue #312 fix)
				if (!params.address) {
					return yield* Effect.fail(
						new InvalidParamsError({
							method: 'getStorageAt',
							params,
							message: 'Missing address parameter',
						})
					)
				}

				// Validate EIP-55 checksum for mixed-case addresses
				const addressValidation = yield* Effect.tryPromise({
					try: () => validateAddressWithChecksum(params.address),
					catch: (e) =>
						new InternalError({
							message: `Address validation failed: ${/** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e).message : String(e)}`,
							cause: /** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e) : undefined,
						}),
				})

				if (!addressValidation.valid) {
					return yield* Effect.fail(
						new InvalidParamsError({
							method: 'getStorageAt',
							params,
							message: addressValidation.error || `Invalid address: ${params.address}`,
						})
					)
				}

				// Validate position (presence and type)
				if (params.position === undefined || typeof params.position !== 'string') {
					return yield* Effect.fail(
						new InvalidParamsError({
							method: 'getStorageAt',
							params,
							message: params.position === undefined
								? 'Missing required field: position'
								: `Invalid position: expected hex string, got ${typeof params.position}`,
						})
					)
				}

				// Use the checksummed address for internal operations
				const normalizedAddress = addressValidation.checksumAddress || params.address
				const ethjsAddress = yield* Effect.tryPromise({
					try: () => createEthjsAddress(normalizedAddress.toLowerCase()),
					catch: (e) =>
						new InternalError({
							message: `Failed to create address: ${/** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e).message : String(e)}`,
							cause: /** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e) : undefined,
						}),
				})

				// Convert position to bytes
				const positionHex = params.position.startsWith('0x')
					? params.position.slice(2)
					: params.position
				// Validate hex characters BEFORE parsing to prevent silent data corruption (Issue #305 fix)
				/* c8 ignore start - defensive validation for corrupt input */
				if (!isValidHex(positionHex)) {
					return yield* Effect.fail(
						new InvalidParamsError({
							method: 'getStorageAt',
							params,
							message: `Invalid hex in position: contains non-hexadecimal characters`,
						})
					)
				}
				/* c8 ignore stop */
				const normalizedHex = positionHex.length % 2 === 1 ? '0' + positionHex : positionHex
				const positionBytes = new Uint8Array(32)
				const paddedHex = normalizedHex.padStart(64, '0')
				for (let i = 0; i < 32; i++) {
					positionBytes[i] = parseInt(paddedHex.substring(i * 2, i * 2 + 2), 16)
				}

				const storage = yield* stateManager.getStorage(ethjsAddress, positionBytes).pipe(
					Effect.mapError(
						(e) =>
							new InternalError({
								message: `Failed to get storage: ${/** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e).message : String(e)}`,
								cause: /** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e) : undefined,
							})
					)
				)

				// Validate storage length does not exceed 32 bytes (Issue #297)
				// Ethereum storage slots are exactly 32 bytes, so anything larger indicates corrupted state
				if (storage.length > 32) {
					return yield* Effect.fail(
						new InternalError({
							message: `Storage value exceeds 32 bytes (got ${storage.length} bytes). This indicates corrupted state data.`,
						})
					)
				}

				// Pad storage to 32 bytes for consistent return
				const paddedStorage = new Uint8Array(32)
				paddedStorage.set(storage, 32 - storage.length)
				return bytesToHex(paddedStorage)
			}),
	}
}

/**
 * Creates the MemoryClientShape factory function
 * @param {Object} deps - Dependencies
 * @param {import('@tevm/state-effect').StateManagerShape} deps.stateManager
 * @param {import('@tevm/vm-effect').VmShape} deps.vm
 * @param {import('@tevm/common-effect').CommonShape} deps.common
 * @param {import('@tevm/node-effect').SnapshotShape} deps.snapshotService
 * @param {Ref.Ref<boolean>} deps.readyRef
 * @returns {import('./types.js').MemoryClientShape}
 */
const createMemoryClientShape = (deps) => {
	const {
		stateManager,
		vm,
		common,
		snapshotService,
		readyRef,
	} = deps

	// Create action services bound to THIS stateManager instance
	// This ensures deepCopy creates services that operate on the copied state
	const actionServices = createActionServices(stateManager)

	return {
		ready: Ref.get(readyRef),

		getBlockNumber: Effect.gen(function* () {
			// Access the underlying VM's blockchain to get the canonical head block
			// VmShape doesn't expose getBlock() directly - use vm.vm.blockchain
			const block = yield* Effect.tryPromise({
				try: () => vm.vm.blockchain.getCanonicalHeadBlock(),
				catch: (e) =>
					new InternalError({
						message: `Failed to get canonical head block: ${/** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e).message : String(e)}`,
						cause: /** @type {unknown} */ (e) instanceof Error ? /** @type {Error} */ (e) : undefined,
					}),
			})
			return block.header.number
		}),

		getChainId: Effect.succeed(BigInt(common.chainId)),

		getAccount: (params) => actionServices.getAccount(params),

		setAccount: (params) => actionServices.setAccount(params),

		getBalance: (params) => actionServices.getBalance(params),

		getCode: (params) => actionServices.getCode(params),

		getStorageAt: (params) => actionServices.getStorageAt(params),

		takeSnapshot: () => snapshotService.takeSnapshot(),

		revertToSnapshot: (snapshotId) => snapshotService.revertToSnapshot(snapshotId),

		/**
		 * Create a deep copy of the memory client.
		 *
		 * **IMPORTANT**: This method creates a consistent copy where:
		 * - All action methods (getAccount, setAccount, etc.) operate on the copied stateManager
		 * - The VM is separately deep-copied and has its own internal stateManager
		 *
		 * **STATE MANAGER CONSISTENCY NOTE**:
		 * After deepCopy, the action services use `stateManagerCopy`, while `vmCopy.vm.stateManager`
		 * is a separate copy created during VM.deepCopy(). For consistent behavior:
		 * - Use action methods (getAccount, setAccount, getBalance, etc.) for state operations
		 * - Avoid direct access to `vm.vm.stateManager` after deepCopy
		 *
		 * If you need direct VM operations with synchronized state, consider:
		 * 1. Using the action services exclusively
		 * 2. Creating snapshots and reverting instead of deepCopy
		 */
		deepCopy: () =>
			Effect.gen(function* () {
				// Create deep copies of all state
				// NOTE: stateManagerCopy and vmCopy.vm.stateManager are DIFFERENT instances
				// because VM.deepCopy() creates its own copy of the stateManager internally.
				// Action services are bound to stateManagerCopy for consistency.
				const stateManagerCopy = yield* stateManager.deepCopy()
				const vmCopy = yield* vm.deepCopy()
				// CRITICAL: Pass the copied stateManager to snapshotService.deepCopy() so that
				// snapshot operations (takeSnapshot, revertToSnapshot) operate on the copied state,
				// not the original state manager. (Issue #233, #234 fix)
				const snapshotCopy = yield* snapshotService.deepCopy(stateManagerCopy)
				const currentReady = yield* Ref.get(readyRef)
				const newReadyRef = yield* Ref.make(currentReady)

				// Deep copy common to prevent shared mutable state (RFC §5.4)
				// CommonShape has a copy() method that creates an independent copy
				const commonCopy = {
					common: common.copy(),
					chainId: common.chainId,
					hardfork: common.hardfork,
					eips: common.eips,
					// CRITICAL FIX: Bind copy to the new common, not the original
					// Using arrow function to ensure copy() operates on commonCopy.common
					copy: () => commonCopy.common.copy(),
				}

				// Return new shape with copied state
				// Action services will be recreated with the new stateManagerCopy
				return createMemoryClientShape({
					stateManager: stateManagerCopy,
					vm: vmCopy,
					common: commonCopy,
					snapshotService: snapshotCopy,
					readyRef: newReadyRef,
				})
			}),

		dispose: Effect.sync(() => {
			// Cleanup resources if needed
		}),
	}
}

/**
 * Creates a live layer for the MemoryClientService.
 *
 * This layer composes all underlying TEVM Effect services:
 * - StateManagerService: Account state management
 * - VmService: EVM execution
 * - CommonService: Chain configuration
 * - SnapshotService: State snapshot/restore
 *
 * Action services (getAccount, setAccount, getBalance, getCode, getStorageAt) are
 * created inline and bound to the StateManagerShape. This ensures deepCopy creates
 * services that properly operate on the copied state.
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { MemoryClientService, MemoryClientLive } from '@tevm/memory-client-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 * import { VmLive } from '@tevm/vm-effect'
 * import { CommonFromConfig } from '@tevm/common-effect'
 * import { BlockchainLocal } from '@tevm/blockchain-effect'
 * import { EvmLive } from '@tevm/evm-effect'
 *
 * // Compose layers - VmLive requires CommonService, StateManagerService, BlockchainService, EvmService
 * const commonLayer = CommonFromConfig({ chainId: 1, hardfork: 'prague' })
 * const stateLayer = Layer.provide(StateManagerLocal(), commonLayer)
 * const blockchainLayer = Layer.provide(BlockchainLocal(), commonLayer)
 * const evmLayer = Layer.provide(EvmLive(), Layer.mergeAll(stateLayer, blockchainLayer, commonLayer))
 * const vmLayer = Layer.provide(VmLive(), Layer.mergeAll(evmLayer, stateLayer, blockchainLayer, commonLayer))
 * // ... compose remaining layers
 *
 * const program = Effect.gen(function* () {
 *   const client = yield* MemoryClientService
 *   yield* client.ready
 *   return yield* client.getBlockNumber
 * })
 *
 * await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
 * ```
 *
 * @returns {Layer.Layer<
 *   MemoryClientService,
 *   never,
 *   StateManagerService | VmService | CommonService | SnapshotService
 * >}
 */
export const MemoryClientLive = Layer.effect(
	MemoryClientService,
	Effect.gen(function* () {
		// Get all required services
		const stateManager = yield* StateManagerService
		const vm = yield* VmService
		const common = yield* CommonService
		const snapshotService = yield* SnapshotService

		// Create ready state ref
		const readyRef = yield* Ref.make(true)

		// Create and return the client shape
		// Action services are created inline using createActionServices
		return createMemoryClientShape({
			stateManager,
			vm,
			common,
			snapshotService,
			readyRef,
		})
	})
)
