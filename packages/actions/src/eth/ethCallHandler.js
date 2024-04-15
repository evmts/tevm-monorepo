import { callHandler } from '../index.js'

/**
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('@tevm/actions-types').EthCallHandler}
 */
export const ethCallHandler = (client) => async (params) => {
	client.logger.debug(params, 'ethCallHandler called with params')
	return callHandler(client)({
		...params,
		createTransaction: false,
		skipBalance: true,
	}).then((res) => {
		if (res.errors?.length) {
			throw res.errors?.[0]
		}
		return res.rawData
	})
}
