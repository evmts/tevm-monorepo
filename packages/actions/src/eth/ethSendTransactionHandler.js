import { callHandler } from '../index.js'
import { TransactionFactory } from '@ethereumjs/tx'
import { bytesToHex } from '@tevm/utils'

/**
 * @param {Pick<import('@tevm/base-client').BaseClient, 'getVm' | 'getTxPool' | 'miningConfig' |  'mode'>} client
 * @returns {import('@tevm/actions-types').EthSendTransactionHandler}
 */
export const ethSendTransactionHandler = (client) => async (params) => {
	const tx = TransactionFactory.fromTxData(params)
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
