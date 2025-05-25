import { Block } from '@tevm/block'
import { Rlp } from '@tevm/rlp'
import { Trie } from '@tevm/trie'
import { type TypedTransaction } from '@tevm/tx'

import { Bloom, encodeReceipt } from '@ethereumjs/vm'
import { GasLimitExceededError } from '@tevm/errors'
import { KECCAK256_RLP } from '@tevm/utils'
import type { BaseVm } from '../BaseVm.js'
import type { RunBlockOpts, RunTxResult, TxReceipt } from '../utils/index.js'
import { errorMsg } from './errorMsg.js'
import { runTx } from './runTx.js'

/**
 * Applies the transactions in a block, computing the receipts
 * as well as gas usage and some relevant data. This method is
 * side-effect free (it doesn't modify the block nor the state).
 */
export const applyTransactions = (vm: BaseVm) => async (block: Block, opts: RunBlockOpts) => {
	const bloom = new Bloom(undefined, vm.common.ethjsCommon)
	// the total amount of gas used processing these transactions
	let gasUsed = 0n

	let receiptTrie: Trie | undefined = undefined
	if (block.transactions.length !== 0) {
		receiptTrie = new Trie({ common: vm.common.ethjsCommon })
	}

	const receipts: TxReceipt[] = []
	const txResults: RunTxResult[] = []

	/*
	 * Process transactions
	 */
	for (let txIdx = 0; txIdx < block.transactions.length; txIdx++) {
		const tx = block.transactions[txIdx] as TypedTransaction

		let maxGasLimit: bigint
		if ((vm.common as any).ethjsCommon.isActivatedEIP(1559) === true) {
			maxGasLimit = block.header.gasLimit * (vm.common as any).ethjsCommon.param('gasConfig', 'elasticityMultiplier')
		} else {
			maxGasLimit = block.header.gasLimit
		}
		const gasLimitIsHigherThanBlock = maxGasLimit < tx.gasLimit + gasUsed
		if (gasLimitIsHigherThanBlock) {
			const msg = errorMsg('tx has a higher gas limit than the block', vm, block)
			throw new GasLimitExceededError(msg)
		}

		// Run the tx through the VM
		const { skipBalance = false, skipNonce = false, skipHardForkValidation = true, reportPreimages = false } = opts

		const txRes = await runTx(vm)({
			tx,
			block,
			skipBalance,
			skipNonce,
			skipHardForkValidation,
			blockGasUsed: gasUsed,
			reportPreimages,
		})
		txResults.push(txRes)
		// Add to total block gas usage
		gasUsed += txRes.totalGasSpent
		// Combine blooms via bitwise OR
		bloom.or(txRes.bloom)

		// Add receipt to trie to later calculate receipt root
		receipts.push(txRes.receipt)
		const encodedReceipt = encodeReceipt(txRes.receipt, tx.type)
		await receiptTrie?.put(Rlp.encode(txIdx), encodedReceipt)
	}

	const receiptsRoot = receiptTrie !== undefined ? receiptTrie.root() : KECCAK256_RLP

	return {
		bloom,
		gasUsed,
		preimages: new Map<string, Uint8Array>(),
		receiptsRoot,
		receipts,
		results: txResults,
	}
}
