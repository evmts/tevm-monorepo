'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.deployContract = void 0
const encodeDeployData_js_1 = require('../../utils/abi/encodeDeployData.js')
const sendTransaction_js_1 = require('./sendTransaction.js')
function deployContract(walletClient, { abi, args, bytecode, ...request }) {
	const calldata = (0, encodeDeployData_js_1.encodeDeployData)({
		abi,
		args,
		bytecode,
	})
	return (0, sendTransaction_js_1.sendTransaction)(walletClient, {
		...request,
		data: calldata,
	})
}
exports.deployContract = deployContract
//# sourceMappingURL=deployContract.js.map
