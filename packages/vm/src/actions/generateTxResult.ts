import { Capability, isBlob4844Tx } from '@tevm/tx'
import type { TypedTransaction } from '@tevm/tx'
import type { BaseVm } from '../BaseVm.js'
import type {
	BaseTxReceipt,
	EIP4844BlobTxReceipt,
	PostByzantiumTxReceipt,
	PreByzantiumTxReceipt,
	RunTxResult,
	TxReceipt,
} from '../utils/index.js'

/**
 * Returns the tx receipt.
 * @param this The vm instance
 * @param tx The transaction
 * @param txResult The tx result
 * @param cumulativeGasUsed The gas used in the block including this tx
 * @param blobGasUsed The blob gas used in the tx
 * @param blobGasPrice The blob gas price for the block including this tx
 */
export const generateTxReceipt =
	(vm: BaseVm) =>
	async (
		tx: TypedTransaction,
		txResult: RunTxResult,
		cumulativeGasUsed: bigint,
		blobGasUsed?: bigint,
		blobGasPrice?: bigint,
	): Promise<TxReceipt> => {
		const baseReceipt: BaseTxReceipt = {
			cumulativeBlockGasUsed: cumulativeGasUsed,
			bitvector: txResult.bloom.bitvector,
			logs: txResult.execResult.logs ?? [],
		}

		let receipt: PostByzantiumTxReceipt | PreByzantiumTxReceipt | EIP4844BlobTxReceipt

		if (!tx.supports(Capability.EIP2718TypedTransaction)) {
			// Legacy transaction
			if (vm.common.vmConfig.gteHardfork('byzantium') === true) {
				// Post-Byzantium
				receipt = {
					status: txResult.execResult.exceptionError !== undefined ? 0 : 1, // Receipts have a 0 as status on error
					...baseReceipt,
				} as PostByzantiumTxReceipt
			} else {
				// Pre-Byzantium
				const stateRoot = await vm.stateManager.getStateRoot()
				receipt = {
					stateRoot,
					...baseReceipt,
				} as PreByzantiumTxReceipt
			}
		} else {
			// Typed EIP-2718 Transaction
			if (isBlob4844Tx(tx)) {
				receipt = {
					blobGasUsed,
					blobGasPrice,
					status: txResult.execResult.exceptionError ? 0 : 1,
					...baseReceipt,
				} as EIP4844BlobTxReceipt
			} else {
				receipt = {
					status: txResult.execResult.exceptionError ? 0 : 1,
					...baseReceipt,
				} as PostByzantiumTxReceipt
			}
		}
		return receipt
	}
