import { createImpersonatedTx, TransactionFactory } from '@evmts/zevm/tx'
import { createAddress } from '@tevm/address'
import { prefundedAccounts } from '@tevm/node'
import { bytesToHex, EthjsAddress } from '@tevm/utils'
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
		 * @type {import("@evmts/zevm/tx").FeeMarketEIP1559Transaction & {impersonatedAddress: import('@tevm/utils').EthjsAddress} }
		 **/
		const impersonatedTx = /** @type {any}*/ (tx)
		impersonatedTx.impersonatedAddress = createAddress(impersonatedAccount)
		tx = createImpersonatedTx(impersonatedTx)
	} else if (!tx.isSigned()) {
		client.logger.debug(
			'Raw Transaction is not signed. Consider calling impersonate endpoint. In future versions unsigned transactions will be rejected.',
		)
		/**
		 * @type {import("@evmts/zevm/tx").FeeMarketEIP1559Transaction & {impersonatedAddress: EthjsAddress} }
		 **/
		const impersonatedTx = /** @type {any}*/ (tx)
		impersonatedTx.impersonatedAddress = createAddress(
			impersonatedAccount ?? /** @type {import('@tevm/utils').Address} */ (prefundedAccounts[0]),
		)
		tx = createImpersonatedTx(impersonatedTx)
	}
	const transactionMode = client.miningConfig.type === 'auto' ? { addToBlockchain: true } : { addToMempool: true }
	const { errors, txHash } = await callHandler(client)({
		...params,
		...transactionMode,
		skipBalance: true,
	})
	if (errors?.length === 1) {
		throw errors[0]
	}
	if (errors?.length && errors.length > 1) {
		throw new AggregateError(errors)
	}
	return txHash ?? bytesToHex(tx.hash())
}
