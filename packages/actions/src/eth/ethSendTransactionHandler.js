import { prefundedAccounts } from '@tevm/base-client'
import { TransactionFactory, createImpersonatedTx } from '@tevm/tx'
import { EthjsAddress, bytesToHex } from '@tevm/utils'
import { callHandler } from '../index.js'

// TODO we should be properly checking signatures

/**
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('@tevm/actions').EthSendTransactionHandler}
 */
export const ethSendTransactionHandler = (client) => async (params) => {
	let tx = TransactionFactory.fromTxData(params, { freeze: false })
	const impersonatedAccount = client.getImpersonatedAccount()
	if (!tx.isSigned() && impersonatedAccount !== undefined) {
		/**
		 * @type {import("@tevm/tx").FeeMarketEIP1559Transaction & {impersonatedAddress: EthjsAddress} }
		 **/
		const impersonatedTx = /** @type {any}*/ (tx)
		impersonatedTx.impersonatedAddress = EthjsAddress.fromString(impersonatedAccount)
		tx = createImpersonatedTx(impersonatedTx)
	} else if (!tx.isSigned()) {
		client.logger.debug(
			'Raw Transaction is not signed. Consider calling impersonate endpoint. In future versions unsigned transactions will be rejected.',
		)
		/**
		 * @type {import("@tevm/tx").FeeMarketEIP1559Transaction & {impersonatedAddress: EthjsAddress} }
		 **/
		const impersonatedTx = /** @type {any}*/ (tx)
		impersonatedTx.impersonatedAddress = EthjsAddress.fromString(
			impersonatedAccount ?? /** @type {import('@tevm/utils').Address} */ (prefundedAccounts[0]),
		)
		tx = createImpersonatedTx(impersonatedTx)
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
