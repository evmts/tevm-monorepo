import { TransactionFactory } from '@tevm/tx'
import { callHandlerOpts } from './callHandlerOpts.js'
import { callHandlerResult } from './callHandlerResult.js'
import { maybeThrowOnFail } from './maybeThrowOnFail.js'
import { validateCallParams } from '@tevm/zod'
import { EthjsAddress, bytesToHex } from '@tevm/utils'

// TODO tevm_call should optionally take a signature too
const requireSig = false

/**
 * Creates an CallHandler for handling call params with Ethereumjs EVM
 * @param {import('@tevm/base-client').BaseClient} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail]
 * @returns {import('@tevm/actions-types').CallHandler}
 */
export const callHandler =
	(client, { throwOnFail: defaultThrowOnFail = true } = {}) =>
		async (params) => {
			/**
			 * @type {import('@tevm/vm').TevmVm}
			 */
			let copiedVm

			const vm = await client.getVm()

			try {
				copiedVm = params.createTransaction ? vm : await vm.deepCopy()
			} catch (e) {
				return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
					errors: [
						{
							name: 'UnexpectedError',
							_tag: 'UnexpectedError',
							message:
								typeof e === 'string'
									? e
									: e instanceof Error
										? e.message
										: 'unknown error',
						},
					],
					executionGasUsed: 0n,
					rawData: '0x',
				})
			}

			const validationErrors = validateCallParams(params)
			if (validationErrors.length > 0) {
				return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
					errors: validationErrors,
					executionGasUsed: 0n,
					/**
					 * @type {`0x${string}`}
					 */
					rawData: '0x',
				})
			}

			/**
			 * @type {import('@tevm/utils').Hex | undefined}
			 */
			let txHash = undefined

			/**
			 * @type {import('@tevm/evm').EvmResult | undefined}
			 */
			let evmResult = undefined

			try {
				const { errors, data: opts } = await callHandlerOpts(client, params)
				if (errors ?? !opts) {
					return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
						errors: /** @type {import('@tevm/errors').CallError[]}*/ (errors),
						executionGasUsed: 0n,
						/**
						 * @type {`0x${string}`}
						 */
						rawData: '0x',
					})
				}
				evmResult = await copiedVm.evm.runCall(opts)
				if (params.createTransaction && !evmResult.execResult.exceptionError) {
					copiedVm.stateManager.checkpoint()
					copiedVm.stateManager.commit()
				}
			} catch (e) {
				return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
					errors: [
						{
							name: 'UnexpectedError',
							_tag: 'UnexpectedError',
							message:
								typeof e === 'string'
									? e
									: e instanceof Error
										? e.message
										: 'unknown error',
						},
					],
					executionGasUsed: 0n,
					/**
					 * @type {`0x${string}`}
					 */
					rawData: '0x',
				})
			}
			// Note there could be other errors when attempting to add to chain
			// We don't even need to try if this is false though.
			const shouldCreateTransaction = (() => {
				if (params.createTransaction === undefined) {
					return false
				}
				if (
					params.createTransaction === true ||
					params.createTransaction === 'always'
				) {
					return true
				}
				if (
					params.createTransaction === false ||
					params.createTransaction === 'never'
				) {
					return false
				}
				if (params.createTransaction === 'on-success') {
					return evmResult.execResult.exceptionError === undefined
				}
				/**
				 * @type {never} this typechecks that we've exhausted all cases
				 */
				const invalidOption = params.createTransaction
				throw new Error(`Invalid createTransaction value: ${invalidOption}`)
			})()

			if (shouldCreateTransaction) {
				const pool = await client.getTxPool()
				const { data: txOpts } = await callHandlerOpts(client, params)
				// TODO known bug here we should be allowing unlimited code size here based on user providing option
				// Just lazily not looking up how to get it from client.getVm().evm yet
				// Possible we need to make property public on client
				const tx = TransactionFactory.fromTxData(
					{
						// TODO tevm_call should take nonce
						// TODO should write tests that this works with multiple tx nonces
						nonce:
							(
								(await copiedVm.stateManager.getAccount(
									EthjsAddress.fromString(
										params.from ?? params.caller ?? `0x${'00'.repeat(20)}`,
									),
								)) ?? { nonce: 0n }
							).nonce + 1n,
						...txOpts
					},
					{
						allowUnlimitedInitCodeSize: false,
						common: copiedVm.common,
						freeze: true,
					},
				)
				// So we can `impersonate` accounts we need to hack the `hash()` method to always exist whether signed or unsigned
				// TODO we should be configuring tevm_call to sometimes only accept signed transactions
				const wrappedTx = new Proxy(tx, {
					get(target, prop) {
						if (prop === 'hash') {
							return () => {
								try {
									return target.hash()
								} catch (e) {
									return target.getHashedMessageToSign()
								}
							}
						}
						if (prop === 'isSigned') {
							return () => true
						}
						if (prop === 'getSenderAddress') {
							return () =>
								EthjsAddress.fromString(
									params.from ?? params.caller ?? `0x${'00'.repeat(20)}`,
								)
						}
						return Reflect.get(target, prop)
					},
				})
				try {
					pool.add(wrappedTx, requireSig, txOpts?.skipBalance ?? false)
					txHash = bytesToHex(wrappedTx.hash())
					await copiedVm.stateManager.checkpoint()
					await copiedVm.stateManager.commit()
				} catch (e) {
					pool.removeByHash(bytesToHex(tx.hash()))
					// don't expect this to ever happen at this point but being defensive
					await copiedVm.stateManager.revert()
					return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
						...callHandlerResult(evmResult),
						errors: [
							{
								name: 'UnexpectedError',
								_tag: 'UnexpectedError',
								message:
									typeof e === 'string'
										? e
										: e instanceof Error
											? e.message
											: 'unknown error',
							},
						],
						executionGasUsed: 0n,
						/**
						 * @type {`0x${string}`}
						 */
						rawData: '0x',
					})
				}
			} else {
				// we want to revert state manager if the transaction should NOT be added to chain
				// Don't bother though if the state manager is just a copy
				if (vm === copiedVm) {
					await copiedVm.stateManager.revert()
				}
			}
			return /** @type {any}*/ (
				maybeThrowOnFail(
					params.throwOnFail ?? defaultThrowOnFail,
					callHandlerResult(evmResult, txHash)
				)
			)
		}

