import { InternalError, InvalidGasPriceError } from '@tevm/errors'
import { EthjsAccount, EthjsAddress, bytesToBigint, bytesToHex } from '@tevm/utils'
import { runTx } from '@tevm/vm'
import { numberToBytes } from 'viem'
import { createScript } from '../Contract/createScript.js'
import { createTransaction } from '../CreateTransaction/createTransaction.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { evmInputToImpersonatedTx } from '../internal/evmInputToImpersonatedTx.js'
import { forkAndCacheBlock } from '../internal/forkAndCacheBlock.js'
import { getL1FeeInformationOpStack } from '../internal/getL1FeeInformationOpStack.js'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'
import { runCallWithTrace } from '../internal/runCallWithTrace.js'
import { callHandlerOpts } from './callHandlerOpts.js'
import { callHandlerResult } from './callHandlerResult.js'
import { validateCallParams } from './validateCallParams.js'

/**
 * The callHandler is the most important function in Tevm.
 * It is the direct implementation of `tevm_call`.
 * It is also wrapped by all call-like actions including
 * - `eth_call`
 * - `debug_traceCall`
 * - etc.
 *
 * If it needs to create a transaction on the chain it sends it's results to [createTransactionHandler](./createTrasactionHandler.js)
 *
 * It has 5 steps
 * 0. Validate params
 * 1. Clone vm
 * 2. Run vm
 * 3. Create tx (if necessary)
 * 4. Return result
 */

/**
 * Creates a code splitable instance of [`client.tevmCall`](https://tevm.sh/reference/tevm/decorators/type-aliases/tevmactionsapi/#call) action
 * @param {import('@tevm/base-client').BaseClient} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail]
 * @returns {import('./CallHandlerType.js').CallHandler}
 * @throws {import('./TevmCallError.js').TevmCallError} if throwOnFail is true returns TevmCallError as value
 * @example
 * ```typescript
 * import { createBaseClient } from 'tevm/base-client'
 * import { callHandler } from 'tevm/actions'
 *
 * const client = createBaseClient()
 *
 * const call = callHandler(client)
 *
 * const res = await call({
 *   createTransaction: true,
 *   to: `0x${'69'.repeat(20)}`,
 *   value: 420n,
 *   skipBalance: true,
 * })
 * ```
 */
export const callHandler =
	(client, { throwOnFail: defaultThrowOnFail = true } = {}) =>
	async ({ code, deployedBytecode, ...params }) => {
		/**
		 * ***************
		 * 0 VALIDATE PARAMS
		 * ***************
		 */
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
		const _code = deployedBytecode ?? code
		const scriptResult = deployedBytecode
			? await createScript({ ...client, getVm: () => Promise.resolve(vm) }, _code, params.to)
			: { scriptAddress: /** @type {import('@tevm/utils').Address}*/ (params.to), errors: undefined }
		if (scriptResult.errors && scriptResult.errors.length > 0) {
			client.logger.debug(scriptResult.errors, 'contractHandler: Errors creating script')
			return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
				errors: scriptResult.errors,
				executionGasUsed: 0n,
				rawData: '0x',
			})
		}
		const _params = {
			...params,
			to: scriptResult.scriptAddress,
		}

		const { errors, data: evmInput } = await callHandlerOpts(client, _params)
		if (errors) {
			client.logger.error(errors ?? evmInput, 'callHandler: Unexpected error converting params to ethereumjs params')
			return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
				errors,
				executionGasUsed: 0n,
				rawData: /** utype {`0x${string}`}*/ '0x',
			})
		}

		/**
		 * ************
		 * 1 CLONE THE VM WITH BLOCK TAG
		 * ************
		 */
		client.logger.debug('Cloning vm to execute a call...')
		/**
		 * @type {import('@tevm/vm').Vm}
		 */
		let vm
		try {
			vm = await client.getVm().then((vm) => vm.deepCopy())

			const block = evmInput?.block
			// this will never happen the type is wrong internally
			if (!block) {
				throw new Error(
					'UnexpectedError: Internal block header does not have a state root. This potentially indicates a bug in tevm',
				)
			}
			if (_params.createTransaction && block !== (await vm.blockchain.getCanonicalHeadBlock())) {
				throw new Error('Creating transactions on past blocks is not currently supported')
			}
			// TODO why doesn't this type have stateRoot prop? It is always there.
			// Haven't looked into it so it might be a simple fix.
			/**
			 * @type {Uint8Array}
			 */
			const stateRoot = /** @type any*/ (block.header).stateRoot
			if (client.forkTransport && !(await vm.stateManager.hasStateRoot(stateRoot))) {
				forkAndCacheBlock(client, /** @type any*/ (block))
			}
			await vm.stateManager.setStateRoot(stateRoot)
			// if we are forking we need to update the block tag we are forking if the block is in past
			const forkBlock = vm.blockchain.blocksByTag.get('forked')
			if (client.forkTransport && forkBlock !== undefined && block.header.number < forkBlock.header.number) {
				vm.stateManager._baseState.options.fork = {
					transport: client.forkTransport,
					blockTag: block.header.number,
				}
				vm.blockchain.blocksByTag.set('forked', /** @type {any} */ (block))
			}
		} catch (e) {
			client.logger.error(e, 'callHandler: Unexpected error failed to clone vm')
			return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
				errors: [
					new InternalError(
						typeof e === 'string'
							? e
							: e instanceof Error
								? e.message
								: typeof e === 'object' && e !== null && 'message' in e && typeof e.message === 'string'
									? e.message
									: 'unknown error',

						{
							cause: /** @type {Error}*/ (e),
						},
					),
				],
				executionGasUsed: 0n,
				rawData: '0x',
			})
		}

		// Do a quick defensive check
		const shouldHaveContract = evmInput.to && evmInput.data && bytesToBigint(evmInput.data) !== 0n
		const isContract = evmInput.to && (await vm.stateManager.getContractCode(evmInput.to)).length > 0
		if (shouldHaveContract && !isContract) {
			client.logger.warn(
				`Data is being passed in a call to a to address ${evmInput.to?.toString()} with no contract bytecode!`,
			)
		}

		// start getting opstack information right away in parallel
		const l1FeeInfoPromise =
			vm.common.sourceId !== undefined
				? getL1FeeInformationOpStack(evmInput.data ?? numberToBytes(0), vm).catch((e) => {
						client.logger.warn(e, 'Unable to get l1 fee estimation')
						return {}
					})
				: Promise.resolve({})

		/**
		 * ************
		 * 2 RUN THE EVM
		 * ************
		 */
		/**
		 * @type {import('@tevm/vm').RunTxResult | undefined}
		 */
		let evmOutput = undefined
		/**
		 * @type {import('../debug/DebugResult.js').DebugTraceCallResult | undefined}
		 */
		let trace = undefined
		/**
		 * evm returns an access list without the 0x prefix
		 * @type {Map<string, Set<string>> | undefined}
		 */
		let accessList = undefined
		try {
			client.logger.debug(
				{
					to: evmInput.to?.toString(),
					origin: evmInput.origin?.toString(),
					caller: evmInput.caller?.toString(),
					value: evmInput.value?.toString(),
					gasLimit: evmInput.gasLimit?.toString(),
					data: evmInput.data,
				},
				'callHandler: Executing runCall with params',
			)
			if (_params.createTrace) {
				// this trace will be filled in when the tx runs
				trace = await runCallWithTrace(vm, client.logger, evmInput, true).then(({ trace }) => trace)
			}
			try {
				const tx = await evmInputToImpersonatedTx({
					...client,
					getVm: () => Promise.resolve(vm),
				})(evmInput, _params.maxFeePerGas, _params.maxPriorityFeePerGas)
				evmOutput = await runTx(vm)({
					reportAccessList: _params.createAccessList ?? false,
					reportPreimages: _params.createAccessList ?? false,
					skipHardForkValidation: true,
					skipBlockGasLimitValidation: true,
					// we currently set the nonce ourselves user can't set it
					skipNonce: true,
					skipBalance: evmInput.skipBalance ?? false,
					...(evmInput.block !== undefined ? { block: /** @type any*/ (evmInput.block) } : {}),
					tx,
				})
			} catch (e) {
				if (!(e instanceof Error)) {
					throw e
				}
				if (e.message.includes("is less than the block's baseFeePerGas")) {
					return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
						errors: [new InvalidGasPriceError('Tx aborted because gasPrice or maxFeePerGas is too low', { cause: e })],
						executionGasUsed: 0n,
						rawData: '0x',
						...(vm.common.sourceId !== undefined ? await l1FeeInfoPromise : {}),
						...(evmOutput && callHandlerResult(evmOutput, undefined, trace, accessList)),
					})
				}
				if (e.message.includes('invalid sender address, address is not an EOA (EIP-3607)')) {
					return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
						errors: [
							{
								name: 'InvalidSender',
								_tag: 'InvalidSender',
								message: e.message,
							},
						],
						executionGasUsed: 0n,
						rawData: '0x',
						...(vm.common.sourceId !== undefined ? await l1FeeInfoPromise : {}),
						...(evmOutput && callHandlerResult(evmOutput, undefined, trace, accessList)),
					})
				}
				if (e.message.includes('is lower than the minimum gas limit')) {
					return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
						errors: [
							{
								name: 'GasLimitTooLowForBaseFee',
								_tag: 'GasLimitTooLowForBaseFee',
								message: e.message,
							},
						],
						executionGasUsed: 0n,
						rawData: '0x',
						...(vm.common.sourceId !== undefined ? await l1FeeInfoPromise : {}),
						...(evmOutput && callHandlerResult(evmOutput, undefined, trace, accessList)),
					})
				}
				if (e.message.includes('tx has a higher gas limit than the block')) {
					return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
						errors: [
							{
								name: 'GasLimitExceeded',
								_tag: 'GasLimitExceeded',
								message: e.message,
							},
						],
						executionGasUsed: 0n,
						rawData: '0x',
						...(vm.common.sourceId !== undefined ? await l1FeeInfoPromise : {}),
						...(evmOutput && callHandlerResult(evmOutput, undefined, trace, accessList)),
					})
				}
				// When these happen we still want to run the tx
				if (
					e.message.includes('block has a different hardfork than the vm') ||
					e.message.includes("the tx doesn't have the correct nonce.") ||
					e.message.includes("sender doesn't have enough funds to send tx.") ||
					e.message.includes("sender doesn't have enough funds to send tx. The upfront cost is")
				) {
					const errors = e.message.includes('block has a different hardfork than the vm')
						? [
								{
									name: 'HardForkMismatch',
									_tag: 'HardForkMismatch',
									message: e.message,
								},
							]
						: e.message.includes("the tx doesn't have the correct nonce.")
							? [
									{
										name: 'InvalidNonce',
										_tag: 'InvalidNonce',
										message: e.message,
									},
								]
							: [
									{
										name: 'InsufficientBalance',
										_tag: 'InsufficientBalance',
										message: e.message,
									},
								]
					try {
						// TODO we should handle not impersonating real tx with real nonces
						const tx = await evmInputToImpersonatedTx({
							...client,
							getVm: () => Promise.resolve(vm),
						})(evmInput, _params.maxFeePerGas, _params.maxPriorityFeePerGas)
						// user might have tracing turned on hoping to trace why it's using too much gas
						/// calculate skipping all validation but still return errors too
						evmOutput = await runTx(vm)({
							reportAccessList: _params.createAccessList ?? false,
							reportPreimages: _params.createAccessList ?? false,
							skipHardForkValidation: true,
							skipBlockGasLimitValidation: true,
							// we currently set the nonce ourselves user can't set it
							skipNonce: true,
							skipBalance: true,
							...(evmInput.block !== undefined ? { block: /** @type any*/ (evmInput.block) } : {}),
							tx,
						})
						if (trace) {
							trace.gas = evmOutput.execResult.executionGasUsed
							trace.failed = true
							trace.returnValue = bytesToHex(evmOutput.execResult.returnValue)
						}
					} catch (e) {
						const message = e instanceof Error ? e.message : typeof e === 'string' ? e : 'unknown error'
						errors.push({ name: 'UnexpectedError', _tag: 'UnexpectedError', message })
					}
					return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
						errors,
						executionGasUsed: 0n,
						rawData: '0x',
						...(vm.common.sourceId !== undefined ? await l1FeeInfoPromise : {}),
						...(evmOutput && callHandlerResult(evmOutput, undefined, trace, accessList)),
					})
				}
				throw e
			}
			client.logger.debug(
				{
					returnValue: bytesToHex(evmOutput.execResult.returnValue),
					exceptionError: evmOutput.execResult.exceptionError,
					executionGasUsed: evmOutput.execResult.executionGasUsed,
				},
				'callHandler: runCall result',
			)
			if (_params.createAccessList && evmOutput.accessList !== undefined) {
				accessList = new Map(evmOutput.accessList.map((item) => [item.address, new Set(item.storageKeys)]))
			}
		} catch (e) {
			if (typeof e === 'object' && e !== null && '_tag' in e && (_params.throwOnFail ?? defaultThrowOnFail)) {
				throw e
			}
			client.logger.error(e, 'callHandler: Unexpected error executing evm')
			return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
				errors: [
					{
						name: 'UnexpectedError',
						_tag: 'UnexpectedError',
						message:
							typeof e === 'string'
								? e
								: e instanceof Error
									? e.message
									: typeof e === 'object' && e !== null && 'message' in e
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

		if (trace) {
			trace.gas = evmOutput.execResult.executionGasUsed
			trace.failed = false
			trace.returnValue = bytesToHex(evmOutput.execResult.returnValue)
		}

		/**
		 * ****************************
		 * 3 CREATE TRANSACTION WITH CALL (if neessary)
		 * ****************************
		 */
		/**
		 * @type {import('@tevm/utils').Hex | undefined}
		 */
		let txHash = undefined
		const shouldCreateTransaction = (() => {
			if (_params.createTransaction === undefined) {
				client.logger.debug('callHandler: Defaulting to false for creating a transaction')
				return false
			}
			if (_params.createTransaction === true || _params.createTransaction === 'always') {
				client.logger.debug("callHandler: Creating transaction because config set to 'always'")
				return true
			}
			if (_params.createTransaction === false || _params.createTransaction === 'never') {
				client.logger.debug("callHandler: Creating transaction because config set to 'never'")
				return false
			}
			if (_params.createTransaction === 'on-success') {
				client.logger.debug("callHandler: Creating transaction because config set to 'on-success'")
				return evmOutput.execResult.exceptionError === undefined
			}
			/**
			 * @type {never} this typechecks that we've exhausted all cases
			 */
			const invalidOption = _params.createTransaction
			throw new Error(`Invalid createTransaction value: ${invalidOption}`)
		})()
		if (shouldCreateTransaction) {
			client.logger.debug('creating a transaction in the mempool...')
			// quickly do a sanity check that eth exists at origin
			const accountAddress = evmInput.origin ?? EthjsAddress.zero()
			const account = await vm.stateManager.getAccount(accountAddress).catch(() => new EthjsAccount())
			const hasEth = evmInput.skipBalance || (account?.balance ?? 0n) > 0n
			if (!hasEth) {
				return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
					errors: [
						{
							_tag: 'InsufficientBalance',
							name: 'InsufficientBalance',
							message: `Insufficientbalance: Account ${accountAddress} attempted to create a transaction with zero eth. Consider adding eth to account or using a different from or origin address`,
						},
					],
					...(vm.common.sourceId !== undefined ? await l1FeeInfoPromise : {}),
					...callHandlerResult(evmOutput, undefined, trace, accessList),
				})
			}
			const txRes = await createTransaction(client)({
				throwOnFail: false,
				evmOutput,
				evmInput,
				maxPriorityFeePerGas: _params.maxPriorityFeePerGas,
				maxFeePerGas: _params.maxFeePerGas,
			})
			txHash = 'txHash' in txRes ? txRes.txHash : undefined
			if ('errors' in txRes && txRes.errors.length) {
				return /** @type {any}*/ (
					maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
						...('errors' in txRes ? { errors: txRes.errors } : {}),
						...(vm.common.sourceId !== undefined ? await l1FeeInfoPromise : {}),
						...callHandlerResult(evmOutput, undefined, trace, accessList),
					})
				)
			}
			client.logger.debug(txHash, 'Transaction successfully added')

			// handle automining
			if (client.miningConfig.type === 'auto') {
				client.logger.debug(`Automining transaction ${txHash}...`)
				const mineRes = await mineHandler(client)({ throwOnFail: false })
				if (mineRes.errors?.length) {
					return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
						...('errors' in mineRes ? { errors: mineRes.errors } : {}),
						...(vm.common.sourceId !== undefined ? await l1FeeInfoPromise : {}),
						...callHandlerResult(evmOutput, txHash, trace, accessList),
					})
				}
				client.logger.debug(mineRes, 'Transaction successfully mined')
			}
		}

		/**
		 * ******************
		 * 4 RETURN CALL RESULT
		 * ******************
		 */
		return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
			...(vm.common.sourceId !== undefined ? await l1FeeInfoPromise : {}),
			...callHandlerResult(evmOutput, txHash, trace, accessList),
		})
	}
