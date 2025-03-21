import { Block } from '@tevm/block'
import { bytesToHex, equalsBytes } from '@tevm/utils'

import { InternalError } from '@tevm/errors'
import type { BaseVm } from '../BaseVm.js'
import type { AfterBlockEvent, ApplyBlockResult, RunBlockOpts, RunBlockResult } from '../utils/index.js'
import { applyBlock } from './applyBlock.js'
import { applyDAOHardfork } from './applyDAOHardfork.js'
import { errorMsg } from './errorMsg.js'
import { genTxTrie } from './genTxTrie.js'

export type RunBlock = (opts: RunBlockOpts) => Promise<RunBlockResult>

/**
 * @ignore
 */
export const runBlock =
	(vm: BaseVm): RunBlock =>
	async (opts) => {
		await vm.ready()
		const state = vm.stateManager

		const { root } = opts
		const clearCache = opts.clearCache ?? true
		let { block } = opts
		const generateFields = opts.generate === true

		/**
		 * The `beforeBlock` event.
		 *
		 * @event Event: beforeBlock
		 * @type {Object}
		 * @property {Block} block emits the block that is about to be processed
		 */
		await vm._emit('beforeBlock', block)

		// Set state root if provided
		if (root) {
			await state.setStateRoot(root, clearCache)
		}

		// check for DAO support and if we should apply the DAO fork
		if (
			vm.common.vmConfig.hardforkIsActiveOnBlock('dao', block.header.number) === true &&
			block.header.number === vm.common.vmConfig.hardforkBlock('dao')
		) {
			await vm.evm.journal.checkpoint()
			await applyDAOHardfork(vm.evm)
			await vm.evm.journal.commit()
		}

		// Checkpoint state
		await vm.evm.journal.checkpoint()

		let result: ApplyBlockResult

		try {
			result = await applyBlock(vm)(block, opts)
		} catch (err: any) {
			await vm.evm.journal.revert()
			throw err
		}

		// Persist state
		await vm.evm.journal.commit()

		await state.setStateRoot(block.header.stateRoot)

		const stateRoot = await state.getStateRoot()

		// Given the generate option, either set resulting header
		// values to the current block, or validate the resulting
		// header values against the current block.
		if (generateFields) {
			const bloom = result.bloom.bitvector
			const gasUsed = result.gasUsed
			const receiptTrie = result.receiptsRoot
			const transactionsTrie = await genTxTrie(block)
			const generatedFields = { stateRoot, bloom, gasUsed, receiptTrie, transactionsTrie }
			const blockData = {
				...block,
				header: { ...block.header, ...generatedFields },
			}
			// TODO remove as any just being lazy here this error is from tevm stricter ts config compared to ethereumjs
			block = Block.fromBlockData(blockData as any, { common: vm.common })
		} else if (vm.common.vmConfig.isActivatedEIP(6800) === false) {
			// Only validate the following headers if verkle blocks aren't activated
			if (equalsBytes(result.receiptsRoot, block.header.receiptTrie) === false) {
				const msg = errorMsg('invalid receiptTrie', vm, block)
				throw new InternalError(msg)
			}
			if (!(equalsBytes(result.bloom.bitvector, block.header.logsBloom) === true)) {
				const msg = errorMsg('invalid bloom', vm, block)
				throw new InternalError(msg)
			}
			if (result.gasUsed !== block.header.gasUsed) {
				const msg = errorMsg('invalid gasUsed', vm, block)
				throw new InternalError(msg)
			}
			if (!(equalsBytes(stateRoot, block.header.stateRoot) === true)) {
				const msg = errorMsg(
					`invalid block stateRoot, got: ${bytesToHex(stateRoot)}, want: ${bytesToHex(block.header.stateRoot)}`,
					vm,
					block,
				)
				throw new InternalError(msg)
			}
		}

		const results: RunBlockResult = {
			receipts: result.receipts,
			logsBloom: result.bloom.bitvector,
			results: result.results,
			stateRoot,
			gasUsed: result.gasUsed,
			receiptsRoot: result.receiptsRoot,
			...(result.preimages !== undefined ? { preimages: result.preimages } : {}),
		}

		const afterBlockEvent: AfterBlockEvent = { ...results, block }

		/**
		 * The `afterBlock` event
		 *
		 * @event Event: afterBlock
		 * @type {AfterBlockEvent}
		 * @property {AfterBlockEvent} result emits the results of processing a block
		 */
		await vm._emit('afterBlock', afterBlockEvent)
		return results
	}
