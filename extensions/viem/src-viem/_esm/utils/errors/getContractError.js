import { AbiDecodingZeroDataError } from '../../errors/abi.js'
import { BaseError } from '../../errors/base.js'
import {
	ContractFunctionExecutionError,
	ContractFunctionRevertedError,
	ContractFunctionZeroDataError,
	RawContractError,
} from '../../errors/contract.js'
import { InternalRpcError } from '../../errors/rpc.js'
const EXECUTION_REVERTED_ERROR_CODE = 3
export function getContractError(
	err,
	{ abi, address, args, docsPath, functionName, sender },
) {
	const { code, data, message, shortMessage } =
		err instanceof RawContractError
			? err
			: err instanceof BaseError
			? err.walk((err) => 'data' in err) || err.walk()
			: {}
	let cause = err
	if (err instanceof AbiDecodingZeroDataError) {
		cause = new ContractFunctionZeroDataError({ functionName })
	} else if (
		[EXECUTION_REVERTED_ERROR_CODE, InternalRpcError.code].includes(code) &&
		(data || message || shortMessage)
	) {
		cause = new ContractFunctionRevertedError({
			abi,
			data: typeof data === 'object' ? data.data : data,
			functionName,
			message: shortMessage ?? message,
		})
	}
	return new ContractFunctionExecutionError(cause, {
		abi,
		args,
		contractAddress: address,
		docsPath,
		functionName,
		sender,
	})
}
//# sourceMappingURL=getContractError.js.map
