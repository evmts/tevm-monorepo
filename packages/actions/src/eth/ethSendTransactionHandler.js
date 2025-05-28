import { createAddress } from '@tevm/address'
import { prefundedAccounts } from '@tevm/node'
import { TransactionFactory, createImpersonatedTx } from '@tevm/tx'
import { EthjsAddress, bytesToHex } from '@tevm/utils'
import { callHandler } from '../Call/callHandler.js'

// TODO we should be properly checking signatures

/**
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthHandler.js').EthSendTransactionHandler}
 */
export const ethSendTransactionHandler = (client) => async (params) => {
	let tx = TransactionFactory(
		{
			...params,
			data: params.data ?? new Uint8Array(),
		},
		{ freeze: false },
	)
	const impersonatedAccount = client.getImpersonatedAccount()
	if (!tx.isSigned() && impersonatedAccount !== undefined) {
		/**
		 * @type {import("@tevm/tx").FeeMarketEIP1559Transaction & {impersonatedAddress: import('@tevm/utils').EthjsAddress} }
		 **/
		const impersonatedTx = /** @type {any}*/ (tx)
		impersonatedTx.impersonatedAddress = createAddress(impersonatedAccount)
		tx = createImpersonatedTx(impersonatedTx)
	} else if (!tx.isSigned()) {
		client.logger.debug(
			'Raw Transaction is not signed. Consider calling impersonate endpoint. In future versions unsigned transactions will be rejected.',
		)
		/**
		 * @type {import("@tevm/tx").FeeMarketEIP1559Transaction & {impersonatedAddress: EthjsAddress} }
		 **/
		const impersonatedTx = /** @type {any}*/ (tx)
		impersonatedTx.impersonatedAddress = createAddress(
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
