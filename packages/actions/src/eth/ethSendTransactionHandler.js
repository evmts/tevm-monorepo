import { callHandler } from '../index.js'

/**
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('@tevm/actions-types').EthSendTransactionHandler}
 */
export const ethSendTransactionHandler = (client) => async (params) => {
	client.logger.debug(params, 'ethSendTransactionHandler called with params')
	const { errors, txHash } = await callHandler(client)({
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
	if (txHash === undefined) {
		client.logger.error(
			txHash,
			'UnexpectedError: No tx hash returned from callHandler. This indicates a bug in the client.',
		)
		throw new Error(
			'UnexpectedError: No tx hash returned from callHandler. This indicates a bug in the client.',
		)
	}
	return txHash
}
