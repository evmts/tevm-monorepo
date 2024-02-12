import { callHandler } from '../index.js'

/**
 * @param {import('@tevm/vm').TevmVm} vm
 * @returns {import('@tevm/actions-types').EthCallHandler}
 */
export const ethCallHandler = (vm) => async (params) => {
	return callHandler(vm)({
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
