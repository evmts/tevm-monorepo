'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.writeContract = void 0
const encodeFunctionData_js_1 = require('../../utils/abi/encodeFunctionData.js')
const sendTransaction_js_1 = require('./sendTransaction.js')
async function writeContract(
	client,
	{ abi, address, args, dataSuffix, functionName, ...request },
) {
	const data = (0, encodeFunctionData_js_1.encodeFunctionData)({
		abi,
		args,
		functionName,
	})
	const hash = await (0, sendTransaction_js_1.sendTransaction)(client, {
		data: `${data}${dataSuffix ? dataSuffix.replace('0x', '') : ''}`,
		to: address,
		...request,
	})
	return hash
}
exports.writeContract = writeContract
//# sourceMappingURL=writeContract.js.map
