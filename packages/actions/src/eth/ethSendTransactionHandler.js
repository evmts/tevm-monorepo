import { callHandler } from '../index.js'
import { TransactionFactory } from '@tevm/tx'
import { bytesToHex } from '@tevm/utils'

/**
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('@tevm/actions-types').EthSendTransactionHandler}
 */
export const ethSendTransactionHandler = (client) => async (params) => {
	const pool = await client.getTxPool()
	const tx = TransactionFactory.fromTxData(params)
	const { errors } = await callHandler(client)({
		...params,
		createTransaction: false,
		skipBalance: true,
	})
	if (errors?.length === 1) {
		throw errors[0]
	}
	if (errors?.length && errors.length > 1) {
		throw new AggregateError(errors)
	}
	await pool.addUnverified(tx)
	return bytesToHex(tx.hash())
}
