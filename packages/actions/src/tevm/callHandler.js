import { runCallWithTrace } from '../internal/runCallWithTrace.js'
import { callHandlerOpts } from './callHandlerOpts.js'
import { callHandlerResult } from './callHandlerResult.js'
import { maybeThrowOnFail } from './maybeThrowOnFail.js'
import { TransactionFactory } from '@tevm/tx'
import { EthjsAddress, bytesToHex } from '@tevm/utils'
import { validateCallParams } from '@tevm/zod'

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
		client.logger.debug(params, 'callHandler: Executing call with params')

		const validationErrors = validateCallParams(params)
		if (validationErrors.length > 0) {
			client.logger.debug(validationErrors, 'Params do not pass validation')
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
		 * @type {import('@tevm/vm').TevmVm}
		 */
		let copiedVm

		const vm = await client.getVm()

		try {
			client.logger.debug(
				params.createTransaction
					? 'Using existing vm to execute a new transaction'
					: 'Cloning vm to execute a call...',
			)
			copiedVm = params.createTransaction ? vm : await vm.deepCopy()
		} catch (e) {
			client.logger.error(e, 'callHandler: Unexpected error failed to clone vm')
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

		/**
		 * @type {import('@tevm/utils').Hex | undefined}
		 */
		let txHash = undefined

		/**
		 * @type {import('@tevm/evm').EvmResult | undefined}
		 */
		let evmResult = undefined
		/**
		 * @type {import('@tevm/actions-types').DebugTraceCallResult | undefined}
		 */
		let trace = undefined

		try {
			const { errors, data: opts } = await callHandlerOpts(client, params)
			if (errors ?? !opts) {
				client.logger.error(
					errors ?? opts,
					'callHandler: Unexpected error converting params to ethereumjs params',
				)
				return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
					errors: /** @type {import('@tevm/errors').CallError[]}*/ (errors),
					executionGasUsed: 0n,
					/**
					 * @type {`0x${string}`}
					 */
					rawData: '0x',
				})
			}

			client.logger.debug(opts, 'callHandler: Executing runCall with params')
			if (params.createTrace) {
				const { trace: _trace, ...res } = await runCallWithTrace(
					copiedVm,
					client.logger,
					opts,
				)
				evmResult = res
				trace = _trace
			} else {
				evmResult = await copiedVm.evm.runCall(opts)
			}

			if (params.createTransaction && !evmResult.execResult.exceptionError) {
				// We might want to consider executing all calls statelessly and seperately updating state after call is added
				// // to cannonical chain
				client.logger.debug('Checkpointing and committing evm state')
				copiedVm.stateManager.checkpoint()
				copiedVm.stateManager.commit()
			}
		} catch (e) {
			client.logger.error(e, 'callHandler: Unexpected error executing evm')
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
				client.logger.debug(
					'callHandler: Defaulting to false for creating a transaction',
				)
				return false
			}
			if (
				params.createTransaction === true ||
				params.createTransaction === 'always'
			) {
				client.logger.debug(
					"callHandler: Creating transaction because config set to 'always'",
				)
				return true
			}
			if (
				params.createTransaction === false ||
				params.createTransaction === 'never'
			) {
				client.logger.debug(
					"callHandler: Creating transaction because config set to 'never'",
				)
				return false
			}
			if (params.createTransaction === 'on-success') {
				client.logger.debug(
					"callHandler: Creating transaction because config set to 'on-success'",
				)
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
					...txOpts,
				},
				{
					allowUnlimitedInitCodeSize: false,
					common: copiedVm.common,
					freeze: true,
				},
			)
			client.logger.debug(
				tx,
				'callHandler: Created a new transaction from transaction data',
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
				client.logger.debug(
					{ requireSig, skipBalance: txOpts?.skipBalance },
					'callHandler: Adding tx to mempool',
				)
				pool.add(wrappedTx, requireSig, txOpts?.skipBalance ?? false)
				txHash = bytesToHex(wrappedTx.hash())
				client.logger.debug(
					txHash,
					'callHandler: received txHash now checkpointing state',
				)
				await copiedVm.stateManager.checkpoint()
				await copiedVm.stateManager.commit()
			} catch (e) {
				client.logger.error(
					e,
					'callHandler: Unexpected error adding transaction to mempool and checkpointing state. Removing transaction from mempool and reverting state',
				)
				pool.removeByHash(bytesToHex(tx.hash()))
				// don't expect this to ever happen at this point but being defensive
				await copiedVm.stateManager.revert()
				return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
					...callHandlerResult(evmResult, undefined, trace),
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
				client.logger.debug(
					'Reverting state manager rather than adding transaction to mempool',
				)
				await copiedVm.stateManager.revert()
			}
		}
		return /** @type {any}*/ (
			maybeThrowOnFail(
				params.throwOnFail ?? defaultThrowOnFail,
				callHandlerResult(evmResult, txHash, trace),
			)
		)
	}
