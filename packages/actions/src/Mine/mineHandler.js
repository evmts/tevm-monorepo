import { InternalError, MisconfiguredClientError, UnreachableCodeError } from '@tevm/errors'
import { bytesToHex, hexToBytes } from '@tevm/utils'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'
import { emitEvents } from './emitEvents.js'
import { validateMineParams } from './validateMineParams.js'

// TODO Errors can leave us in bad states

/**
 * @param {import("@tevm/node").TevmNode} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail] whether to default to throwing or not when errors occur
 * @returns {import('./MineHandlerType.js').MineHandler}
 */
export const mineHandler =
	(client, options = {}) =>
	async ({ throwOnFail = options.throwOnFail ?? true, ...params } = {}) => {
		switch (client.status) {
			case 'MINING': {
				const err = new MisconfiguredClientError('Mining is already in progress')
				return maybeThrowOnFail(throwOnFail, { errors: [err] })
			}
			case 'INITIALIZING': {
				await client.ready()
				client.status = 'MINING'
				break
			}
			case 'SYNCING': {
				const err = new MisconfiguredClientError('Syncing not currently implemented')
				return maybeThrowOnFail(throwOnFail, { errors: [err] })
			}
			case 'STOPPED': {
				const err = new MisconfiguredClientError('Client is stopped')
				return maybeThrowOnFail(throwOnFail, { errors: [err] })
			}
			case 'READY': {
				client.status = 'MINING'
				break
			}
			default: {
				const err = new UnreachableCodeError(client.status)
				return maybeThrowOnFail(throwOnFail, { errors: [err] })
			}
		}
		try {
			client.logger.debug({ throwOnFail, ...params }, 'mineHandler called with params')
			const errors = validateMineParams(params)
			if (errors.length > 0) {
				return maybeThrowOnFail(throwOnFail, { errors })
			}
			// Support both blocks and blockCount for backward compatibility
			const { interval = 1, blockCount = params.blocks ?? 1 } = params

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
			const receiptsManager = await client.getReceiptsManager()

			for (let count = 0; count < blockCount; count++) {
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
				// TODO we need to actually handle this
				const blockFull = false
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
					return maybeThrowOnFail(throwOnFail, {
						errors: [
							new InternalError(
								'InternalError: State root not found in mineHandler. This indicates a potential inconsistency in state management.',
							),
						],
					})
				}

				originalVm.stateManager.saveStateRoot(block.header.stateRoot, value)
			}
			originalVm.blockchain = vm.blockchain
			originalVm.evm.blockchain = vm.evm.blockchain
			await originalVm.stateManager.setStateRoot(hexToBytes(vm.stateManager._baseState.getCurrentStateRoot()))

			await emitEvents(client, newBlocks, newReceipts, params)

			return { blockHashes: newBlocks.map((b) => bytesToHex(b.hash())) }
		} catch (e) {
			return maybeThrowOnFail(throwOnFail, {
				errors: [new InternalError(/** @type {Error} */ (e).message, { cause: e })],
			})
		} finally {
			client.status = 'READY'
		}
	}
