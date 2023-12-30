'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.simulateContract = void 0
const parseAccount_js_1 = require('../../accounts/utils/parseAccount.js')
const decodeFunctionResult_js_1 = require('../../utils/abi/decodeFunctionResult.js')
const encodeFunctionData_js_1 = require('../../utils/abi/encodeFunctionData.js')
const getContractError_js_1 = require('../../utils/errors/getContractError.js')
const call_js_1 = require('./call.js')
async function simulateContract(
	client,
	{ abi, address, args, dataSuffix, functionName, ...callRequest },
) {
	const account = callRequest.account
		? (0, parseAccount_js_1.parseAccount)(callRequest.account)
		: undefined
	const calldata = (0, encodeFunctionData_js_1.encodeFunctionData)({
		abi,
		args,
		functionName,
	})
	try {
		const { data } = await (0, call_js_1.call)(client, {
			batch: false,
			data: `${calldata}${dataSuffix ? dataSuffix.replace('0x', '') : ''}`,
			to: address,
			...callRequest,
		})
		const result = (0, decodeFunctionResult_js_1.decodeFunctionResult)({
			abi,
			args,
			functionName,
			data: data || '0x',
		})
		return {
			result,
			request: {
				abi,
				address,
				args,
				dataSuffix,
				functionName,
				...callRequest,
			},
		}
	} catch (err) {
		throw (0, getContractError_js_1.getContractError)(err, {
			abi: abi,
			address,
			args,
			docsPath: '/docs/contract/simulateContract',
			functionName,
			sender: account?.address,
		})
	}
}
exports.simulateContract = simulateContract
//# sourceMappingURL=simulateContract.js.map
