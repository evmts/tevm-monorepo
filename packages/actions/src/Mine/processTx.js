import { BaseError, InvalidGasLimitError } from '@tevm/errors'
import { bytesToHex } from '@tevm/utils'

/**
 * @param {import('@tevm/node').TevmNode} client
 * @param {import('@tevm/tx').TypedTransaction} tx
 * @param {import('@tevm/vm').BlockBuilder} blockBuilder
 * @param {Array<import('@tevm/receipt-manager').TxReceipt>} receipts
 */
export const processTx = async (client, tx, blockBuilder, receipts) => {
	client.logger.debug({ txHash: bytesToHex(tx.hash()) }, 'new tx added')
	try {
		const txResult = await blockBuilder.addTransaction(tx, {
			skipHardForkValidation: true,
		})
		if (txResult.execResult.exceptionError) {
			if (txResult.execResult.exceptionError.error === 'out of gas') {
				client.logger.debug(txResult.execResult.executionGasUsed, 'out of gas')
			}
			client.logger.debug(
				txResult.execResult.exceptionError,
				`There was an exception when building block for tx ${bytesToHex(tx.hash())}`,
			)
		}
		receipts.push(txResult.receipt)
	} catch (e) {
		if (e instanceof InvalidGasLimitError) {
			throw e
		}
		if (!(e instanceof BaseError)) {
			client.logger.error(e, `There was an unexpected exception when building block for tx ${bytesToHex(tx.hash())}`)
			throw e
		}
		// if we get this far it means we didn't handle an expected error
		throw e
	}
}
