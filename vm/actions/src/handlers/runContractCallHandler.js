import { putAccountHandler } from '../putAccount/putAccountHandler.js'
import { runCallHandler } from '../runCall/runCallHandler.js'
import { ContractDoesNotExistError } from './ContractDoesNotExistError.js'
import { defaultCaller } from './defaultCaller.js'
import { defaultGasLimit } from './defaultGasLimit.js'
import { Address } from '@ethereumjs/util'
import { decodeFunctionResult, encodeFunctionData, toHex } from 'viem'

/**
 * @type {import("./RunContractCallHandlerGeneric.js").RunContractCallHandlerGeneric}
 */
export const runContractCallHandler = async (
	tevm,
	{
		abi,
		args,
		functionName,
		caller = defaultCaller,
		contractAddress,
		gasLimit = defaultGasLimit,
	},
) => {
	if (caller === defaultCaller) {
		await putAccountHandler(tevm, {
			account: defaultCaller,
			balance: BigInt(0x11111111),
		})
	}

	// check early if contract exists
	const contract = await tevm._evm.stateManager.getContractCode(
		Address.fromString(contractAddress),
	)
	if (contract.length === 0) {
		throw new ContractDoesNotExistError(contractAddress)
	}

	const result = await runCallHandler(tevm, {
		to: contractAddress,
		caller: caller,
		origin: caller,
		// pass lots of gas
		gasLimit,
		data: encodeFunctionData(
			/** @type {any} */({
				abi,
				functionName,
				args,
			}),
		),
	})

	if (result.execResult.exceptionError) {
		// TODO Return the error instead of throwing
		throw result.execResult.exceptionError
	}

	return {
		gasUsed: result.execResult.executionGasUsed,
		logs: result.execResult.logs ?? [],
		data: decodeFunctionResult(
			/** @type any */({
				abi,
				data: toHex(result.execResult.returnValue),
				functionName,
			}),
		),
	}
}
