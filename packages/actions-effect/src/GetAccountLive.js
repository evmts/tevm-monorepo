import { InternalError, InvalidParamsError } from '@tevm/errors-effect'
import { StateManagerService } from '@tevm/state-effect'
import { Effect, Layer } from 'effect'
import { GetAccountService } from './GetAccountService.js'

/**
 * @module @tevm/actions-effect/GetAccountLive
 * @description Live implementation of the GetAccount service using StateManagerService
 */

/**
 * Empty code hash constant (keccak256 of empty bytes)
 * @type {`0x${string}`}
 */
const EMPTY_CODE_HASH = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'

/**
 * Empty storage root constant (keccak256 of RLP empty trie)
 * @type {`0x${string}`}
 */
const EMPTY_STORAGE_ROOT = '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'

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
const validateBlockTag = (blockTag, method = 'tevm_getAccount') =>
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
 * Validates that returnStorage is not enabled (not yet implemented)
 * @param {boolean} [returnStorage] - returnStorage parameter to validate
 * @param {string} method - Method name for error messages
 * @returns {import('effect').Effect.Effect<void, import('@tevm/errors-effect').InvalidParamsError, never>}
 */
const validateReturnStorage = (returnStorage, method = 'tevm_getAccount') =>
	Effect.gen(function* () {
		if (returnStorage === true) {
			return yield* Effect.fail(
				new InvalidParamsError({
					method,
					params: { returnStorage },
					message: `returnStorage: true is not yet implemented. This feature requires dumping the entire state and extracting storage for the address. Use eth_getStorageAt for individual storage slots instead.`,
				}),
			)
		}
	})

/**
 * Validates the address format
 * @param {string} address - Address to validate
 * @returns {import('effect').Effect.Effect<`0x${string}`, import('@tevm/errors-effect').InvalidParamsError, never>}
 */
const validateAddress = (address, method = 'tevm_getAccount') =>
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
 * Creates the GetAccount service implementation.
 *
 * This layer provides account query functionality using the StateManagerService.
 * It supports querying account balance, nonce, bytecode, and storage.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { GetAccountService, GetAccountLive } from '@tevm/actions-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 *
 * const program = Effect.gen(function* () {
 *   const { getAccount } = yield* GetAccountService
 *   const account = yield* getAccount({
 *     address: '0x1234567890123456789012345678901234567890'
 *   })
 *   return account
 * })
 *
 * // Compose layers
 * const AppLayer = GetAccountLive.pipe(
 *   Layer.provide(StateManagerLocal)
 * )
 *
 * Effect.runPromise(program.pipe(Effect.provide(AppLayer)))
 * ```
 */
export const GetAccountLive = Layer.effect(
	GetAccountService,
	Effect.gen(function* () {
		const stateManager = yield* StateManagerService

		return {
			/**
			 * @param {import('./types.js').GetAccountParams} params
			 */
			getAccount: (params) =>
				Effect.gen(function* () {
					// Validate address format
					const address = yield* validateAddress(params.address)

					// Validate blockTag - only 'latest' is supported
					yield* validateBlockTag(params.blockTag)

					// Validate returnStorage - not yet implemented, throws explicit error per RFC
					yield* validateReturnStorage(params.returnStorage)

					// Get account from state manager, wrapping errors as InternalError
					// EthjsAccount has: nonce (bigint), balance (bigint), storageRoot (Uint8Array), codeHash (Uint8Array)
					const ethjsAccount = yield* stateManager.getAccount(address).pipe(
						Effect.mapError(
							(e) =>
								new InternalError({
									message: `Failed to get account: ${e instanceof Error ? e.message : String(e)}`,
									meta: { address, operation: 'getAccount' },
									cause: e,
								}),
						),
					)

					// Get deployed bytecode, wrapping errors as InternalError
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
					const deployedBytecode = bytesToHex(code)

					// Determine if this is a contract
					const isContract = deployedBytecode !== '0x'

					// Handle case where account doesn't exist (returns undefined in ethereumjs)
					// For Ethereum, non-existent accounts are treated as empty accounts
					if (!ethjsAccount) {
						return {
							address,
							nonce: 0n,
							balance: 0n,
							deployedBytecode: '0x',
							storageRoot: EMPTY_STORAGE_ROOT,
							codeHash: EMPTY_CODE_HASH,
							isContract: false,
							isEmpty: true,
						}
					}

					// Extract values from EthjsAccount
					const nonce = ethjsAccount.nonce ?? 0n
					const balance = ethjsAccount.balance ?? 0n

					// Convert storageRoot and codeHash from Uint8Array to hex
					const storageRoot = ethjsAccount.storageRoot ? bytesToHex(ethjsAccount.storageRoot) : EMPTY_STORAGE_ROOT
					const codeHash = ethjsAccount.codeHash ? bytesToHex(ethjsAccount.codeHash) : EMPTY_CODE_HASH

					const isEmpty = nonce === 0n && balance === 0n && !isContract

					/** @type {import('./types.js').GetAccountSuccess} */
					const result = {
						address,
						nonce,
						balance,
						deployedBytecode,
						storageRoot,
						codeHash,
						isContract,
						isEmpty,
					}

					return result
				}),
		}
	}),
)
