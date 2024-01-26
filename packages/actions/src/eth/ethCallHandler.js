import { callHandler } from '../index.js'

/**
 * @param {import('@ethereumjs/evm').EVM} evm
 * @returns {import('@tevm/actions-types').EthCallHandler}
 */
export const ethCallHandler = (evm) => async (params) => {
	return callHandler(evm)({ skipBalance: true, ...params }).then((res) => {
		if (res.errors?.length) {
			throw res.errors?.[0]
		}
		return res.rawData
	})
}
