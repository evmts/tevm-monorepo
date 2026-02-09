/**
 * @module @tevm/decorators-effect/TevmActionsLive
 * Live implementation of the TevmActions service
 */

import { GetAccountService, SetAccountService } from '@tevm/actions-effect'
import { InternalError, InvalidParamsError } from '@tevm/errors-effect'
import { StateManagerService } from '@tevm/state-effect'
import { VmService } from '@tevm/vm-effect'
import { Effect, Layer } from 'effect'
import { TevmActionsService } from './TevmActionsService.js'

/**
 * Live implementation of TevmActionsService.
 *
 * Provides Effect-based wrappers around TEVM-specific operations.
 * This layer depends on:
 * - StateManagerService for state access
 * - VmService for execution
 * - GetAccountService for account queries
 * - SetAccountService for account mutations
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { TevmActionsService, TevmActionsLive } from '@tevm/decorators-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 * import { VmLive } from '@tevm/vm-effect'
 *
 * const layer = TevmActionsLive.pipe(
 *   Layer.provide(StateManagerLocal()),
 *   Layer.provide(VmLive())
 * )
 *
 * const program = Effect.gen(function* () {
 *   const tevmActions = yield* TevmActionsService
 *   return yield* tevmActions.getAccount({
 *     address: '0x1234567890123456789012345678901234567890'
 *   })
 * })
 *
 * await Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 *
 */
export const TevmActionsLive =
	/** @type {Layer.Layer<import('./TevmActionsService.js').TevmActionsServiceId, never, import('@tevm/state-effect').StateManagerService | import('@tevm/vm-effect').VmService | import('@tevm/actions-effect').GetAccountService | import('@tevm/actions-effect').SetAccountService>} */ (
		Layer.effect(
			TevmActionsService,
			Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				const vm = yield* VmService
				const getAccountService = yield* GetAccountService
				const setAccountService = yield* SetAccountService

				/**
				 * Converts hex string to bytes with validation
				 * @param {string | undefined} hex
				 * @returns {Uint8Array}
				 * @throws {Error} If hex string contains invalid characters
				 */
				const hexToBytes = (/** @type {string | undefined} */ hex) => {
					if (!hex || hex === '0x') return new Uint8Array()
					const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex
					// Validate hex characters before processing
					if (!/^[0-9a-fA-F]*$/.test(cleanHex)) {
						throw new Error(`Invalid hex string: contains non-hex characters in "${hex}"`)
					}
					const normalizedHex = cleanHex.length % 2 === 1 ? `0${cleanHex}` : cleanHex
					const bytes = new Uint8Array(normalizedHex.length / 2)
					for (let i = 0; i < bytes.length; i++) {
						bytes[i] = parseInt(normalizedHex.substring(i * 2, i * 2 + 2), 16)
					}
					return bytes
				}

				/**
				 * Converts bytes to hex string (browser-compatible implementation)
				 * @param {Uint8Array} bytes
				 * @returns {string}
				 */
				const bytesToHex = (bytes) => {
					if (!bytes || bytes.length === 0) return '0x'
					let hex = '0x'
					for (let i = 0; i < bytes.length; i++) {
						const byte = bytes[i]
						if (byte !== undefined) {
							hex += byte.toString(16).padStart(2, '0')
						}
					}
					return hex
				}

				return /** @type {import('./types.js').TevmActionsShape} */ ({
					call: (params) =>
						Effect.gen(function* () {
							// Execute call using EVM's runCall directly for simulation
							// This doesn't require a signed transaction - it's a stateless call
							const { createAddress } = yield* Effect.tryPromise({
								try: () => import('@tevm/address'),
								catch: (e) =>
									new InternalError({
										message: `Failed to import @tevm/address: ${e instanceof Error ? e.message : String(e)}`,
										cause: e instanceof Error ? e : undefined,
									}),
							})

							// Prepare call options for EVM runCall
							// Wrap hexToBytes in Effect.try to capture validation errors (Issue #268 fix)
							const data = yield* Effect.try({
								try: () => hexToBytes(params.data),
								catch: (e) =>
									new InvalidParamsError({
										message: `Invalid 'data' hex: ${e instanceof Error ? e.message : String(e)}`,
										method: 'tevm_call',
										cause: e instanceof Error ? e : undefined,
									}),
							})

							/** @type {Record<string, unknown>} */
							const callOpts = {
								data,
								gasLimit: params.gas ?? 30000000n,
								gasPrice: params.gasPrice ?? 0n,
								value: params.value ?? 0n,
							}
							// Wrap createAddress calls in Effect.try to capture validation errors (Issue #163)
							if (params.to) {
								callOpts['to'] = yield* Effect.try({
									try: () => createAddress(params.to),
									catch: (e) =>
										new InvalidParamsError({
											message: `Invalid 'to' address: ${e instanceof Error ? e.message : String(e)}`,
											method: 'tevm_call',
											cause: e instanceof Error ? e : undefined,
										}),
								})
							}
							if (params.from) {
								const fromAddress = yield* Effect.try({
									try: () => createAddress(params.from),
									catch: (e) =>
										new InvalidParamsError({
											message: `Invalid 'from' address: ${e instanceof Error ? e.message : String(e)}`,
											method: 'tevm_call',
											cause: e instanceof Error ? e : undefined,
										}),
								})
								callOpts['caller'] = fromAddress
								callOpts['origin'] = fromAddress
							}

							const result = yield* Effect.tryPromise({
								try: () => vm.vm.evm.runCall(/** @type {any} */ (callOpts)),
								catch: (e) =>
									new InternalError({
										message: `tevm_call failed: ${e instanceof Error ? e.message : String(e)}`,
										cause: e instanceof Error ? e : undefined,
									}),
							})

							const execResult = result.execResult ?? {}
							return {
								rawData: bytesToHex(execResult.returnValue ?? new Uint8Array()),
								executionGasUsed: execResult.executionGasUsed ?? 0n,
								gas: execResult.gas ?? 0n,
								createdAddress: result.createdAddress?.toString(),
								exceptionError: execResult.exceptionError?.error,
							}
						}),

					getAccount: (params) =>
						getAccountService.getAccount(params).pipe(
							Effect.map((result) => ({
								address: result.address,
								nonce: result.nonce,
								balance: result.balance,
								deployedBytecode: result.deployedBytecode,
								storageRoot: result.storageRoot,
								codeHash: result.codeHash,
								isContract: result.isContract,
								isEmpty: result.isEmpty,
								storage: result.storage,
							})),
						),

					setAccount: (params) =>
						setAccountService.setAccount(params).pipe(
							Effect.map((result) => ({
								address: result.address,
							})),
						),

					dumpState: () =>
						Effect.gen(function* () {
							// Get full state from StateManager (returns TevmState with BigInt values)
							const rawState = yield* stateManager.dumpState().pipe(
								Effect.mapError(
									(e) =>
										new InternalError({
											message: `Failed to dump state: ${e instanceof Error ? e.message : String(e)}`,
											cause: e instanceof Error ? e : undefined,
										}),
								),
							)

							// Serialize TevmState: convert BigInt values to hex strings for JSON transport
							/** @type {Record<string, object>} */
							const serializedState = {}
							for (const [address, account] of Object.entries(rawState)) {
								/** @type {Record<string, unknown>} */
								const serializedAccount = {
									nonce: `0x${account.nonce.toString(16)}`,
									balance: `0x${account.balance.toString(16)}`,
									storageRoot: account.storageRoot,
									codeHash: account.codeHash,
								}
								if (account['deployedBytecode']) {
									serializedAccount['deployedBytecode'] = account['deployedBytecode']
								}
								if (account['storage']) {
									serializedAccount['storage'] = account['storage']
								}
								serializedState[address] = serializedAccount
							}

							return JSON.stringify({ state: serializedState })
						}),

					loadState: (stateJson) =>
						Effect.gen(function* () {
							// Parse the JSON string to get SerializableTevmState
							let parsed
							try {
								parsed = JSON.parse(stateJson)
							} catch (e) {
								yield* Effect.fail(
									new InternalError({
										message: `Failed to parse state JSON: ${e instanceof Error ? e.message : String(e)}`,
										cause: e instanceof Error ? e : undefined,
									}),
								)
								return
							}

							const serializedState = parsed.state || parsed

							// Deserialize: convert hex strings back to BigInt values
							// Wrap BigInt conversions in Effect.try to handle invalid hex strings (Issue #P4-379 fix)
							/** @type {Record<string, {nonce: bigint, balance: bigint, storageRoot: string, codeHash: string, deployedBytecode?: string, storage?: Record<string, string>}>} */
							const tevmState = {}
							for (const [address, account] of Object.entries(serializedState)) {
								const acct =
									/** @type {{nonce?: string, balance?: string, storageRoot?: string, codeHash?: string, deployedBytecode?: string, storage?: Record<string, string>}} */ (
										account
									)
								// Convert nonce with error handling for invalid hex (Issue #P4-379 fix)
								const nonce = yield* Effect.try({
									try: () => BigInt(acct.nonce ?? '0x0'),
									catch: (e) =>
										new InternalError({
											message: `Failed to convert nonce to BigInt for ${address}: ${e instanceof Error ? e.message : String(e)}`,
											cause: e instanceof Error ? e : undefined,
										}),
								})
								// Convert balance with error handling for invalid hex (Issue #P4-379 fix)
								const balance = yield* Effect.try({
									try: () => BigInt(acct.balance ?? '0x0'),
									catch: (e) =>
										new InternalError({
											message: `Failed to convert balance to BigInt for ${address}: ${e instanceof Error ? e.message : String(e)}`,
											cause: e instanceof Error ? e : undefined,
										}),
								})
								tevmState[address] = {
									// Use default values if nonce/balance are undefined (Issue #76 fix)
									nonce,
									balance,
									storageRoot: acct.storageRoot ?? '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
									codeHash: acct.codeHash ?? '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
									...(acct.deployedBytecode && { deployedBytecode: acct.deployedBytecode }),
									...(acct.storage && { storage: acct.storage }),
								}
							}

							yield* stateManager.loadState(tevmState).pipe(
								Effect.mapError(
									(e) =>
										new InternalError({
											message: `Failed to load state: ${e instanceof Error ? e.message : String(e)}`,
											cause: e instanceof Error ? e : undefined,
										}),
								),
							)
						}),

					mine: (options = {}) =>
						Effect.gen(function* () {
							const blocks = options.blocks ?? 1

							// Validate blocks parameter (Issue #74 fix)
							if (typeof blocks !== 'number' || !Number.isInteger(blocks) || blocks < 0) {
								return yield* Effect.fail(
									new InvalidParamsError({
										message: `Invalid blocks parameter: expected non-negative integer, got ${blocks}`,
									}),
								)
							}
							// Reasonable upper bound to prevent accidental DoS
							if (blocks > 1000) {
								return yield* Effect.fail(
									new InvalidParamsError({
										message: `blocks parameter too large: ${blocks} (max 1000)`,
									}),
								)
							}

							// Capture current time once outside the loop to ensure strictly increasing timestamps
							const currentTime = BigInt(Math.floor(Date.now() / 1000))

							for (let i = 0; i < blocks; i++) {
								// Get current block for timestamp calculation
								const currentBlock = yield* Effect.tryPromise({
									try: () => vm.vm.blockchain.getCanonicalHeadBlock(),
									catch: (e) =>
										new InternalError({
											message: `Failed to get current block: ${e instanceof Error ? e.message : String(e)}`,
											cause: e instanceof Error ? e : undefined,
										}),
								})

								// Ensure timestamp is greater than parent block's timestamp to satisfy Ethereum consensus rules
								// This handles forked chains or test setups where parent may have a future timestamp (Issue #58 fix)
								const parentTimestamp = currentBlock.header.timestamp
								const baseTimestamp = parentTimestamp >= currentTime ? parentTimestamp + 1n : currentTime
								const timestamp = baseTimestamp + BigInt(i)
								const blockNumber = currentBlock.header.number + 1n

								// Build a new block using the VM's buildBlock method
								const blockBuilder = yield* Effect.tryPromise({
									try: () =>
										vm.vm.buildBlock({
											parentBlock: currentBlock,
											headerData: {
												timestamp,
												number: blockNumber,
											},
											blockOpts: {
												putBlockIntoBlockchain: false,
												common: vm.vm.common,
											},
										}),
									catch: (e) =>
										new InternalError({
											message: `Failed to build block: ${e instanceof Error ? e.message : String(e)}`,
											cause: e instanceof Error ? e : undefined,
										}),
								})

								// Build and finalize the block
								const block = yield* Effect.tryPromise({
									try: () => blockBuilder.build(),
									catch: (e) =>
										new InternalError({
											message: `Failed to finalize block: ${e instanceof Error ? e.message : String(e)}`,
											cause: e instanceof Error ? e : undefined,
										}),
								})

								// Put the block into the blockchain
								yield* Effect.tryPromise({
									try: () => vm.vm.blockchain.putBlock(block),
									catch: (e) =>
										new InternalError({
											message: `Failed to put block into blockchain: ${e instanceof Error ? e.message : String(e)}`,
											cause: e instanceof Error ? e : undefined,
										}),
								})
							}
						}),
				})
			}),
		)
	)
