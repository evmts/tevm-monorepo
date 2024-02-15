import { callHandler } from '../index.js'

/**
 * @param {Pick<import('@tevm/base-client').BaseClient, 'vm'>} client
 * @returns {import('@tevm/actions-types').EthCallHandler}
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
