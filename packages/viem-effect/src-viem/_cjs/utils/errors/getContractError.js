'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getContractError = void 0
const abi_js_1 = require('../../errors/abi.js')
const base_js_1 = require('../../errors/base.js')
const contract_js_1 = require('../../errors/contract.js')
const rpc_js_1 = require('../../errors/rpc.js')
const EXECUTION_REVERTED_ERROR_CODE = 3
function getContractError(
	err,
	{ abi, address, args, docsPath, functionName, sender },
) {
	const { code, data, message, shortMessage } =
		err instanceof contract_js_1.RawContractError
			? err
			: err instanceof base_js_1.BaseError
			? err.walk((err) => 'data' in err) || err.walk()
			: {}
	let cause = err
	if (err instanceof abi_js_1.AbiDecodingZeroDataError) {
		cause = new contract_js_1.ContractFunctionZeroDataError({ functionName })
	} else if (
		[EXECUTION_REVERTED_ERROR_CODE, rpc_js_1.InternalRpcError.code].includes(
			code,
		) &&
		(data || message || shortMessage)
	) {
		cause = new contract_js_1.ContractFunctionRevertedError({
			abi,
			data: typeof data === 'object' ? data.data : data,
			functionName,
			message: shortMessage ?? message,
		})
	}
	return new contract_js_1.ContractFunctionExecutionError(cause, {
		abi,
		args,
		contractAddress: address,
		docsPath,
		functionName,
		sender,
	})
}
exports.getContractError = getContractError
//# sourceMappingURL=getContractError.js.map
