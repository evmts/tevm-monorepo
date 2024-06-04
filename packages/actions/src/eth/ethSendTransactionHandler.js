import { TransactionFactory, createImpersonatedTx } from '@tevm/tx'
import { EthjsAddress, bytesToHex } from '@tevm/utils'
import { callHandler } from '../index.js'

/**
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('@tevm/actions-types').EthSendTransactionHandler}
 */
export const ethSendTransactionHandler = (client) => async (params) => {
	let tx = TransactionFactory.fromTxData(params, {freeze: false})
	const impersonatedAccount = client.getImpersonatedAccount()
	if (!tx.isSigned() && impersonatedAccount !== undefined) {
		/**
		 * @type {import("@tevm/tx").FeeMarketEIP1559Transaction & {impersonatedAddress: EthjsAddress} }
		 **/
		const impersonatedTx = /** @type {any}*/ (tx)
		impersonatedTx.impersonatedAddress = EthjsAddress.fromString(impersonatedAccount)
		tx = createImpersonatedTx(impersonatedTx)
	} else if (!tx.isSigned()) {
		throw new Error('Invalid transaction in sendTransaction. Transaction is not signed. Consider calling anvil impersonate endpoint')
	}
	const { errors } = await callHandler(client)({
		...params,
		createTransaction: true,
		skipBalance: true,
	})
	if (errors?.length === 1) {
		throw errors[0]
	}
	if (errors?.length && errors.length > 1) {
		throw new AggregateError(errors)
	}
	return bytesToHex(tx.hash())
}
