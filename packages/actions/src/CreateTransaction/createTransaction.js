import { createAddress } from '@tevm/address'
import { createImpersonatedTx } from '@tevm/tx'
import { EthjsAccount, bytesToHex } from '@tevm/utils'
import { getAccountHandler } from '../GetAccount/getAccountHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'

// TODO tevm_call should optionally take a signature too
// When it takes a real signature (like in case of eth.sendRawTransaction) we should
// use FeeMarketEIP1559Transaction rather than Impersonated
const requireSig = false

/**
 * @param {import('@tevm/node').TevmNode} client
 * @param {boolean} [defaultThrowOnFail]
 */
export const createTransaction = (client, defaultThrowOnFail = true) => {
	/**
	 * @param {object} params
	 * @param {import('@tevm/evm').EvmRunCallOpts} params.evmInput
	 * @param {import('@tevm/evm').EvmResult} params.evmOutput
	 * @param {bigint | undefined} [params.maxFeePerGas]
	 * @param {bigint | undefined} [params.maxPriorityFeePerGas]
	 * @param {boolean} [params.throwOnFail]
	 * @param {bigint | undefined} [params.userProvidedNonce]
	 */
	return async ({ evmInput, evmOutput, throwOnFail = defaultThrowOnFail, userProvidedNonce, ...priorityFeeOpts }) => {
		const vm = await client.getVm()
		const pool = await client.getTxPool()

		const accountAddress = evmInput.origin ?? createAddress(0)
		const account = await vm.stateManager.getAccount(accountAddress).catch(() => new EthjsAccount(0n, 0n))
		const hasEth = evmInput.skipBalance || (account?.balance ?? 0n) > 0n
		if (!hasEth) {
			return maybeThrowOnFail(throwOnFail, {
				errors: [
					{
						_tag: 'InsufficientBalance',
						name: 'InsufficientBalance',
						message: `Insufficientbalance: Account ${accountAddress} attempted to create a transaction with zero eth. Consider adding eth to account or using a different from or origin address`,
					},
				],
			})
		}
		const parentBlock = await vm.blockchain.getCanonicalHeadBlock()
		const priorityFee = 0n

		const dataFee = (() => {
			let out = 0n
			for (const entry of evmInput.data ?? []) {
				// 4 gas for zero bytes, 16 gas for non-zero bytes (standard EIP-2028 costs)
				out += entry === 0 ? 4n : 16n
			}
			return out
		})()

		const baseFee = (() => {
			let out = dataFee
			// Base transaction cost is 21000 gas
			const txFee = 21000n
			out += txFee
			const isCreation = (evmInput.to?.bytes.length ?? 0) === 0
			if (vm.common.ethjsCommon.gteHardfork('homestead') && isCreation) {
				// Contract creation cost is 32000 gas
				const txCreationFee = 32000n
				out += txCreationFee
			}
			return out
		})()

		const minimumGasLimit = baseFee + evmOutput.execResult.executionGasUsed
		const gasLimitWithExecutionBuffer = evmInput.gasLimit ?? (minimumGasLimit * 11n) / 10n

		if (gasLimitWithExecutionBuffer < minimumGasLimit) {
			console.warn('The manually set gas limit set by tx is lower than the estimated cost. It may fail once mined.')
		}

		const sender = evmInput.origin ?? evmInput.caller ?? createAddress(`0x${'00'.repeat(20)}`)

		const txPool = await client.getTxPool()
		const txs = await txPool.getBySenderAddress(sender)
		const accountNonce = ((await vm.stateManager.getAccount(sender)) ?? { nonce: 0n }).nonce

		// Use user-provided nonce if available, otherwise calculate next valid nonce
		const nonce = userProvidedNonce !== undefined ? userProvidedNonce : (() => {
			// Get the highest transaction nonce from the pool for this sender
			let highestPoolNonce = accountNonce - 1n
			for (const tx of txs) {
				if (tx.tx.nonce > highestPoolNonce) highestPoolNonce = tx.tx.nonce
			}
			// This ensures we never reuse nor skip a nonce
			return highestPoolNonce >= accountNonce ? highestPoolNonce + 1n : accountNonce
		})()
		client.logger.debug({ nonce, sender: sender.toString() }, 'creating tx with nonce')

		let maxFeePerGas = parentBlock.header.calcNextBaseFee() + priorityFee
		const baseFeePerGas = parentBlock.header.baseFeePerGas ?? 0n
		if (maxFeePerGas < baseFeePerGas) {
			maxFeePerGas = baseFeePerGas
		}

		// TODO we should be allowing actual real signed tx too here
		// TODO known bug here we should be allowing unlimited code size here based on user providing option
		// Just lazily not looking up how to get it from client.getVm().evm yet
		// Possible we need to make property public on client
		const tx = createImpersonatedTx(
			{
				impersonatedAddress: sender,
				nonce,
				gasLimit: gasLimitWithExecutionBuffer,
				maxFeePerGas: priorityFeeOpts.maxFeePerGas ?? maxFeePerGas,
				maxPriorityFeePerGas: priorityFeeOpts.maxPriorityFeePerGas ?? 0n,
				...(evmInput.to !== undefined ? { to: evmInput.to } : {}),
				...(evmInput.data !== undefined ? { data: evmInput.data } : {}),
				...(evmInput.value !== undefined ? { value: evmInput.value } : {}),
				// TODO we should handle non EIP-1559 txs here too
				gasPrice: null,
			},
			{
				allowUnlimitedInitCodeSize: false,
				common: vm.common.ethjsCommon,
				// we don't want to freeze because there is a hack to set tx.hash when building a block
				freeze: false,
			},
		)
		client.logger.debug(tx, 'callHandler: Created a new transaction from transaction data')
		let poolPromise =
			/**
			 * @type {Promise<{error: null; hash: `0x${string}`;} | {error: string; hash: `0x${string}`;}>}
			 */
			(Promise.resolve({}))
		try {
			client.logger.debug({ requireSig, skipBalance: evmInput.skipBalance }, 'callHandler: Adding tx to mempool')
			poolPromise = pool.add(tx, requireSig, evmInput.skipBalance ?? false)
			const txHash = bytesToHex(tx.hash())
			client.logger.debug(txHash, 'callHandler: received txHash')
			const account = await getAccountHandler(client)({
				address: /** @type {import('@tevm/utils').Hex}*/ (sender.toString()),
			})
			const balanceNeeded = tx.value + gasLimitWithExecutionBuffer * tx.maxFeePerGas
			const hasBalance = balanceNeeded <= account.balance
			if (evmInput?.skipBalance && !hasBalance) {
				await setAccountHandler(client)({
					address: /** @type {import('@tevm/utils').Hex}*/ (sender.toString()),
					balance: balanceNeeded,
				})
			}
			await poolPromise
			client.emit('newPendingTransaction', tx)
			return {
				txHash,
			}
		} catch (e) {
			await poolPromise.catch(() => {})
			if (typeof e === 'object' && e !== null && '_tag' in e && e._tag === 'AccountNotFound') {
				return maybeThrowOnFail(throwOnFail ?? defaultThrowOnFail, {
					errors: [
						{
							name: 'NoBalanceError',
							_tag: 'NoBalanceError',
							message: 'Attempting to create a transaction with an uninitialized account with no balance',
						},
					],
					executionGasUsed: 0n,
					/**
					 * @type {`0x${string}`}
					 */
					rawData: '0x',
				})
			}
			client.logger.error(
				e,
				'callHandler: Unexpected error adding transaction to mempool and checkpointing state. Removing transaction from mempool and reverting state',
			)
			pool.removeByHash(bytesToHex(tx.hash()))
			// don't expect this to ever happen at this point but being defensive
			await vm.stateManager.revert()
			return maybeThrowOnFail(throwOnFail ?? defaultThrowOnFail, {
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
	}
}
