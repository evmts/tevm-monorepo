import { callHandler } from '../index.js'

/**
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('./EthHandler.js').EthCallHandler}
 */
export const ethCallHandler = (client) => async (params) => {
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
