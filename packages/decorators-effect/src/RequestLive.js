/**
 * @module @tevm/decorators-effect/RequestLive
 * Live implementation of the Request service for EIP-1193
 */

import { Effect, Layer } from 'effect'
import { RequestService } from './RequestService.js'
import { EthActionsService } from './EthActionsService.js'
import { TevmActionsService } from './TevmActionsService.js'
import { InternalError, InvalidParamsError } from '@tevm/errors-effect'

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
 * @type {Layer.Layer<RequestService, never, EthActionsService | TevmActionsService>}
 */
export const RequestLive = Layer.effect(
	RequestService,
	Effect.gen(function* () {
		const ethActions = yield* EthActionsService
		const tevmActions = yield* TevmActionsService

		return {
			request: (params) =>
				Effect.gen(function* () {
					const { method, params: rpcParams = [] } = params

					switch (method) {
						// Ethereum methods
						case 'eth_blockNumber': {
							const result = yield* ethActions.blockNumber()
							return `0x${result.toString(16)}`
						}

						case 'eth_chainId': {
							const result = yield* ethActions.chainId()
							return `0x${result.toString(16)}`
						}

						case 'eth_gasPrice': {
							const result = yield* ethActions.gasPrice()
							return `0x${result.toString(16)}`
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
							return result
						}

						case 'eth_getBalance': {
							const [address, blockTag] = /** @type {[string, string]} */ (rpcParams)
							if (!address) {
								return yield* Effect.fail(
									new InvalidParamsError({
										method: 'eth_getBalance',
										params: rpcParams,
										message: 'Missing address parameter',
									})
								)
							}
							const result = yield* ethActions.getBalance({ address, blockTag })
							return `0x${result.toString(16)}`
						}

						case 'eth_getCode': {
							const [address, blockTag] = /** @type {[string, string]} */ (rpcParams)
							if (!address) {
								return yield* Effect.fail(
									new InvalidParamsError({
										method: 'eth_getCode',
										params: rpcParams,
										message: 'Missing address parameter',
									})
								)
							}
							const result = yield* ethActions.getCode({ address, blockTag })
							return result
						}

						case 'eth_getStorageAt': {
							const [address, position, blockTag] = /** @type {[string, string, string]} */ (rpcParams)
							if (!address || position === undefined) {
								return yield* Effect.fail(
									new InvalidParamsError({
										method: 'eth_getStorageAt',
										params: rpcParams,
										message: 'Missing address or position parameter',
									})
								)
							}
							const result = yield* ethActions.getStorageAt({ address, position, blockTag })
							return result
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
							return result
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
							return result
						}

						case 'tevm_call': {
							const [callParams] = /** @type {[any]} */ (rpcParams)
							const result = yield* tevmActions.call(callParams ?? {})
							return result
						}

						case 'tevm_dumpState': {
							const result = yield* tevmActions.dumpState()
							return result
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
							return null
						}

						case 'anvil_mine':
						case 'evm_mine': {
							const [blocksHex] = /** @type {[string]} */ (rpcParams)
							const blocks = blocksHex ? parseInt(blocksHex, 16) : 1
							yield* tevmActions.mine({ blocks })
							return null
						}

						default:
							return yield* Effect.fail(
								new InvalidParamsError({
									method,
									params: rpcParams,
									message: `Unsupported method: ${method}`,
								})
							)
					}
				}),
		}
	})
)
