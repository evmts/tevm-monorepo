import { bytesToHex, hexToBytes } from '@tevm/utils'
import { validateMineParams } from './validateMineParams.js'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'

// TODO Errors can leave us in bad states

/**
 * @param {import("@tevm/base-client").BaseClient} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail] whether to default to throwing or not when errors occur
 * @returns {import('./MineHandlerType.js').MineHandler}
 */
export const mineHandler =
	(client, options = {}) =>
	async ({ throwOnFail = options.throwOnFail ?? true, ...params } = {}) => {
		client.logger.debug({ throwOnFail, ...params }, 'mineHandler called with params')
		const errors = validateMineParams(params)
		if (errors.length > 0) {
			return maybeThrowOnFail(throwOnFail, { errors })
		}
		const { interval = 1, blockCount = 1 } = params

		/**
		 * @type {Array<import('@tevm/block').Block>}
		 */
		const newBlocks = []
		/**
		 * @type {Map<import('@tevm/utils').Hex,Array<import('@tevm/receipt-manager').TxReceipt>>}
		 */
		const newReceipts = new Map()

		client.logger.debug({ blockCount }, 'processing txs')
		const pool = await client.getTxPool()
		const originalVm = await client.getVm()
		const vm = await originalVm.deepCopy()

		for (let count = 0; count < blockCount; count++) {
			const receiptsManager = await client.getReceiptsManager()
			const parentBlock = await vm.blockchain.getCanonicalHeadBlock()

			let timestamp = Math.max(Math.floor(Date.now() / 1000), Number(parentBlock.header.timestamp))
			timestamp = count === 0 ? timestamp : timestamp + interval

			const blockBuilder = await vm.buildBlock({
				parentBlock,
				headerData: {
					timestamp,
					number: parentBlock.header.number + 1n,
					// The following 2 are currently not supported
					// difficulty: undefined,
					// coinbase,
					gasLimit: parentBlock.header.gasLimit,
					baseFeePerGas: parentBlock.header.calcNextBaseFee(),
				},
				blockOpts: {
					// Proof of authority not currently supported
					// cliqueSigner,
					// proof of work not currently supported
					//calcDifficultyFromHeader,
					//ck
					freeze: false,
					setHardfork: false,
					putBlockIntoBlockchain: false,
					common: vm.common,
				},
			})
			// TODO create a Log manager
			const orderedTx = await pool.txsByPriceAndNonce({ baseFee: parentBlock.header.calcNextBaseFee() })

			let index = 0
			let blockFull = false
			/**
			 * @type {Array<import('@tevm/receipt-manager').TxReceipt>}
			 */
			const receipts = []
			while (index < orderedTx.length && !blockFull) {
				const nextTx = /** @type {import('@tevm/tx').TypedTransaction}*/ (orderedTx[index])
				client.logger.debug(bytesToHex(nextTx.hash()), 'new tx added')
				const txResult = await blockBuilder.addTransaction(nextTx, {
					skipHardForkValidation: true,
				})
				if (txResult.execResult.exceptionError) {
					if (txResult.execResult.exceptionError.error === 'out of gas') {
						client.logger.debug(txResult.execResult.executionGasUsed, 'out of gas')
					}
					client.logger.debug(
						txResult.execResult.exceptionError,
						`There was an exception when building block for tx ${bytesToHex(nextTx.hash())}`,
					)
				}
				receipts.push(txResult.receipt)
				index++
			}
			await vm.stateManager.checkpoint()
			const createNewStateRoot = true
			await vm.stateManager.commit(createNewStateRoot)
			const block = await blockBuilder.build()
			await Promise.all([receiptsManager.saveReceipts(block, receipts), vm.blockchain.putBlock(block)])
			pool.removeNewBlockTxs([block])

			newBlocks.push(block)
			newReceipts.set(bytesToHex(block.hash()), receipts)

			const value = vm.stateManager._baseState.stateRoots.get(bytesToHex(block.header.stateRoot))

			if (!value) {
				throw new Error(
					'InternalError: State root not found in mineHandler. This indicates a potential inconsistency in state management.',
				)
			}

			originalVm.stateManager.saveStateRoot(block.header.stateRoot, value)
		}
		originalVm.blockchain = vm.blockchain
		originalVm.evm.blockchain = vm.evm.blockchain
		await originalVm.stateManager.setStateRoot(hexToBytes(vm.stateManager._baseState.getCurrentStateRoot()))

		// emit newBlock events
		newBlocks.forEach((block) => {
			client.emit('newBlock', block)
			const receipts = newReceipts.get(bytesToHex(block.hash()))
			if (!receipts) {
				throw new Error('InternalError: Receipts not found in mineHandler. This indicates a bug in tevm.')
			}
			receipts.forEach((receipt) => {
				client.emit('newReceipt', receipt)
				receipt.logs.forEach((log) => {
					client.emit('newLog', log)
				})
			})
		})

		return { blockHashes: newBlocks.map((b) => bytesToHex(b.hash())) }
	}
