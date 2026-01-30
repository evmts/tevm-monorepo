/**
 * @module @tevm/decorators-effect/RequestLive
 * Live implementation of the Request service for EIP-1193
 */

import { Effect, Layer } from 'effect'
import { RequestService } from './RequestService.js'
import { EthActionsService } from './EthActionsService.js'
import { TevmActionsService } from './TevmActionsService.js'
import { InvalidParamsError, MethodNotFoundError } from '@tevm/errors-effect'

/**
 * Live implementation of RequestService.
 *
 * Provides EIP-1193 compatible request handling by routing
 * JSON-RPC methods to the appropriate action services.
 *
 * Supports:
 * - Standard Ethereum methods (eth_*)
 * - TEVM-specific methods (tevm_*)
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { RequestService, RequestLive } from '@tevm/decorators-effect'
 * import { EthActionsLive } from './EthActionsLive.js'
 * import { TevmActionsLive } from './TevmActionsLive.js'
 *
 * const layer = RequestLive.pipe(
 *   Layer.provide(EthActionsLive),
 *   Layer.provide(TevmActionsLive)
 * )
 *
 * const program = Effect.gen(function* () {
 *   const requestService = yield* RequestService
 *   return yield* requestService.request({
 *     method: 'eth_blockNumber',
 *     params: []
 *   })
 * })
 *
 * await Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 *
 */
export const RequestLive = /** @type {Layer.Layer<import('./RequestService.js').RequestServiceId, never, any>} */ (Layer.effect(
	RequestService,
	Effect.gen(function* () {
		const ethActions = yield* EthActionsService
		const tevmActions = yield* TevmActionsService

		return /** @type {import('./types.js').RequestServiceShape} */ ({
			/**
			 * @template T
			 * @param {import('./types.js').Eip1193RequestParams} params
			 * @returns {import('effect').Effect.Effect<T, import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError | import('@tevm/errors-effect').MethodNotFoundError, never>}
			 */
			request: (params) =>
				Effect.gen(function* () {
					const { method, params: rpcParams = [] } = params

					switch (method) {
						// Ethereum methods
						case 'eth_blockNumber': {
							const result = yield* ethActions.blockNumber()
							return /** @type {T} */ (`0x${result.toString(16)}`)
						}

						case 'eth_chainId': {
							const result = yield* ethActions.chainId()
							return /** @type {T} */ (`0x${result.toString(16)}`)
						}

						case 'eth_gasPrice': {
							const result = yield* ethActions.gasPrice()
							return /** @type {T} */ (`0x${result.toString(16)}`)
						}

						case 'eth_call': {
							const [callParams] = /** @type {[any]} */ (rpcParams)
							if (!callParams) {
								return yield* Effect.fail(
									new InvalidParamsError({
										method: 'eth_call',
										params: rpcParams,
										message: 'Missing call parameters',
									})
								)
							}
							const result = yield* ethActions.call(callParams)
							return /** @type {T} */ (result)
						}

						case 'eth_getBalance': {
							const [address, blockTag] = /** @type {[string, string | undefined]} */ (rpcParams)
							if (!address) {
								return yield* Effect.fail(
									new InvalidParamsError({
										method: 'eth_getBalance',
										params: rpcParams,
										message: 'Missing address parameter',
									})
								)
							}
							const result = yield* ethActions.getBalance({
								address: /** @type {import('./types.js').Address} */ (address),
								...(blockTag !== undefined && { blockTag: /** @type {import('./types.js').BlockParam} */ (blockTag) }),
							})
							return /** @type {T} */ (`0x${result.toString(16)}`)
						}

						case 'eth_getCode': {
							const [address, blockTag] = /** @type {[string, string | undefined]} */ (rpcParams)
							if (!address) {
								return yield* Effect.fail(
									new InvalidParamsError({
										method: 'eth_getCode',
										params: rpcParams,
										message: 'Missing address parameter',
									})
								)
							}
							const result = yield* ethActions.getCode({
								address: /** @type {import('./types.js').Address} */ (address),
								...(blockTag !== undefined && { blockTag: /** @type {import('./types.js').BlockParam} */ (blockTag) }),
							})
							return /** @type {T} */ (result)
						}

						case 'eth_getStorageAt': {
							const [address, position, blockTag] = /** @type {[string, string, string | undefined]} */ (rpcParams)
							if (!address || position === undefined) {
								return yield* Effect.fail(
									new InvalidParamsError({
										method: 'eth_getStorageAt',
										params: rpcParams,
										message: 'Missing address or position parameter',
									})
								)
							}
							const result = yield* ethActions.getStorageAt({
								address: /** @type {import('./types.js').Address} */ (address),
								position: /** @type {import('./types.js').Hex} */ (position),
								...(blockTag !== undefined && { blockTag: /** @type {import('./types.js').BlockParam} */ (blockTag) }),
							})
							return /** @type {T} */ (result)
						}

						// TEVM methods
						case 'tevm_getAccount': {
							const [accountParams] = /** @type {[any]} */ (rpcParams)
							if (!accountParams?.address) {
								return yield* Effect.fail(
									new InvalidParamsError({
										method: 'tevm_getAccount',
										params: rpcParams,
										message: 'Missing address parameter',
									})
								)
							}
							const result = yield* tevmActions.getAccount(accountParams)
							return /** @type {T} */ (result)
						}

						case 'tevm_setAccount': {
							const [accountParams] = /** @type {[any]} */ (rpcParams)
							if (!accountParams?.address) {
								return yield* Effect.fail(
									new InvalidParamsError({
										method: 'tevm_setAccount',
										params: rpcParams,
										message: 'Missing address parameter',
									})
								)
							}
							const result = yield* tevmActions.setAccount(accountParams)
							return /** @type {T} */ (result)
						}

						case 'tevm_call': {
							const [callParams] = /** @type {[any]} */ (rpcParams)
							const result = yield* tevmActions.call(callParams ?? {})
							return /** @type {T} */ (result)
						}

						case 'tevm_dumpState': {
							const result = yield* tevmActions.dumpState()
							return /** @type {T} */ (result)
						}

						case 'tevm_loadState': {
							const [state] = /** @type {[string]} */ (rpcParams)
							if (!state) {
								return yield* Effect.fail(
									new InvalidParamsError({
										method: 'tevm_loadState',
										params: rpcParams,
										message: 'Missing state parameter',
									})
								)
							}
							yield* tevmActions.loadState(state)
							return /** @type {T} */ (null)
						}

						case 'anvil_mine':
						case 'evm_mine': {
							const [blocksHex] = /** @type {[string]} */ (rpcParams)
							// Use Number() to handle both decimal ("5") and hex ("0x5") formats
							const blocks = blocksHex ? Number(blocksHex) : 1
							yield* tevmActions.mine({ blocks })
							return /** @type {T} */ (null)
						}

						default:
							return yield* Effect.fail(
								new MethodNotFoundError({
									method,
									message: `Unsupported method: ${method}`,
								})
							)
					}
				}),
		})
	})
))
