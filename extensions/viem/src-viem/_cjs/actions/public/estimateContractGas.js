'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.estimateContractGas = void 0
const parseAccount_js_1 = require('../../accounts/utils/parseAccount.js')
const encodeFunctionData_js_1 = require('../../utils/abi/encodeFunctionData.js')
const getContractError_js_1 = require('../../utils/errors/getContractError.js')
const estimateGas_js_1 = require('./estimateGas.js')
async function estimateContractGas(
	client,
	{ abi, address, args, functionName, ...request },
) {
	const data = (0, encodeFunctionData_js_1.encodeFunctionData)({
		abi,
		args,
		functionName,
	})
	try {
		const gas = await (0, estimateGas_js_1.estimateGas)(client, {
			data,
			to: address,
			...request,
		})
		return gas
	} catch (err) {
		const account = request.account
			? (0, parseAccount_js_1.parseAccount)(request.account)
			: undefined
		throw (0, getContractError_js_1.getContractError)(err, {
			abi: abi,
			address,
			args,
			docsPath: '/docs/contract/estimateContractGas',
			functionName,
			sender: account?.address,
		})
	}
}
exports.estimateContractGas = estimateContractGas
//# sourceMappingURL=estimateContractGas.js.map
