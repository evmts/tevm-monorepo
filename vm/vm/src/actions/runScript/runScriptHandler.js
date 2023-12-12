import { putContractCodeHandler } from '../putContractCode/putContractCodeHandler.js'
import { runContractCallHandler } from '../contractCall/runContractCallHandler.js'

/**
 * @type {import("./RunScriptHandlerGeneric.js").RunScriptHandler}
 */
export const runScriptHandler = async (
	tevm,
	{
		deployedBytecode,
		args,
		abi,
		caller,
		functionName,
	},
) => {
	const contractAddress = '0x00000000000000000000000000000000000000ff'
	await putContractCodeHandler(tevm, {
		contractAddress: '0x00000000000000000000000000000000000000ff',
		deployedBytecode,
	})
	return runContractCallHandler(tevm, /** @type {any} */({
		functionName,
		caller,
		args,
		contractAddress,
		abi,
	}))
}
