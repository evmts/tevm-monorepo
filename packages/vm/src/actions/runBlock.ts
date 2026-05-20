import { Block } from '@tevm/block'
import { InternalError, InvalidParamsError } from '@tevm/errors'
import { bytesToHex, equalsBytes } from '@tevm/utils'
import type { BaseVm } from '../BaseVm.js'
import type { AfterBlockEvent, ApplyBlockResult, RunBlockOpts, RunBlockResult } from '../utils/index.js'
import { applyBlock } from './applyBlock.js'
import { applyDAOHardfork } from './applyDAOHardfork.js'
import { errorMsg } from './errorMsg.js'
import { genTxTrie } from './genTxTrie.js'

export type RunBlock = (opts: RunBlockOpts) => Promise<RunBlockResult>

const UNSUPPORTED_VERKLE_EXECUTION_MESSAGE =
	'Verkle/state-witness execution paths (EIP-6800 family) are intentionally unsupported in Tevm'

const setRunBlockHardfork = (vm: BaseVm, block: Block, setHardfork: RunBlockOpts['setHardfork']) => {
	if (setHardfork === undefined || setHardfork === false) {
		return
	}

	const previousVmHardfork = vm.common.ethjsCommon.hardfork()
	const evmCommon = vm.evm.common
	const previousEvmHardfork = evmCommon !== vm.common.ethjsCommon ? evmCommon?.hardfork?.() : undefined
	const previousBlockHardfork =
		block.common.ethjsCommon !== vm.common.ethjsCommon ? block.common.ethjsCommon.hardfork() : undefined
	const hardforkOpts: any = {
		blockNumber: block.header.number,
		timestamp: block.header.timestamp,
	}
	if (typeof setHardfork !== 'boolean') {
		hardforkOpts.totalDifficulty = setHardfork
	}

	vm.common.ethjsCommon.setHardforkBy(hardforkOpts)
	const hardfork = vm.common.ethjsCommon.hardfork()
	if (evmCommon !== vm.common.ethjsCommon) {
		evmCommon?.setHardfork?.(hardfork)
	}
	if (block.common.ethjsCommon !== vm.common.ethjsCommon) {
		block.common.ethjsCommon.setHardfork(hardfork)
	}

	return () => {
		vm.common.ethjsCommon.setHardfork(previousVmHardfork)
		if (previousEvmHardfork !== undefined) {
			evmCommon.setHardfork(previousEvmHardfork)
		}
		if (previousBlockHardfork !== undefined) {
			block.common.ethjsCommon.setHardfork(previousBlockHardfork)
		}
	}
}

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

		const restoreHardfork = setRunBlockHardfork(vm, block, opts.setHardfork)

		let result: ApplyBlockResult
		let previousRoot: Uint8Array | undefined
		let checkpointed = false
		let isVerkleExecutionEnabled = false

		try {
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
				previousRoot = await state.getStateRoot()
				await state.setStateRoot(root, clearCache)
			}

			// Checkpoint state
			await vm.evm.journal.checkpoint()
			checkpointed = true

			// check for DAO support and if we should apply the DAO fork
			if (
				vm.common.ethjsCommon.hardforkIsActiveOnBlock('dao', block.header.number) === true &&
				block.header.number === vm.common.ethjsCommon.hardforkBlock('dao')
			) {
				await applyDAOHardfork(vm.evm)
			}

			isVerkleExecutionEnabled = block.common.ethjsCommon.isActivatedEIP(6800)
			if (isVerkleExecutionEnabled) {
				throw new InvalidParamsError(UNSUPPORTED_VERKLE_EXECUTION_MESSAGE)
			}

			result = await applyBlock(vm)(block, opts)

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
			} else if (isVerkleExecutionEnabled === false) {
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

			// Persist state only after all post-execution validation passes.
			await vm.evm.journal.commit()
			checkpointed = false
		} catch (err: any) {
			if (checkpointed) {
				await vm.evm.journal.revert()
			}
			if (previousRoot !== undefined) {
				await state.setStateRoot(previousRoot, clearCache)
			}
			throw err
		} finally {
			restoreHardfork?.()
		}

		const stateRoot = await state.getStateRoot()

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
